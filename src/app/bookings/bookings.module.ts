import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { BookingsPage } from './bookings.page';

const routes: Routes = [{ path: '', component: BookingsPage }];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [BookingsPage]
})
export class BookingsPageModule {}
