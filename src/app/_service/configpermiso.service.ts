import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MenuResponse } from '../_model/configuracion/menu';
import { Permiso } from './../_model/permiso';
import { UsuarioService } from './configuracion/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigPermisoService {

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
    ) { }
    
  private url: string = `${environment.UrlApi}/configpermiso`;
  
  configmenu(idempresa: string) {
    let urls = `${this.url}/GetAllConfigMenu?idempresa=${idempresa}`;
    return this.http.get<MenuResponse>(urls);
  }

  listar(idempresa: string) {
    let urls = `${this.url}/GetAllOpcionMenu?idempresa=${idempresa}`;
    return this.http.get<MenuResponse>(urls);
  }

  obtenerpermiso(codpantalla: string) {
    let idempresa = this.usuarioService.sessionUsuario().codigoempresa;
    let urls = `${this.url}/GetFirstPermiso?idempresa=${idempresa}&codpantalla=${codpantalla}`;
    return this.http.get<Permiso>(urls);
  }
}
