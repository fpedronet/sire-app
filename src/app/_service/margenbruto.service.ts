import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { dataCollection } from '../_model/dataCollection';
import { Response } from 'src/app/_model/response';
import { MargenBrutoRequest } from '../_model/margenbruto';

@Injectable({
  providedIn: 'root'
})
export class MargenbrutoService {

  constructor(private http: HttpClient) { }
  private url: string = `${environment.UrlApi}/contabilidad`;

  listar(opcion: string, desde?: Date, hasta?: Date, bonificacion?: number, demostracion?: number, muestra?: number, deteriorado?:number, UndNegocio?:number, page?: number,pages?: number) {
    //debugger;
    let req = new MargenBrutoRequest()
    req.OPCION = opcion;
    req.FECHA_DESDE = desde;
    req.FECHA_HASTA = hasta;
    req.BONIFICACION = bonificacion;
    req.DEMOSTRACION = demostracion;
    req.MUESTRA = muestra;
    req.DETERIORADO = deteriorado;
    req.UndNegocio = UndNegocio;

    let urls = `${this.url}/Buscar_MargenBruto`;
    return this.http.post<dataCollection>(urls,req);
  }
}
