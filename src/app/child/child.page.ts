import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
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
  obj:any;
  constructor(
    public router: Router,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private scheduleservice: ScheduleService,
    private toastService: ToastService,
    private nativeStorage: Storage,
    private loadingController: LoadingController,
    private loginservice: LoginService
  ) { }

  ionViewDidEnter() {
    if (!this.loginservice.isAuthenticated()){
      this.router.navigate(['login']);
      return 0;
     }
    this.nativeStorage.get(environment.USER_Id).then((Id) => {
      this.userId = Id;
      this.getChlidByUser(Id);
    });
   
  }
  ngOnInit(){}
  async getChlidByUser(id) {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    await this.scheduleservice.getChilds(id).subscribe(
      res => {
        if (res.IsSuccess) {
          this.childs = res.ResponseData
          loading.dismiss();
        }
        else {
          loading.dismiss();
          this.toastService.create(res.Message, 'danger');
        }
      },
      err => {
        loading.dismiss();
        this.toastService.create(err, 'danger');
      }
    )
  }

  calculateAge(birthday) { // birthday is a date
   var birthday1 = moment(birthday, "DD-MM-YYYY").format("YYYY-MM-DD");
    var today = new Date();
    var age = today.getFullYear() - new Date(birthday1).getFullYear();
    var m = today.getMonth() - new Date(birthday1).getMonth();
    age = age * 12 + m;
    return Math.round(age/12) +" Years " + age % 12 + " Months";
  }
}
