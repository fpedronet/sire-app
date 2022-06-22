import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/reporte`;

  rptResumen(iderendicion:number){
    //debugger;
    let urls = `${this.url}/GetPrintResumen?iderendicion=${iderendicion}`;

    return this.http.get<string>(urls);
  }
}
