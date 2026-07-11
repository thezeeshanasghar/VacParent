import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsPage } from './notifications.page';

const routes: Routes = [{ path: '', component: NotificationsPage }];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule {}
