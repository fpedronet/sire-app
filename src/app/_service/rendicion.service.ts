import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { dataCollection } from '../_model/dataCollection';
import { RendicionM, RendicionRequest } from '../_model/rendiciones/rendicionM';
import { Response } from 'src/app/_model/response';

@Injectable({
  providedIn: 'root'
})
export class RendicionService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/rendicion`;

  listar(codigo: string, idPantalla: number, lstEstados: number[], fechaIni?: Date, fechaFin?: Date, tipo?: string, page?: number,pages?: number) {
    //debugger;
    let req = new RendicionRequest()
    req.Codigo = codigo;
    req.IdPantalla = idPantalla
    req.LstEstados= lstEstados;
    req.FechaIni= fechaIni;
    req.FechaFin = fechaFin;
    req.Tipo = tipo;
    req.Page = page!+1;
    req.Pages = pages;
   
    let urls = `${this.url}/GetAllRendicionM`;
    return this.http.post<dataCollection>(urls,req);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstRendicion?id=${id}`;
    //debugger;

    return this.http.get<RendicionM>(urls);
  }

  guardar(model: RendicionM){
    //debugger;
    let urls = `${this.url}/PostSaveRendicionM`;
    return this.http.post<Response>(urls, model);
  }
}
