import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { dataCollection } from '../_model/dataCollection';
import { Response } from 'src/app/_model/response';
import { trackingRequest } from '../_model/tracking';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

    constructor(private http: HttpClient) { }
  private url: string = `${environment.UrlApi}/tracking`;

  GetTrackingOrdenes(filtro?: string, ideUsuario?: string,  empresa?: string){
    let req = new trackingRequest();
    req.ideUsuario = ideUsuario;
    req.filtro = filtro;
    req.empresa = empresa;
    let urls = `${this.url}/GetTrackingOrdenes?filtro=`+filtro+`&ideUsuario=`+ideUsuario+`&empresa=`+empresa+``;
    return this.http.post<dataCollection>(urls,req);
  }

}
