import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastService } from 'src/app/services/toast.service';

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
          this.followups = res.ResponseData || [];
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
