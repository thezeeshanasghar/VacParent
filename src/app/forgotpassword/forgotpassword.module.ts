import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPage } from './forgotpassword.page';
import { DatePicker } from '@ionic-native/date-picker/ngx';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ForgotPasswordPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePicker]
})
export class ForgotPasswordPageModule {}
