import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import * as moment from 'moment';

@Component({
  selector: 'app-child',
  templateUrl: './child.page.html',
  styleUrls: ['./child.page.scss'],
})
export class ChildPage implements OnInit {
  childs: any;
  userId;

  constructor(
    public router: Router,
    private scheduleservice: ScheduleService,
    private toastService: ToastService,
    private nativeStorage: Storage,
    private loadingController: LoadingController,
    private loginservice: LoginService
  ) { }

  ionViewDidEnter() {
    if (!this.loginservice.isAuthenticated()) {
      this.router.navigate(['login']);
      return;
    }

    this.nativeStorage.get(environment.USER_Id).then((Id) => {
      this.userId = Id;
      this.getChlidByUser(Id);
    });
  }

  ngOnInit() {}

  async getChlidByUser(id) {
    const loading = await this.loadingController.create({ message: 'Loading' });
    await loading.present();
    this.scheduleservice.getChilds(id).subscribe(
      res => {
        loading.dismiss();
        if (res.IsSuccess) {
          this.childs = (res.ResponseData || []).map(c => this.decorate(c));
          if (this.childs && this.childs.length > 0) {
            const first = this.childs[0];
            if (first && first.Clinic && first.Clinic.DoctorId) {
              this.nativeStorage.set(environment.DOCTOR_Id, first.Clinic.DoctorId);
            }
            this.childs.forEach(c => this.loadProgress(c));
          }
        } else {
          this.toastService.create(res.Message, 'danger');
        }
      },
      err => {
        loading.dismiss();
        this.toastService.create(err, 'danger');
      }
    );
  }

  private decorate(c: any) {
    c._girl = c.Gender === 'Girl';
    c._initials = this.initials(c.Name);
    c._ageLabel = this.ageLabel(c.DOB);
    c._given = 0;
    c._total = 0;
    c._pct = 0;
    c._status = 'upcoming';        // completed | due | overdue | upcoming
    c._statusLine = 'Loading schedule…';
    c._loaded = false;
    return c;
  }

  /** Per-child schedule fetch → progress fraction + status line. */
  private loadProgress(c: any) {
    const today = Date.now();
    this.scheduleservice.getVaccinationById(c.Id).subscribe(
      (res: any) => {
        if (res && res.IsSuccess && res.ResponseData) {
          const doses = res.ResponseData.filter((d: any) => d.IsSkip != true);
          let given = 0;
          const pending: any[] = [];
          doses.forEach((d: any) => {
            const dt = moment(d.Date, 'DD-MM-YYYY').valueOf();
            if (d.IsDone) given++;
            else if (!d.Due2EPI) pending.push({ ...d, _ts: dt, Name: d.Dose && d.Dose.Name });
          });
          c._given = given;
          c._total = doses.length;
          c._pct = doses.length ? Math.round((given / doses.length) * 100) : 0;

          const overdue = pending.filter(p => p._ts < today);
          const sorted = pending.slice().sort((a, b) => a._ts - b._ts);
          const next = sorted[0];

          if (!pending.length) {
            c._status = 'completed';
            c._statusLine = 'Fully up to date';
          } else if (overdue.length) {
            c._status = 'overdue';
            c._statusLine = `${overdue.length} dose${overdue.length > 1 ? 's' : ''} overdue`;
          } else {
            const days = Math.round((next._ts - today) / (24 * 60 * 60 * 1000));
            const when = days <= 0 ? 'today' : days === 1 ? 'in 1 day' : `in ${days} days`;
            c._status = days <= 7 ? 'due' : 'upcoming';
            c._statusLine = `Next: ${next.Name || 'dose'} ${when}`;
          }
        } else {
          c._statusLine = '';
        }
        c._loaded = true;
      },
      () => { c._loaded = true; c._statusLine = ''; }
    );
  }

  trackById(index: number, child: any): any {
    return child.Id;
  }

  requestAddChild() {
    this.toastService.create('Request sent to your clinic. They\'ll add your child shortly.');
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
    if (years <= 0) return `${months} months`;
    return months > 0 ? `${years} yr ${months} mo` : `${years} years`;
  }
}
