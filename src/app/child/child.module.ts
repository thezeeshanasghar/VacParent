import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IonicModule } from '@ionic/angular';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChildPage } from './child.page';
//import { Storage  } from '@ionic/storage';

const routes: Routes = [
  {
    path: '',
    component: ChildPage
  },
 {
  path: 'vaccine/:id',
  loadChildren: () => import('./vaccine/vaccine.module').then( m => m.VaccinePageModule)
}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
   // IonicStorageModule.forRoot(),
    RouterModule.forChild(routes),
    
  ],
  declarations: [ChildPage],
  providers:[]
})
export class ChildPageModule {}
