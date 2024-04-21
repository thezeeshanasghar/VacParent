import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'mail'
    },
    {
      title: 'My Child',
      url: '/child',
      icon: 'paper-plane'
    },
    {
      title: 'Vaccines',
      url: '/dashboard',
      icon: 'heart'
    },

  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    public loginservice: LoginService,
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
        let state = true;
        this.loginservice.changeState(state);
      }
    });
  }
  clearStorage() {
    this.storage.clear();
  }
}
