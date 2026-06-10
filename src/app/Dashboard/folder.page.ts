import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {
  public folder: string;
  public isDoctor1: boolean = true;
  private notificationsSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginservice: LoginService,
    public router: Router,
    private storage: Storage,
    public bookingService: BookingService
  ) { }

  ngOnInit() {
    if (!this.loginservice.isAuthenticated()) {
      this.router.navigate(['login']);
    }
  }

  ionViewDidEnter() {
    this.storage.get(environment.DOCTOR_Id).then(doctorId => {
      this.isDoctor1 = doctorId == null || doctorId == 1;
    });

    this.storage.get(environment.USER_Id).then(userId => {
      if (userId) {
        if (this.notificationsSub) this.notificationsSub.unsubscribe();
        this.notificationsSub = this.bookingService.getParentNotifications(userId).subscribe(
          (res: any) => {
            if (res && res.IsSuccess && res.ResponseData) {
              this.bookingService.unreadCount = res.ResponseData.UnreadCount || 0;
            }
          },
          () => {}
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.notificationsSub) this.notificationsSub.unsubscribe();
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  clearStorage() {
    this.storage.clear();
    this.router.navigate(['login']);
  }
}
