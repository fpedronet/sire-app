import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { dataCollection } from '../_model/dataCollection';
import { Response } from 'src/app/_model/response';
import { Registro, RegistroRequest } from '../_model/registros/registro';
import * as e from 'express';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {



  constructor(private http: HttpClient
    ) { }

    private url: string = `${environment.UrlApi}/registro`;

  listar(ideUsuario: number, ideEstado: string, codCat: string, codigo: string, fechaIni?: Date, fechaFin?: Date, canal?: string, page?: number,pages?: number) {
    //debugger;
    let req = new RegistroRequest()
    req.IdeUsuario = ideUsuario;
    req.IdeEstado = ideEstado;
    req.CodCat = codCat;
    req.Codigo = codigo;
    req.FechaIni= fechaIni;
    req.FechaFin = fechaFin;
    req.Canal = canal;
    req.Page = page!+1;
    req.Pages = pages;

    let urls = `${this.url}/GetAllRegistro`;
    return this.http.post<dataCollection>(urls,req);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstRegistro?id=${id}`;

    return this.http.get<Registro>(urls);
  }

  guardar(model: Registro){
    let urls = `${this.url}/PostSaveRegistro`;
    return this.http.post<Response>(urls, model);
  }
  GetKPITickets(fdesde: Date, fhasta: Date){
    let urls = `${this.url}/GetKPITickets?fdesde=${fdesde}&fhasta=${fhasta}`;
    return this.http.get<Registro>(urls);
  }
  GetTotalTicketsXUsuario() {
    //debugger;
    let urls = `${this.url}/GetTotalTicketsXUsuario`;
    return this.http.get<dataCollection>(urls);
  }

}
