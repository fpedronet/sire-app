import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MenuResponse, OpcionMenuDto } from '../_model/configuracion/menu';
import { Permiso } from './../_model/permiso';

@Injectable({
  providedIn: 'root'
})
export class ConfigPermisoService {

  constructor(private http: HttpClient) { }

  listaOpcionesMenu?:OpcionMenuDto[];
    
  private url: string = `${environment.UrlApi}/configpermiso`;
  
  listar(idempresa: string) {
    let urls = `${this.url}/GetAllOpcionMenu?idempresa=${idempresa}`;
    return this.http.get<MenuResponse>(urls);
  }

  obtenerpermiso(codpantalla: string) {
    
    let urls = `${this.url}/GetFirstPermiso?codpantalla=${codpantalla}`;
    return this.http.get<Permiso>(urls);
  }

}
