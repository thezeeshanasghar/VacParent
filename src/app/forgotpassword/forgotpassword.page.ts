import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { environment } from 'src/environments/environment';
import * as moment from "moment";
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotPasswordPage implements OnInit {


  fg: FormGroup;
  obj:any;
  forgot = false;
  MobileNumber: any;
  birthday1 = moment(Date.now()).format("YYYY-MM-DD");

  constructor(
    public router: Router,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private loginservice: LoginService,
    private toastService: ToastService,
    private nativeStorage: Storage,
    private loadingController: LoadingController,
    private datePicker: DatePicker,
  ) { }

  ngOnInit() {
      
  }

  async forgotPasswordAlert(val) {
this.forgot = val;
  }
  async sendPassword() 
  {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
// let data = {
//   MobileNumber: this.MobileNumber.substring(1,11),
//   C: "92",
//   UserType: "PARENT"
// }
    await loading.present();
    
    this.loginservice.forgotPassword("3345022330" , this.birthday1).subscribe(
      res => {
        if (res.IsSuccess) {
          console.log(res.ResponseData);
          this.toastService.create("Password has been sent to your Email address and Mobile Number")
          loading.dismiss();
          this.forgot = false;
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
    );
      }

      updateDate(){
        console.log(this.birthday1);
      }

      datepick() {
        this.datePicker.show({
          date: new Date(),
          mode: 'date',
          androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
          date => console.log('Got date: ', date),
          err => console.log('Error occurred while getting date: ', err)
        );
      }
    
}
