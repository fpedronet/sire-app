import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Grafico } from '../_model/grafico';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {

  private url: string = `${environment.UrlApi}/grafico`;

  constructor(
    private http: HttpClient
  ) { }

  public listar(idbanco: number, fdesde: Date, fhasta: Date, idGrafico: number = 0){

    let fechadesde = (fdesde==undefined)? '' : fdesde.toDateString();
    let fechahasta= (fhasta==undefined)? '' : fhasta.toDateString();

    let href = `${this.url}/GetAllGrafico`;
    let urls = `${href}?idbanco=${idbanco}&fdesde=${fechadesde}&fhasta=${fechahasta}&idgrafico=${idGrafico}`;

    return this.http.get<Grafico[]>(urls);
  }

}
