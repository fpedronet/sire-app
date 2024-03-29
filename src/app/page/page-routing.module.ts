import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { HomeComponent } from './home/home.component';

import { Not403Component } from './configuracion/not403/not403.component';
import { LrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/lrendicion/lrendicion.component';
import { CrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/crendicion/crendicion.component';
import { LregistroComponent } from './MesaDeAyuda/Registros/lregistro/lregistro.component';
import { CregistroComponent } from './MesaDeAyuda/Registros/cregistro/cregistro.component';
import { LreporteComponent } from './MesaDeAyuda/Reportes/lreporte/lreporte.component';
import { LmargenbrutoComponent } from './Administracion/ReportesAdministrativos/Contabilidad/lmargenbruto/lmargenbruto.component';
import { LtrackingComponent } from './Administracion/Requerimientos/tracking/ltracking/ltracking.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},

  {path: 'not-403', component: Not403Component},

  {path:'administracion/rendicion/:idPantalla', component: LrendicionComponent, canActivate: [GuardService]},
  {path:'administracion/rendicion/:idPantalla/create', component: CrendicionComponent, canActivate: [GuardService]},
  {path:'administracion/rendicion/:idPantalla/edit/:id', component: CrendicionComponent, canActivate: [GuardService]},

  {path:'mesadeayuda/registro', component: LregistroComponent},
  {path:'mesadeayuda/registro/create', component: CregistroComponent, canActivate: [GuardService]},
  {path:'mesadeayuda/registro/edit/:id', component: CregistroComponent, canActivate: [GuardService]},
  {path:'mesadeayuda/reporte', component: LreporteComponent},
  {path:'administracion/margenbruto', component: LmargenbrutoComponent},
  {path:'administracion/tracking', component: LtrackingComponent},
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
