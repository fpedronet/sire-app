import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RendicionD } from 'src/app/_model/rendiciones/rendicionD';
import { Response } from 'src/app/_model/response';
import { SharePointDto } from 'src/app/_model/sharePointDto';

@Injectable({
  providedIn: 'root'
})
export class SharepointService {

  constructor(private http: HttpClient) {} 
  
  private url: string = `http://localhost:64140/api/sharepoint/postUploadFileToSharePoint`;

  postUploadFileToSharePoint(model: RendicionD){
    debugger;

    let sharepoint = new SharePointDto;
    sharepoint.userName = model.emailEmp;
    sharepoint.password = model.password;
    sharepoint.fileName = model.nombreAdjunto;
    sharepoint.adjunto = model.adjunto;

    return this.http.post<Response>(this.url, sharepoint);
  }
}
