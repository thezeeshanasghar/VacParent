import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { ScheduleService } from "src/app/services/schedule.service";
import { ToastService } from "src/app/services/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
//import { BulkService } from "src/app/services/bulk.service";
import { AlertController } from '@ionic/angular';
//import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { environment } from 'src/environments/environment';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';

const now = new Date();
@Component({
  selector: "app-vaccine",
  templateUrl: "./vaccine.page.html",
  styleUrls: ["./vaccine.page.scss"]
})
export class VaccinePage {

  cal = now;
  header = now;
  nonForm = now;
  external = now;
  vaccine: any[] = [];
  childId: any;
  Pneum2Date: any;
  today = Date.now();
  next = false;
  Child: any;
  private readonly API_VACCINE = `${environment.BASE_URL}`
  constructor(
    public loadingController: LoadingController,
    public route: ActivatedRoute,
    public router: Router,
    private vaccineService: ScheduleService,
    //private bulkService: BulkService,
    private toastService: ToastService,
    public alertController: AlertController,
    private downloader: Downloader,
    private cdref: ChangeDetectorRef,
    private datePicker: DatePicker

  ) { }

  ionViewDidEnter() {
    this.childId = this.route.snapshot.paramMap.get("id");
    this.getVaccination();
  }

  async getVaccination() {
    const loading = await this.loadingController.create({
      message: "Loading"
    });

    await loading.present();
    this.vaccineService
      .getVaccinationById(this.route.snapshot.paramMap.get("id"))
      .subscribe(
        res => {
          if (res.IsSuccess) {
            // res.ResponseData = res.ResponseData.filter(item=> (!item.IsSkip));
            // console.log(res.ResponseData);
            //original code
            this.vaccine = res.ResponseData;
            this.Child = (this.vaccine[0].Child);
            this.vaccine.forEach(doc => {

              let date = moment(doc.Date, "DD-MM-YYYY").format("YYYY-MM-DD");
              var date1 = Date.parse(date);
              if (!this.next && this.today < date1) {
                doc.Next = true;
                this.next = true;
              }
              else
                doc.Next = false;
            });
            loading.dismiss();
          } else {
            loading.dismiss();
            this.toastService.create(res.Message, "danger");
          }
        },
        err => {
          loading.dismiss();
          this.toastService.create(err, "danger");
        }
      );
  }

  printdata() {
    this.download(this.childId);
  }

  download(id: any) {
    var request: DownloadRequest = {
      uri: `${this.API_VACCINE}child/${id}/Download-Schedule-PDF`,
      title: 'Child Schedule',
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      // notificationVisibility: 0,
      destinationInExternalFilesDir: {
        dirType: 'Downloads',
        subPath: 'ChildSchedule.pdf'
      }
    };
    this.downloader.download(request)
      .then((location: string) => console.log('File downloaded at:' + location))
      .catch((error: any) => console.error(error));

  }

  checkForMissed(input: moment.MomentInput) {
    let todaydate = moment(input, "DD-MM-YYYY").format("YYYY-MM-DD");
    var date1 = Date.parse(todaydate);
    if (this.today > date1) {
      return true;
    }
    else
      return false;
  }

  async updateDate($event, vacId: any) {
    let newDate = $event.detail.value;
    newDate = moment(newDate, "YYYY-MM-DD").format("DD-MM-YYYY");
    let data = { Date: newDate, Id: vacId };
    this.vaccineService.updateVaccinationDate(data, false, false, false).subscribe(
      res => {
        if (res.IsSuccess) {
          this.getVaccination();
          this.toastService.create(res.Message);
        } else {
          this.resheduleAlert(res.Message, data);
        }
      },
      err => {
        this.toastService.create(err, "danger");
      }
    );
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

  async resheduleAlert(message, data) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: [
        {
          text: 'Ignore Rule',
          cssClass: 'secondary',
          handler: () => {
            if (message.search("it is greater than the Max Age of dose") != -1) {
              this.vaccineService.updateVaccinationDate(data, true, false, false).subscribe(
                res => {
                  if (res.IsSuccess) {
                    this.getVaccination();
                    this.toastService.create(res.Message);
                  } else {
                    this.resheduleAlert(res.Message, data);
                  }
                },
                err => {
                  this.toastService.create(err, "danger");
                }
              );
            }
            else if (message.search("Minimum Age of this vaccine from date of birth should be") != -1) {
              this.vaccineService.updateVaccinationDate(data, false, true, false).subscribe(
                res => {
                  if (res.IsSuccess) {
                    this.getVaccination();
                    this.toastService.create(res.Message);
                  } else {
                    //this.toastService.create(res.Message, "danger");
                    this.resheduleAlert(res.Message, data);
                  }
                },
                err => {
                  this.toastService.create(err, "danger");
                }
              );
            }
            else if (message.search("Minimum Gap from previous dose of this vaccine should be") != -1) {
              this.vaccineService.updateVaccinationDate(data, false, false, true).subscribe(
                res => {
                  if (res.IsSuccess) {
                    this.getVaccination();
                    this.toastService.create(res.Message);
                  } else {
                    //this.toastService.create(res.Message, "danger");
                    this.resheduleAlert(res.Message, data);
                  }
                },
                err => {
                  this.toastService.create(err, "danger");
                }
              );
            }

          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
  }

}

// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-a-array-of-objects
