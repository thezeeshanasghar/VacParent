import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
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
    private storage: Storage,
    private toastService: ToastService
  ) {}

  async ionViewDidEnter() {
    this.userId = await this.storage.get(environment.USER_Id);
    this.load();
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

  statusColor(status: string): string {
    if (status === 'Confirmed') return 'success';
    if (status === 'Cancelled') return 'danger';
    return 'medium';
  }

  openLocation(url: string) {
    if (url) window.open(url, '_blank');
  }
}
