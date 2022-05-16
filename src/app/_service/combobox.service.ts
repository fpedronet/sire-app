import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { dataCollection } from '../_model/dataCollection';

@Injectable({
  providedIn: 'root'
})
export class ComboboxService {

  private url: string = `${environment.UrlApi}/tablamaestra`;
  static http: any;

  constructor(private http: HttpClient) { }

  public cargarDatos(CodigosTabla: string[], IdeUsuario: number, IdeBanco: number = 0){
    var CodTabla = CodigosTabla.join('|');
    //debugger;

    let href = `${this.url}/GetAllTablaMaestra`;
    let urls = `${href}?CodTabla=${CodTabla}&IdeUsuario=${IdeUsuario}&IdeBanco=${IdeBanco}`;
    return this.http.get<dataCollection>(urls);
  }
  
}
