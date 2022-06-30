import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ConfirmComponent } from './component/confirm/confirm.component';
import { LayoutComponent } from './component/layout/layout.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PageRoutingModule } from './page-routing.module';
import { InterceptorService } from '../_interceptors/interceptor.service';
import { Not404Component } from './configuracion/not404/not404.component';
import { Not403Component } from './configuracion/not403/not403.component';

import { LrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/lrendicion/lrendicion.component';
import { CrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/crendicion/crendicion.component';
import { FrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/frendicion/frendicion.component';
import { CdetalleComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/cdetalle/cdetalle.component';
import { CrechazoComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/crechazo/crechazo.component';
import { PerfilComponent } from './component/perfil/perfil.component';


@NgModule({
  declarations: [
    ConfirmComponent,
    LayoutComponent,
    HomeComponent,
    Not404Component,
    Not403Component,
    LrendicionComponent,
    CrendicionComponent,
    FrendicionComponent,
    CdetalleComponent,
    CrechazoComponent,
    PerfilComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PageRoutingModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true,
  },
  {
    provide:LocationStrategy,
    useClass:HashLocationStrategy
  }
],
})

export class PageModule { }
