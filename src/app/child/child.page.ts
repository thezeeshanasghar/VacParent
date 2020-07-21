import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

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
  ) { }

  ngOnInit() {
    this.nativeStorage.get(environment.USER_Id).then((Id) => {
      this.userId = Id;
      this.getChlidByUser(Id);
    });
   
  }
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
}
