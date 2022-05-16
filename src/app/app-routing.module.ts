import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './page/component/layout/layout.component';
import { Not404Component } from './page/configuracion/not404/not404.component';
import { LoginComponent } from './page/usuario/login/login.component';
import { GuardService } from './_service/guard.service';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    redirectTo:'login'
  },  
  {
    path:'',
    component: LoginComponent,
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate: [GuardService]
  },
  {
    path:'page',
    component: LayoutComponent,
    loadChildren: () => import('./page/page.module').then(m => m.PageModule)
  },
  { path: 'not-404', component: Not404Component },
  {
    path: '**',
    redirectTo: 'not-404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
