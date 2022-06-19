import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { dataCollection } from '../_model/dataCollection';
import { EstadoRequest, RendicionM, RendicionRequest } from '../_model/rendiciones/rendicionM';
import { Response } from 'src/app/_model/response';
import { RendicionD } from '../_model/rendiciones/rendicionD';

@Injectable({
  providedIn: 'root'
})
export class RendicionService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/rendicion`;

  listar(codigo: string, idePantalla: number, ideUsuario: number, lstEstados: number[], fechaIni?: Date, fechaFin?: Date, tipo?: string, page?: number,pages?: number) {
    let req = new RendicionRequest()
    req.Codigo = codigo;
    req.IdePantalla = idePantalla;
    req.IdeUsuario = ideUsuario;
    req.LstEstados= lstEstados;
    req.FechaIni= fechaIni;
    req.FechaFin = fechaFin;
    req.Tipo = tipo;
    req.Page = page!+1;
    req.Pages = pages;
    //debugger;
   
    let urls = `${this.url}/GetAllRendicionM`;
    return this.http.post<dataCollection>(urls,req);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstRendicion?id=${id}`;

    return this.http.get<RendicionM>(urls);
  }

  guardar(model: RendicionM){
    let urls = `${this.url}/PostSaveRendicionM`;
    return this.http.post<Response>(urls, model);
  }

  guardarDet(model: RendicionD){
    let urls = `${this.url}/PostSaveRendicionD`;
    return this.http.post<Response>(urls, model);
  }

  cambiarEstado(id: number, est: number, obs: string){
    let req = new EstadoRequest()
    req.IdeRendicion = id;
    req.NuevoEstado = est
    req.ObsRechazo= obs;
    
    let urls = `${this.url}/PostCambiarEstado`;
    return this.http.post<Response>(urls, req);
  }
}
