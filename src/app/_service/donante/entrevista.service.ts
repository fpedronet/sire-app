import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Entrevista } from '../../_model/donante/entrevista';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class EntrevistaService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/entrevista`;
  
  obtener(idpredonante: number,codigo:number,idbanco:number ){
    let urls = `${this.url}/GetFirstEntrevista?idpredonante=${idpredonante}&codigo=${codigo}&idbanco=${idbanco}`;

    return this.http.get<Entrevista>(urls);
  }

  guardar(model: Entrevista){
    let urls = `${this.url}/PostSaveEntrevista`;
    return this.http.post<Response>(urls, model);
  }
}
