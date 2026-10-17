import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

interface ChildCard {
  Id: any;
  Name: string;
  Gender: string;
  initials: string;
  ageLabel: string;
  girl: boolean;
  given: number;
  total: number;
  nextLabel: string;      // e.g. "1 due" / "On track"
  onTrack: boolean;
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {
  public folder: string;
  public isDoctor1: boolean = true;
  public greetingName = '';
  public greeting = 'Hello,';
  public children: ChildCard[] = [];

  // "Up next" hero
  public upNext: {
    childName: string;
    initials: string;
    doseTitle: string;
    metaText: string;
    vaccines: any[];
    childId: any;
  } | null = null;
  public loadingUpNext = true;

  private notificationsSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginservice: LoginService,
    public router: Router,
    private storage: Storage,
    public bookingService: BookingService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    if (!this.loginservice.isAuthenticated()) {
      this.router.navigate(['login']);
    }
    // time-of-day greeting
    const h = moment().hour();
    this.greeting = h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,';
  }

  ionViewDidEnter() {
    this.storage.get(environment.DOCTOR_Id).then(doctorId => {
      this.isDoctor1 = doctorId == null || doctorId == 1;
    });

    this.storage.get(environment.USER).then((user: any) => {
      if (user) {
        const name = user.Name || user.FullName || user.FirstName || '';
        this.greetingName = (name || '').toString().split(' ')[0];
      }
    });

    this.storage.get(environment.USER_Id).then(userId => {
      if (userId) {
        if (this.notificationsSub) this.notificationsSub.unsubscribe();
        this.notificationsSub = this.bookingService.getParentNotifications(userId).subscribe(
          (res: any) => {
            // The API returns the notification list itself; unread = rows not yet read.
            if (res && res.IsSuccess && Array.isArray(res.ResponseData)) {
              this.bookingService.unreadCount = res.ResponseData.filter(function(n) { return !n.IsRead; }).length;
            }
          },
          () => {}
        );
        this.loadChildren(userId);
      }
    });
  }

  private loadChildren(userId: any) {
    this.loadingUpNext = true;
    this.scheduleService.getChilds(userId).subscribe(
      (res: any) => {
        if (res && res.IsSuccess && res.ResponseData && res.ResponseData.length) {
          const kids = res.ResponseData;
          const first = kids[0];
          if (first && first.Clinic && first.Clinic.DoctorId) {
            this.storage.set(environment.DOCTOR_Id, first.Clinic.DoctorId);
          }
          if (!this.greetingName && first && first.FatherName) {
            this.greetingName = first.FatherName.split(' ')[0];
          }
          this.children = kids.slice(0, 2).map(c => this.toCard(c));
          this.buildUpNext(kids);
        } else {
          this.children = [];
          this.loadingUpNext = false;
        }
      },
      () => { this.loadingUpNext = false; }
    );
  }

  private toCard(c: any): ChildCard {
    const girl = c.Gender === 'Girl';
    return {
      Id: c.Id,
      Name: c.Name,
      Gender: c.Gender,
      girl,
      initials: this.initials(c.Name),
      ageLabel: this.ageLabel(c.DOB),
      given: 0,
      total: 0,
      nextLabel: '',
      onTrack: true
    };
  }

  /** Fetch schedules to compute progress + the nearest pending dose across all children. */
  private buildUpNext(kids: any[]) {
    const today = moment().startOf('day').valueOf(); // calendar day: due today is not overdue
    let bestGroup: { childName: string; childId: any; date: number; vaccines: any[] } | null = null;
    let remaining = kids.length;

    kids.forEach((kid, idx) => {
      this.scheduleService.getVaccinationById(kid.Id).subscribe(
        (res: any) => {
          if (res && res.IsSuccess && res.ResponseData) {
            const doses = res.ResponseData.filter((d: any) => d.IsSkip != true);
            let given = 0;
            let dueCount = 0;
            const pending: any[] = [];
            doses.forEach((d: any) => {
              const dt = moment(d.Date, 'DD-MM-YYYY').valueOf();
              if (d.IsDone) { given++; }
              else if (!d.Due2EPI) {
                pending.push({ ...d, _ts: dt });
                if (dt - today <= 7 * 24 * 60 * 60 * 1000) dueCount++;
              }
            });

            // Update the matching card (first two only are shown)
            const card = this.children.find(cc => cc.Id === kid.Id);
            if (card) {
              card.given = given;
              card.total = doses.length;
              const nextPending = pending.slice().sort((a, b) => a._ts - b._ts)[0];
              const soon = nextPending && (nextPending._ts - today) <= 7 * 24 * 60 * 60 * 1000 && nextPending._ts >= today;
              const overdue = pending.some(p => p._ts < today);
              if (overdue || dueCount > 0) {
                card.onTrack = false;
                card.nextLabel = (dueCount || (overdue ? 1 : 0)) + ' due';
              } else {
                card.onTrack = true;
                card.nextLabel = 'On track';
              }
            }

            // Track globally-nearest pending dose for the hero
            if (pending.length) {
              const sorted = pending.slice().sort((a, b) => a._ts - b._ts);
              const near = sorted[0];
              const sameDate = sorted.filter(p => p.Date === near.Date);
              if (!bestGroup || near._ts < bestGroup.date) {
                bestGroup = { childName: kid.Name, childId: kid.Id, date: near._ts, vaccines: sameDate };
              }
            }
          }
        },
        () => {},
        () => {
          remaining--;
          if (remaining === 0) this.finalizeUpNext(bestGroup, today);
        }
      );
    });
  }

  private finalizeUpNext(bestGroup: any, today: number) {
    this.loadingUpNext = false;
    if (!bestGroup) { this.upNext = null; return; }
    const v0 = bestGroup.vaccines[0];
    const doseTitle = bestGroup.vaccines.length > 1
      ? `${bestGroup.vaccines.length} vaccines due`
      : (v0.Dose && v0.Dose.Name ? v0.Dose.Name : 'Next dose');
    const days = Math.round((bestGroup.date - today) / (24 * 60 * 60 * 1000));
    const when = days < 0 ? `overdue` : days === 0 ? 'due today' : days === 1 ? 'due tomorrow' : `due in ${days} days`;
    const dateLabel = moment(bestGroup.date).format('ddd DD MMM');
    this.upNext = {
      childName: bestGroup.childName,
      initials: this.initials(bestGroup.childName),
      doseTitle,
      metaText: `${bestGroup.childName} · ${when} · ${dateLabel}`,
      vaccines: bestGroup.vaccines,
      childId: bestGroup.childId
    };
  }

  private initials(name: string): string {
    return (name || '')
      .split(' ')
      .filter(p => p.length > 0)
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('');
  }

  private ageLabel(dob: string): string {
    if (!dob) return '';
    const birth = moment(dob, 'DD-MM-YYYY');
    const now = moment();
    const years = now.diff(birth, 'years');
    birth.add(years, 'years');
    const months = now.diff(birth, 'months');
    if (years <= 0) return `${months} mo`;
    return months > 0 ? `${years} yr ${months} mo` : `${years} yr`;
  }

  openUpNext() {
    if (this.upNext) {
      this.router.navigate(['/child/vaccine', this.upNext.childId]);
    } else {
      this.router.navigate(['/child']);
    }
  }

  goToChild(id: any) {
    this.router.navigate(['/child/vaccine', id]);
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  clearStorage() {
    this.storage.clear();
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    if (this.notificationsSub) this.notificationsSub.unsubscribe();
  }
}
