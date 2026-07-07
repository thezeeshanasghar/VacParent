import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { VaccineInfoService } from 'src/app/services/vaccine-info.service';

@Component({
  selector: 'app-vaccines',
  templateUrl: './vaccines.page.html',
  styleUrls: ['./vaccines.page.scss'],
})
export class VaccinesPage implements OnInit {
  public folder: string;
  loading = false;
  vaccineInfos: any[] = [];
  selectedVaccineInfo: any = null;
  detailOpen = false;
  search = '';

  private tints = ['tint-blue', 'tint-green', 'tint-amber'];

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

  get filteredVaccines(): any[] {
    const q = (this.search || '').trim().toLowerCase();
    if (!q) return this.vaccineInfos;
    return this.vaccineInfos.filter(v => (v.Name || '').toLowerCase().includes(q));
  }

  tintFor(index: number): string {
    return this.tints[index % this.tints.length];
  }

  trackByName(index: number, vaccine: any): string {
    return vaccine?.Name ?? index.toString();
  }

  openDetail(vaccine: any) {
    this.selectedVaccineInfo = vaccine;
    this.detailOpen = true;
  }

  closeDetail() {
    this.detailOpen = false;
    // keep selectedVaccineInfo bound during the slide-out
    setTimeout(() => { if (!this.detailOpen) this.selectedVaccineInfo = null; }, 260);
  }
}
