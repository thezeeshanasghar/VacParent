import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastService } from 'src/app/services/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-followup',
  templateUrl: './followup.page.html',
  styleUrls: ['./followup.page.scss']
})
export class FollowupPage {
  followups: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private toastService: ToastService,
    private loadingController: LoadingController
  ) {}

  async ionViewDidEnter() {
    const childId = +this.route.snapshot.paramMap.get('id');
    const loading = await this.loadingController.create({ message: 'Loading' });
    await loading.present();

    this.scheduleService.getFollowUps(childId).subscribe(
      res => {
        loading.dismiss();
        if (res.IsSuccess) {
          // FollowUpDTO dates arrive as "DD-MM-YYYY" (OnlyDateConverter) — normalize
          // to "YYYY-MM-DD" so the template's `| date` pipe parses them unambiguously.
          this.followups = (res.ResponseData || []).map(f => {
            if (f.CurrentVisitDate) { f.CurrentVisitDate = moment(f.CurrentVisitDate, 'DD-MM-YYYY').format('YYYY-MM-DD'); }
            if (f.NextVisitDate) { f.NextVisitDate = moment(f.NextVisitDate, 'DD-MM-YYYY').format('YYYY-MM-DD'); }
            return f;
          });
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
}
