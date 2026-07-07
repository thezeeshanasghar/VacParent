import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VaccinesPageRoutingModule } from './vaccines-routing.module';

import { VaccinesPage } from './vaccines.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VaccinesPageRoutingModule
  ],
  declarations: [VaccinesPage]
})
export class VaccinesPageModule {}
