import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Dashboard/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'child',
    loadChildren: () => import('./child/child.module').then( m => m.ChildPageModule)
  },
  {
    path: 'vaccines',
    loadChildren: () => import('./vaccines/vaccines.module').then( m => m.VaccinesPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./aboutus/aboutus.module').then( m => m.AboutusPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
