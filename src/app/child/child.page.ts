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
  obj: any;
  fg: FormGroup;
  filteredDoctors: any;
  atta: any;

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
    if (!this.loginservice.isAuthenticated()) {
      this.router.navigate(['login']);
      return;
    }

    this.nativeStorage.get(environment.USER_Id).then((Id) => {
      this.userId = Id;
      this.getChlidByUser(Id);
    });
  }

  ngOnInit() {
    this.fg = this.formBuilder.group({
      DoctorDisplayName: ['', Validators.required],
      DoctorId: ['', Validators.required],
    });

    this.getDoctors();
  }

  async getChlidByUser(id) {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.scheduleservice.getChilds(id).subscribe(
      res => {
        if (res.IsSuccess) {

          this.childs = res.ResponseData;
          console.log(this.childs);
          for (const child of this.childs) {
            console.log(child);
            this.getDoctorByClinicId(child.ClinicId);
            this.atta=child.Id;
          }
        } else {
          this.toastService.create(res.Message, 'danger');
        }
        loading.dismiss();
      },
      err => {
        loading.dismiss();
        this.toastService.create(err, 'danger');
      }
    );
  }

  onDoctorSelected(selectedDoctor: any) {
    if (selectedDoctor) {
      this.fg.patchValue({
        DoctorId: selectedDoctor.Id,
        DoctorDisplayName: selectedDoctor.DisplayName
      });
      console.log('DoctorId:', selectedDoctor.Id);
      this.updateChildClinicId(selectedDoctor.Id, this.atta)
    }
  }

  async getDoctors() {
    const loading = await this.loadingController.create({
      message: "Loading Doctors"
    });
    await loading.present();

    this.scheduleservice.getAllDoctors().subscribe(
      res => {
        if (res.IsSuccess) {
          this.filteredDoctors = res.ResponseData;
          console.log(this.filteredDoctors);
        } else {
          this.toastService.create(res.Message, "danger");
        }
        loading.dismiss();
      },
      err => {
        loading.dismiss();
        this.toastService.create(err, "danger");
      }
    );
  }

  async getDoctorByClinicId(clinicId: number): Promise<void> {
    const loading = await this.loadingController.create({
      message: "Get Doctor"
    });
    await loading.present();
    this.scheduleservice.getDoctorByClinicId(clinicId).subscribe(
      res => {
        if (res.IsSuccess) {
          if (res.ResponseData.Clinics && res.ResponseData.Clinics.length > 0) {
            const doctorId = res.ResponseData.Clinics[0].DoctorId;
            // this.doctorId = doctorId;
            
            this.fg.patchValue({
              DoctorId: doctorId,
              DoctorDisplayName: res.ResponseData.DisplayName
            });
          }
        }
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        this.toastService.create('Error loading doctors', 'danger');
      }
    );
  }

  async updateChildClinicId(doctorId: number, childId: number): Promise<void> {
    const loading = await this.loadingController.create({
      message: "Update Doctor"
    });
    await loading.present();
      const res = this.scheduleservice.updateChildClinicId(doctorId, childId).subscribe(
        res => {
          if (Response) {
            
          } else {
            
          }
          loading.dismiss();
        },
        err => {
          loading.dismiss(); 
          
        }
      );

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