import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DigitalPlanet } from 'src/app/_model/digitalPlanet';

@Injectable({
  providedIn: 'root'
})
export class PoclabService {

  constructor(private http: HttpClient) {} 
  
  // private url: string = `https://service.poclab.pe/poclab/`;
  private url: string = `http://localhost:64389/`;

  obtenerPersona(tipoDocu: string, numDocu: string){
    let api = `${this.url}/Persona/BuscarPersona/`;

    var url = api + "0" + tipoDocu + "/" + numDocu + "/" + 0 + "/" + 1;

    var p = this.http.get<object>(url);
    return p;
  }

  obtenerRuc(numDocu: string){
    let api = `${this.url}/Persona/BuscarRuc/`;

    var url = api +"/"+ numDocu;

    var p = this.http.get<DigitalPlanet>(url);
    return p;
  }

}
