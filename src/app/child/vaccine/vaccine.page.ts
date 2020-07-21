import { Component, OnInit } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { ScheduleService } from "src/app/services/schedule.service";
import { ToastService } from "src/app/services/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
//import { BulkService } from "src/app/services/bulk.service";
import { AlertController } from '@ionic/angular';
//import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { environment } from 'src/environments/environment';
import { Downloader , DownloadRequest , NotificationVisibility } from '@ionic-native/downloader/ngx';


@Component({
  selector: "app-vaccine",
  templateUrl: "./vaccine.page.html",
  styleUrls: ["./vaccine.page.scss"]
})
export class VaccinePage {
  vaccine: any[] = [];
  childId: any;
  Pneum2Date: any;
  private readonly API_VACCINE = `${environment.BASE_URL}`
  constructor(
    public loadingController: LoadingController,
    public route: ActivatedRoute,
    public router: Router,
    private vaccineService: ScheduleService,
    //private bulkService: BulkService,
    private toastService: ToastService,
    public alertController: AlertController,
    private downloader: Downloader

    // private document: DocumentViewer,
  ) { }

  ionViewWillEnter() {
    this.childId = this.route.snapshot.paramMap.get("id");
    this.getVaccination();
  }

  async getVaccination() {
    const loading = await this.loadingController.create({
      message: "Loading"
    });

    await loading.present();
    await this.vaccineService
      .getVaccinationById(this.route.snapshot.paramMap.get("id"))
      .subscribe(
        res => {
          if (res.IsSuccess) {
          // res.ResponseData = res.ResponseData.filter(item=> (!item.IsSkip));
           console.log(res.ResponseData);

            //original code
            this.vaccine = res.ResponseData;
            // this.vaccine.forEach(doc => {
            //   doc.Date = moment(doc.Date, "DD-MM-YYYY").format("YYYY-MM-DD");
            // });
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
    //this.vaccineService.printVaccineSchedule(this.childID);
    console.log(this.childId);
    this.download(this.childId);
  }
  
  download(id){
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
  .then((location: string) => console.log('File downloaded at:'+location))
  .catch((error: any) => console.error(error));
  
  }
  

}

// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-a-array-of-objects
