import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import * as moment from "moment";

@Component({
  selector: 'app-login',
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
          this.childs = res.ResponseData;
          if (this.childs && this.childs.length > 0) {
            var first = this.childs[0];
            if (first && first.Clinic && first.Clinic.DoctorId) {
              this.nativeStorage.set(environment.DOCTOR_Id, first.Clinic.DoctorId);
            }
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

  trackById(index: number, child: any): any {
    return child.Id;
  }

  calculateAge(birthday) {
    var birthDate = moment(birthday, "DD-MM-YYYY");
    var today = moment();
    var years = today.diff(birthDate, 'years');
    birthDate.add(years, 'years');
    var months = today.diff(birthDate, 'months');
    return `${years} Years ${months} Months`;
  }
}