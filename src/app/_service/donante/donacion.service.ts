import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donacion } from 'src/app/_model/donante/donacion';
import { environment } from 'src/environments/environment';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class DonacionService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/donacion`;
  
  obtener(id: Number,codigo:string,idbanco:number ){
    let urls = `${this.url}/GetFirstDonacion?id=${id}&codigo=${codigo}&idbanco=${idbanco}`;

    return this.http.get<Donacion>(urls);
  }

  guardar(model: Donacion){
    let urls = `${this.url}/PostSaveDonacion`;
    return this.http.post<Response>(urls, model);
  }
}
