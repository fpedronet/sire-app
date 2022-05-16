import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Persona, PersonaPoclab } from '../../_model/donante/persona';

@Injectable({
  providedIn: 'root'
})
export class PoclabService {

  constructor(private http: HttpClient) {} 
  
  private url: string = `https://service.poclab.pe/poclab/`;

  obtenerPersona(tipoDocu: string, numDocu: string){
    let api = `${this.url}/Persona/BuscarPersona/`;

    var url = api + "0" + tipoDocu + "/" + numDocu + "/" + 0 + "/" + 1;

    var p = this.http.get<PersonaPoclab>(url);
    return p;
  }
}
