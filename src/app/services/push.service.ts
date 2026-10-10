import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';
import { BookingService } from './booking.service';
import { ToastService } from './toast.service';

// Registers this phone for push notifications after login and routes a tapped notification to the right page.
// Does nothing in a browser. The server decides what is sent; this only hands over the FCM token.
@Injectable({ providedIn: 'root' })
export class PushService {
  private token = '';
  private listening = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  async start() {
    if (!Capacitor.isNativePlatform()) { return; }
    try {
      if (!this.listening) {
        this.listening = true;
        PushNotifications.addListener('registration', t => {
          this.token = t.value;
          this.send('register');
        });
        PushNotifications.addListener('registrationError', e => console.error('Push registration failed', e));
        // App open: the system shows nothing, so show it ourselves and refresh the bell count.
        PushNotifications.addListener('pushNotificationReceived', n => {
          this.bookingService.unreadCount++;
          this.toast.create((n.title ? n.title + ': ' : '') + (n.body || ''), 'primary');
        });
        PushNotifications.addListener('pushNotificationActionPerformed', a => this.open((a.notification && a.notification.data) || {}));
      }
      let perm = await PushNotifications.checkPermissions();
      if (perm.receive === 'prompt' || perm.receive === 'prompt-with-rationale') {
        perm = await PushNotifications.requestPermissions();
      }
      if (perm.receive !== 'granted') { return; }
      await PushNotifications.register();
    } catch (e) {
      console.error('Push start failed', e);
    }
  }

  // Call before the session is cleared so the request still carries the login token.
  stop(): Promise<void> {
    if (!this.token) { return Promise.resolve(); }
    return new Promise<void>(resolve => {
      const done = () => { this.token = ''; resolve(); };
      this.http.post(`${environment.BASE_URL}device/unregister`, { Token: this.token }).subscribe(done, done);
      setTimeout(done, 2500);
    });
  }

  private send(action: 'register' | 'unregister') {
    this.http.post(`${environment.BASE_URL}device/${action}`, {
      Token: this.token,
      Platform: Capacitor.getPlatform(),
      AppFlavor: 'parent'
    }).subscribe(() => {}, e => console.error('Push ' + action + ' failed', e));
  }

  private open(data: any) {
    const type = data.type || '';
    if (type.indexOf('Booking') === 0) { this.router.navigate(['/bookings']); return; }
    if (data.childId && (type === 'VaccineDue' || type === 'VaccineGiven' || type === 'FollowUp')) {
      this.router.navigate(['/child']);
      return;
    }
    this.router.navigate(['/notifications']);
  }
}
