import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastService } from 'src/app/services/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-followup',
  templateUrl: './followup.page.html',
  styleUrls: ['./followup.page.scss']
})
export class FollowupPage {
  followups: any[] = null;
  isLoading = false;
  loadError = false;
  private childId: number;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private toastService: ToastService
  ) {}

  ionViewDidEnter() {
    this.childId = +this.route.snapshot.paramMap.get('id');
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.loadError = false;
    this.scheduleService.getFollowUps(this.childId).subscribe(
      res => {
        this.isLoading = false;
        if (res.IsSuccess) {
          this.followups = (res.ResponseData || []).map(f => {
            if (f.CurrentVisitDate) { f.CurrentVisitDate = moment(f.CurrentVisitDate, 'DD-MM-YYYY').format('YYYY-MM-DD'); }
            if (f.NextVisitDate) { f.NextVisitDate = moment(f.NextVisitDate, 'DD-MM-YYYY').format('YYYY-MM-DD'); }
            return f;
          });
        } else {
          this.loadError = true;
          this.toastService.create(res.Message, 'danger');
        }
      },
      err => {
        this.isLoading = false;
        this.loadError = true;
        this.toastService.create(err, 'danger');
      }
    );
  }

  doRefresh(event: any) {
    this.loadData();
    setTimeout(() => event.target.complete(), 1500);
  }
}
