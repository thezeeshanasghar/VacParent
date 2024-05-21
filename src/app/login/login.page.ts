import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  fg: FormGroup;
  obj:any;
  forgot = false;
  MobileNumber: any;
  constructor(
    public router: Router,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private loginservice: LoginService,
    private toastService: ToastService,
    private nativeStorage: Storage,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.skipLoginIfAlreadyLoggedIn();
    this.loginservice.changeState(false);
    this.fg = this.formBuilder.group({
      'MobileNumber': [null,  [Validators.required, this.onlyNumbersValidator()]],
      'Password': [null, Validators.required],
      'CountryCode': ['92'],
      'UserType': ['PARENT']
    });
   
  }

  onlyNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = /\D/.test(control.value); // Regular expression to test for non-digit characters
      return forbidden ? { 'onlyNumbers': { value: control.value } } : null;
    };
  }

  skipLoginIfAlreadyLoggedIn() {
    this.nativeStorage.get(environment.USER_Id).then(value => {
      if (value) {
        let state = true;
        this.loginservice.changeState(state);
        this.router.navigate(['dashboard']);
      }
    });
  }

  async login() {

    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    await this.loginservice.checkAuth(this.fg.value)
      .subscribe(res => {
        if (res.IsSuccess) {
          this.nativeStorage.set(environment.USER, res.ResponseData);
        //  this.nativeStorage.setItem(environment.DOCTOR_Id, res.ResponseData.DoctorId);
          this.nativeStorage.set(environment.USER_Id, res.ResponseData.Id);
          let state = true;
          this.loginservice.changeState(state);
         // this.getdoctorprofile(res.ResponseData.Id);
          this.router.navigate(['/dashboard']);
          loading.dismiss();
        }
        else {
          loading.dismiss();
          this.toastService.create(res.Message, 'danger');

        }
      }, (err) => {
        loading.dismiss();
        this.toastService.create(err, 'danger');
      });
  }
 

  async forgotPasswordAlert(val) {
this.forgot = val;
  }
//   async sendPassword() {
//     const loading = await this.loadingController.create({
//       message: 'Loading'
//     });
// let data = {
//   MobileNumber: this.MobileNumber,
//   CountryCode: "92",
//   UserType: "PARENT"
// }
//     await loading.present();
//     this.loginservice.forgotPassword(JSON.stringify(data)).subscribe(
//       res => {
//         if (res.IsSuccess) {
//           console.log(res.ResponseData);
//           loading.dismiss();
//           this.forgot = false;
//         }
//         else {
//           loading.dismiss();
//           this.toastService.create(res.Message, 'danger');
//         }
//       },
//       err => {
//         loading.dismiss();
//         this.toastService.create(err, 'danger');
//       }
//     );
//       }


}
