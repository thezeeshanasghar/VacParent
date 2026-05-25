import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChildPage } from './child.page';

const routes: Routes = [
  {
    path: '',
    component: ChildPage
  },
 {
  path: 'vaccine/:id',
  loadChildren: () => import('./vaccine/vaccine.module').then( m => m.VaccinePageModule)
},
{
  path: 'followup/:id',
  loadChildren: () => import('./followup/followup.module').then(m => m.FollowupPageModule)
}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ChildPage],
  providers:[]
})
export class ChildPageModule {}
