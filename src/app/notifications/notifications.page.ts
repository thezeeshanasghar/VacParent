import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BookingService } from 'src/app/services/booking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})
export class NotificationsPage {
  userId: any;
  notifications: any[] = [];
  loading = true;

  constructor(
    private storage: Storage,
    private bookingService: BookingService
  ) {}

  async ionViewWillEnter() {
    this.userId = await this.storage.get(environment.USER_Id);
    this.load();
  }

  load(event?: any) {
    if (!this.userId) {
      this.loading = false;
      if (event) { event.target.complete(); }
      return;
    }
    this.bookingService.getParentNotifications(this.userId).subscribe(
      (res: any) => {
        this.loading = false;
        const list = (res && res.ResponseData) ? res.ResponseData : (Array.isArray(res) ? res : []);
        this.notifications = list || [];
        this.recomputeUnread();
        // Opening the screen clears the unread state (server + badge).
        this.markAllRead();
        if (event) { event.target.complete(); }
      },
      () => {
        this.loading = false;
        if (event) { event.target.complete(); }
      }
    );
  }

  private recomputeUnread() {
    const unread = this.notifications.filter(n => !n.IsRead).length;
    this.bookingService.unreadCount = unread;
  }

  private markAllRead() {
    if (!this.userId) { return; }
    const hadUnread = this.notifications.some(n => !n.IsRead);
    if (!hadUnread) { return; }
    this.bookingService.markAllReadParent(this.userId).subscribe(
      () => {
        this.notifications.forEach(n => (n.IsRead = true));
        this.bookingService.unreadCount = 0;
      },
      () => {}
    );
  }

  isPaAssigned(n: any): boolean {
    return n && n.Type === 'PaAssigned';
  }

  // Inline silhouette so the fallback never 404s (VacParent ships no avatar asset).
  private readonly SILHOUETTE =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" fill="#E5EEF5"/>' +
      '<circle cx="32" cy="24" r="12" fill="#A9C4D8"/>' +
      '<path d="M12 56c0-11 9-18 20-18s20 7 20 18z" fill="#A9C4D8"/>' +
      '</svg>'
    );

  // Resolve the PA photo filename/relative path to a displayable URL. Empty or the default
  // silhouette falls back to the inline SVG so nothing 404s.
  paPhoto(n: any): string {
    const img = n && n.PaProfileImage ? n.PaProfileImage : '';
    if (!img || img === 'Resources/Images/avatar.png') {
      return this.SILHOUETTE;
    }
    if (img.indexOf('http') === 0) { return img; }
    return environment.RESOURCE_URL + img.replace(/\\/g, '/');
  }

  callLink(n: any): string {
    const phone = n && n.PaPhone ? n.PaPhone : '';
    return 'tel:' + phone;
  }

  whatsAppLink(n: any): string {
    const wa = n && n.PaPhoneWhatsApp ? n.PaPhoneWhatsApp : '';
    return 'https://wa.me/' + wa;
  }

  hasPhone(n: any): boolean {
    return !!(n && n.PaPhone);
  }

  hasWhatsApp(n: any): boolean {
    return !!(n && n.PaPhoneWhatsApp);
  }
}
