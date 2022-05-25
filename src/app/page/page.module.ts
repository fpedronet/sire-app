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

import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MisrendicionesComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/misrendiciones/misrendiciones.component';
import { InsertareditarrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/insertareditarrendicion/insertareditarrendicion.component';
import { RevisionmovilidadesComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/revisionmovilidades/revisionmovilidades.component';
import { SeguimientorendicionesComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/seguimientorendiciones/seguimientorendiciones.component';
import { FrendicionComponent } from './Administracion/ReportesAdministrativos/RendicionDeGastos/frendicion/frendicion.component';

const config: SocketIoConfig = { url: environment.UrlApi, options: {} };

@NgModule({
  declarations: [
    ConfirmComponent,
    LayoutComponent,
    HomeComponent,
    Not404Component,
    Not403Component,
    MisrendicionesComponent,
    InsertareditarrendicionComponent,
    RevisionmovilidadesComponent,
    SeguimientorendicionesComponent,
    FrendicionComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PageRoutingModule,
    SocketIoModule.forRoot(config)
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
