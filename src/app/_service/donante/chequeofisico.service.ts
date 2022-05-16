import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChequeoFisico } from '../../_model/donante/chequeofisico';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class ChequeofisicoService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/chequeofisico`;
  
  obtener(idpredonante: number,codigo:number,idbanco:number ){
    let urls = `${this.url}/GetFirstChequeFisico?idpredonante=${idpredonante}&codigo=${codigo}&idbanco=${idbanco}`;

    return this.http.get<ChequeoFisico>(urls);
  }

  guardar(model: ChequeoFisico){
    let urls = `${this.url}/PostSaveChequeoFisico`;
    return this.http.post<Response>(urls, model);
  }

}
