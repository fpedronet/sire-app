import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Etiqueta } from 'src/app/_model/reporte/etiqueta';
import { Ficha } from 'src/app/_model/reporte/ficha';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/reporte`;

  rptetiqueta(idedonacion: Number,idepredonante:number ){
    let urls = `${this.url}/GetPrintEtiqueta?idedonacion=${idedonacion}&idepredonante=${idepredonante}`;

    return this.http.get<string>(urls);
  }

  rptficha(idepredonante:number ){
    let urls = `${this.url}/GetPrintFicha?idepredonante=${idepredonante}`;

    return this.http.get<string>(urls);
  }
  
}
