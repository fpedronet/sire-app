import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { HomeComponent } from './home/home.component';

import { Not403Component } from './configuracion/not403/not403.component';
import { MisrendicionesComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/misrendiciones/misrendiciones.component';
import { InsertareditarrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/insertareditarrendicion/insertareditarrendicion.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},

  {path: 'not-403', component: Not403Component},

  {path:'rendicion/lrendicion', component: MisrendicionesComponent},

  {path:'rendicion/lrendicion/edit/:id/:edit', component: InsertareditarrendicionComponent},

  /********* Como ejemplo *******/
  // {path:'donante/donacion', component: LdonacionComponent, canActivate: [GuardService]},
  // {path:'donante/donacion/create', component: CdonacionComponent, canActivate: [GuardService]},
  // {path:'donante/donacion/edit/:id/:edit', component: CdonacionComponent, canActivate: [GuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
