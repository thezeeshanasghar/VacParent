import { Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage {
  bookings: any[] = [];
  userId: any;

  constructor(
    private bookingService: BookingService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private storage: Storage,
    private toastService: ToastService
  ) {}

  async ionViewDidEnter() {
    this.userId = await this.storage.get(environment.USER_Id);
    this.load();
    this.bookingService.markAllReadParent(this.userId).subscribe(() => {
      this.bookingService.unreadCount = 0;
    }, () => {});
  }

  async load() {
    const loading = await this.loadingController.create({ message: 'Loading' });
    await loading.present();
    this.bookingService.getByParent(this.userId).subscribe(
      res => {
        if (res.IsSuccess) this.bookings = res.ResponseData;
        loading.dismiss();
      },
      err => { loading.dismiss(); this.toastService.create(err, 'danger'); }
    );
  }

  doRefresh(event: any) {
    this.bookingService.getByParent(this.userId).subscribe(
      res => {
        if (res.IsSuccess) this.bookings = res.ResponseData;
        event.target.complete();
      },
      err => {
        this.toastService.create(err, 'danger');
        event.target.complete();
      }
    );
  }

  get confirmedCount(): number {
    return this.bookings.filter(b => b.Status === 'Confirmed').length;
  }

  get pendingCount(): number {
    return this.bookings.filter(b => b.Status !== 'Confirmed' && b.Status !== 'Cancelled').length;
  }

  statusBadgeClass(status: string): string {
    if (status === 'Confirmed') return 'badge-confirmed';
    if (status === 'Cancelled') return 'badge-cancelled';
    return 'badge-pending';
  }

  async cancelBooking(booking: any) {
    const alert = await this.alertController.create({
      header: 'Cancel Booking',
      message: 'Are you sure you want to cancel this booking?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes, Cancel',
          handler: () => {
            this.bookingService.cancelBooking(booking.Id).subscribe(
              res => {
                if (res && res.IsSuccess) {
                  booking.Status = 'Cancelled';
                  this.toastService.create('Booking cancelled.');
                } else {
                  this.toastService.create((res && res.Message) ? res.Message : 'Could not cancel booking.', 'danger');
                }
              },
              err => { this.toastService.create('Could not cancel booking.', 'danger'); }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  openLocation(url: string) {
    if (url) window.open(url, '_blank');
  }
}
