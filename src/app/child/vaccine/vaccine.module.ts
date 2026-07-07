import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VaccinePage } from './vaccine.page';

import { Downloader} from '@ionic-native/downloader/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: VaccinePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [VaccinePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
     Downloader , DatePicker
  ],
})
export class VaccinePageModule {}


