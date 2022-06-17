import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharepointService {

  constructor(private http: HttpClient) {} 
  
  private url: string = `http://localhost:64140/api`;

  obtenerPersona(tipoDocu: string, numDocu: string){
    let api = `${this.url}/sharepoint/PostUploadFileToSharePoint`;

    var url = api + "0" + tipoDocu + "/" + numDocu + "/" + 0 + "/" + 1;

    var p = this.http.get<object>(url);
    return p;
  }
}
