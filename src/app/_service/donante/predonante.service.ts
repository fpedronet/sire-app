import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { Predonante, PredonanteRequest } from 'src/app/_model/donante/predonante';
import { Response } from 'src/app/_model/response';
import { dataCollection } from '../../_model/dataCollection';
import { Persona, PersonaPoclab } from '../../_model/donante/persona';
import { PersonaHistorial } from '../../_model/donante/personahistorial';

@Injectable({
  providedIn: 'root'
})
export class PredonanteService {

  constructor(
    private http: HttpClient
    // private socket: Socket,
    ) {} 
  
  private url: string = `${environment.UrlApi}/predonante`;

  listar(idbanco: number, ideestado: number,idecampania: number, ideorigen : number, nombre: string, fechadesde: Date, fechahasta: Date, page: number,pages: number) {
    let req = new PredonanteRequest()
    req.Idebanco = idbanco;
    req.IdeEstado= ideestado;
    req.Idecampania= idecampania;
    req.IdeOrigen= ideorigen;
    req.Nombres= nombre;
    req.FechaDesde= fechadesde;
    req.FechaHasta = fechahasta;
    req.Page = page+1;
    req.Pages = pages;
   
    let urls = `${this.url}/GetAllPredonante`;
    return this.http.post<dataCollection>(urls,req);
  }

  listarligth(idbanco: number, ideestado: number,idecampania: number, ideorigen : number, nombre: string, fechadesde: Date, fechahasta: Date, page: number,pages: number) {
    let req = new PredonanteRequest()
    req.Idebanco = idbanco;
    req.IdeEstado= ideestado;
    req.Idecampania= idecampania;
    req.IdeOrigen= ideorigen;
    req.Nombres= nombre;
    req.FechaDesde= fechadesde;
    req.FechaHasta = fechahasta;
    req.Page = page+1;
    req.Pages = pages;

    let urls = `${this.url}/GetAllPredonanteLight`;

    return this.http.post<dataCollection>(urls,req);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstPredonante?id=${id}`;

    return this.http.get<Predonante>(urls);
  }

  obtenerPersona(idPersona: number, tipoDocu: string = '', numDocu: string = ''){
    let urls = `${this.url}/GetFirstPersona?idPersona=${idPersona}&tipoDocu=${tipoDocu}&numDocu=${numDocu}`;

    return this.http.get<Persona>(urls);
  }

  obtenerHistorial(idPersona: number = 0){
    //debugger;
    let urls = `${this.url}/GetAllPersonaHistorial?idPersona=${idPersona}`;

    return this.http.get<dataCollection>(urls);
  }

  guardar(model: Predonante){
    //debugger;
    let urls = `${this.url}/PostSavePredonante`;
    return this.http.post<Response>(urls, model);
  }

  obtenerFiltro(codigobanco: number) {
    let urls = `${this.url}/GetBusquedaPredonanteLight?idbanco=`+codigobanco;

    return this.http.get<Predonante>(urls);
  }

  postFile(model: Predonante) {
    let urls = `${this.url}/PostSaveFoto`;
    return this.http.post<Response>(urls, model);
  }

  obtenerFoto(){
    let urls = `${this.url}/GetFirstFoto`;

    return this.http.get<Persona>(urls);
  }


}
