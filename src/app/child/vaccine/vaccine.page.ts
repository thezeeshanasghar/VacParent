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
//import { mobiscroll, MbscCalendarOptions } from '@mobiscroll/angular';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from "@angular/forms";
//const { GoogleSpreadsheet } = require('google-spreadsheet');

const now = new Date();
@Component({
  selector: "app-vaccine",
  templateUrl: "./vaccine.page.html",
  styleUrls: ["./vaccine.page.scss"]
})
export class VaccinePage {

  fg1: FormGroup;
  homeBook = false;
  given = 0;
  due = 0;
  missed = 0;
  vaccine: any[] = [];
  dataGrouping: any[] = [];
  childId: any;
  Pneum2Date: any;
  today = Date.now();
  next = false;
  Child: any;
  age: any;
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
    private datePicker: DatePicker,
    private formBuilder: FormBuilder

  ) { }

  ionViewDidEnter() {
    this.childId = this.route.snapshot.paramMap.get("id");
    this.getVaccination();

    this.fg1 = this.formBuilder.group({
      ChildName: new FormControl("", Validators.required),
      FatherName: new FormControl("", Validators.required),
      Email: new FormControl(
        "",
        Validators.compose([
          // Validators.required,
          Validators.pattern(
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
          )
        ])
      ),
      DOB: new FormControl('', Validators.required),
      Vaccines: new FormControl('', Validators.required),
      Phone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[0-9]{10}$")
        ])
      ),
      Address: new FormControl('', Validators.required),
      BookingDate: moment(Date.now()).format("DD-MM-YYYY"),
      City: [null],
      Status: 'Booked'

    });
  }

  calculateAge(birthday: string) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += lastMonth;
    }
    return `${years} Years ${months} Months`;
  }


  checkVaccineIsDon(data): boolean {
    var isdone: boolean = true;
    for (let i = 0; i < data.length; i++) {
      if (!data[i].IsDone == false) {
        isdone = false;
        break;
      }
    }
    return isdone;
  }

  async loadGoogleSheet() {
    // console.log("called");

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
            //original code
            this.vaccine = res.ResponseData.filter(x => x.IsSkip != true);
            this.Child = (this.vaccine[0].Child);
            this.fg1.controls['ChildName'].setValue(this.Child.Name);
            this.fg1.controls['FatherName'].setValue(this.Child.FatherName);
            this.fg1.controls['DOB'].setValue(this.Child.DOB);
            this.fg1.controls['Email'].setValue(this.Child.Email);
            this.fg1.controls['Phone'].setValue(this.Child.User.MobileNumber);
            this.fg1.controls['City'].setValue(this.Child.City);
            //this.fg1.controls['BookingDate'].setValue(this.Child.User.BookingDate);

            this.age = this.calculateAge(moment(this.Child.DOB, "DD-MM-YYYY").format("YYYY-MM-DD"));
            this.vaccine.forEach(doc => {
              doc.Date = moment(doc.Date, "DD-MM-YYYY").format("YYYY-MM-DD");
              if (doc.GivenDate)
                doc.GivenDate = moment(doc.GivenDate, "DD-MM-YYYY").format("YYYY-MM-DD");


              var date1 = Date.parse(doc.Date);
              if (!this.next && this.today < date1) {
                doc.Next = true;
                this.next = true;
              }
              else
                doc.Next = false;

              //given due missed calculation

              if (doc.IsDone == true)
                this.given++;
              else if (doc.IsDone != true && this.today < date1)
                this.due++;
              else
                this.missed++;

              //  console.log(this.today); console.log(date1);

            });
            //console.log(this.due);

            this.dataGrouping = this.groupBy(this.vaccine, "Date");
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

  groupBy(objectArray, property) {
    return objectArray.reduce(
      function (acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      },

      {}
    );
  }

  setHomeBook(value) {
    this.homeBook = value;
  }

  async submitBooking() {
    console.log(this.fg1.value);
    await this.vaccineService.addBooking(this.fg1.value).subscribe(
      res => {
        if (res.IsSuccess) {
          this.toastService.create(res.Message);
          this.homeBook = false;
        }
      },
      err => {
        this.toastService.create(err, "danger");
      }
    );
  }

  printdata() {
    this.download(this.childId);
  }

  download(id: any) {
    const fileUrl = `${this.API_VACCINE}child/${id}/Download-Schedule-PDF`;

    if (typeof cordova === 'undefined') {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'ChildSchedule.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.toastService.create('Download started in the browser.', 'success');
      return;
    }

    // Mobile environment
    var request: DownloadRequest = {
      uri: fileUrl,
      title: 'Child Schedule',
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: 'Downloads',
        subPath: 'ChildSchedule.pdf'
      }
    };
    this.downloader.download(request)
      .then((location: string) => console.log('File downloaded at:' + location))
      .catch((error: any) => console.error(error));
  }

  checkForMissed(input) {
    let today1 = moment(this.today).format("YYYY-MM-DD");
    if (today1 > input) {
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
          text: 'Ok',
          handler: () => {

          }
        }
      ]
    });
    await alert.present();
  }

  updateBulkDate(event: any, vaccineId: number) {
    // Your implementation here
    // Use `event` to get the new date and `vaccineId` to know which vaccine's date is being updated
    throw new Error("Not implemented");
  }
}

// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-a-array-of-objects
