import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { CaspiranteComponent } from './donante/aspirante/caspirante/caspirante.component';
import { LaspiranteComponent } from './donante/aspirante/laspirante/laspirante.component';
import { CaspiranteligthComponent } from './donante/aspiranteligth/caspiranteligth/caspiranteligth.component';
import { LaspiranteligthComponent } from './donante/aspiranteligth/laspiranteligth/laspiranteligth.component';
import { CchequeoComponent } from './donante/chequeo/cchequeo/cchequeo.component';
import { LchequeoComponent } from './donante/chequeo/lchequeo/lchequeo.component';
import { CdonacionComponent } from './donante/donacion/cdonacion/cdonacion.component';
import { LdonacionComponent } from './donante/donacion/ldonacion/ldonacion.component';
import { CentrevistaComponent } from './donante/entrevista/centrevista/centrevista.component';
import { LentrevistaComponent } from './donante/entrevista/lentrevista/lentrevista.component';


import { HomeComponent } from './home/home.component';

import { Not403Component } from './configuracion/not403/not403.component';
import { RptfichaComponent } from './reporte/rptficha/rptficha.component';

const routes: Routes = [
  {path:'home', component: HomeComponent, canActivate: [GuardService]},

  {path: 'not-403', component: Not403Component},

  {path:'donante/aspirante', component: LaspiranteComponent, canActivate: [GuardService]},
  {path:'donante/aspirante/create', component: CaspiranteComponent, canActivate: [GuardService]},
  {path:'donante/aspirante/edit/:id/:edit', component: CaspiranteComponent, canActivate: [GuardService]},

  {path:'donante/aspirantelight', component: LaspiranteligthComponent, canActivate: [GuardService]},
  {path:'donante/aspirantelight/create', component: CaspiranteligthComponent, canActivate: [GuardService]},
  {path:'donante/aspirantelight/edit/:id/:edit', component: CaspiranteligthComponent, canActivate: [GuardService]},

  {path:'donante/chequeo', component: LchequeoComponent, canActivate: [GuardService]},
  {path:'donante/chequeo/create', component: CchequeoComponent, canActivate: [GuardService]},
  {path:'donante/chequeo/edit/:id/:edit', component: CchequeoComponent, canActivate: [GuardService]},

  {path:'donante/entrevista', component: LentrevistaComponent, canActivate: [GuardService]},
  {path:'donante/entrevista/create', component: CentrevistaComponent, canActivate: [GuardService]},
  {path:'donante/entrevista/edit/:id/:edit', component: CentrevistaComponent, canActivate: [GuardService]},

  {path:'donante/donacion', component: LdonacionComponent, canActivate: [GuardService]},
  {path:'donante/donacion/create', component: CdonacionComponent, canActivate: [GuardService]},
  {path:'donante/donacion/edit/:id/:edit', component: CdonacionComponent, canActivate: [GuardService]},

  {path:'ficha', component: RptfichaComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
