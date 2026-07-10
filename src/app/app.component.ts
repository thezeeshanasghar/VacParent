import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public unreadCount = 0;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home'
    },
    {
      title: 'Your children',
      url: '/child',
      icon: 'people'
    },
    {
      title: 'Vaccines',
      url: '/vaccines',
      icon: 'school'
    },
    {
      title: 'About Us',
      url: '/about',
      icon: 'information-circle'
    },
    {
      title: 'Change Password',
      url: '/change-password',
      icon: 'lock-closed'
    }
  ];
  private notificationsSub: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    public loginservice: LoginService,
    public bookingService: BookingService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    // const path = window.location.pathname.split('folder/')[1];
    // if (path !== undefined) {
    //   this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    // }
    this.storage.get(environment.USER_Id).then(value => {
      if (value) {
        this.loginservice.changeState(true);
        this.notificationsSub = this.bookingService.getParentNotifications(value).subscribe(
          function(res) {
            if (res && res.IsSuccess && Array.isArray(res.ResponseData)) {
              this.bookingService.unreadCount = res.ResponseData.filter(function(n) { return !n.IsRead; }).length;
            } else {
              this.bookingService.unreadCount = 0;
            }
          }.bind(this),
          function() {}
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.notificationsSub) this.notificationsSub.unsubscribe();
  }

  clearStorage() {
    this.storage.clear();
  }
}