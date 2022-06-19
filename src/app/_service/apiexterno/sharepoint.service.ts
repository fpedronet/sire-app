import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RendicionD } from 'src/app/_model/rendiciones/rendicionD';
import { Response } from 'src/app/_model/response';
import { SharePointDto } from 'src/app/_model/sharePointDto';

@Injectable({
  providedIn: 'root'
})
export class SharepointService {

  constructor(private http: HttpClient) {} 
  
  private url: string = `http://localhost:62404/api/sharepoint/postuploadsharepoint`;

  postUploadFileToSharePoint(model: RendicionD){
    debugger;
    let sharepoint = new SharePointDto;
    sharepoint.userName = model.emailEmp;
    sharepoint.password = model.password;
    sharepoint.fileName = model.nombreAdjunto;
    sharepoint.adjunto = model.adjunto;

    const headers = new HttpHeaders().set('content-type', 'application/json');  
    var body = {
      userName : model.emailEmp,
      password : model.password,
      fileName : model.nombreAdjunto,
      adjunto : model.adjunto,
    }  

     return this.http.post<Response>(this.url, body, { headers });  
     
  }
}
