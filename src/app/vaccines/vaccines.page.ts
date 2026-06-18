import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { VaccineInfoService } from 'src/app/services/vaccine-info.service';

@Component({
  selector: 'app-folder',
  templateUrl: './vaccines.page.html',
  styleUrls: ['./vaccines.page.scss'],
})
export class VaccinesPage implements OnInit {
  public folder: string;
  loading = false;
  vaccineInfos: any[] = [];
  selectedVaccineInfo: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private storage: Storage,
    private vaccineInfoService: VaccineInfoService
  ) { }

  ngOnInit() {
    this.loadVaccineInfos();
  }

  loadVaccineInfos() {
    this.loading = true;
    this.vaccineInfoService.getVaccineInfos().subscribe(
      (res) => {
        this.vaccineInfos = res?.ResponseData ?? [];
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.vaccineInfos = [];
        this.loading = false;
      }
    );
  }

  trackByName(index: number, vaccine: any): string {
    return vaccine?.Name ?? index.toString();
  }

  openDetail(vaccine: any) {
    this.selectedVaccineInfo = vaccine;
  }

  closeDetail() {
    this.selectedVaccineInfo = null;
  }

}
