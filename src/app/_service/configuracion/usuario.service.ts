import { dataCollection } from './../../_model/dataCollection';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { TokenUsuario, Usuario } from '../../_model/configuracion/usuario';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string = `${environment.UrlApi}/usuario`;
  
  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  login(usuario: Usuario){
    let urls = `${this.url}/PostLogin`;

    return this.http.post<TokenUsuario>(urls, usuario);
  }

  refreshtoken(){
    let urls = `${this.url}/PostRefreshToken`;
    let model = new TokenUsuario();

    model.access_token = localStorage.getItem(environment.TOKEN_NAME)!;

    return this.http.post<TokenUsuario>(urls, model);
  }

  savetoken(token: TokenUsuario){
    localStorage.setItem(environment.TOKEN_NAME, token.access_token!);
  }

 actualizarpasswordsharePoint(usuario: Usuario){
    let urls = `${this.url}/PostActualizarPasswordSharePoint`;

    return this.http.post<Response>(urls, usuario);
  }

  sessionUsuario(){
    let helper = new JwtHelperService();
    let token = localStorage.getItem(environment.TOKEN_NAME);
    let codigoempresa = localStorage.getItem(environment.CODIGO_EMPRESA);
    let contraseniaSharepoint = localStorage.getItem(environment.PASSWORD_SHAREPOINT);

    // if (!helper.isTokenExpired(token!)){
      if(token!=null){
        let decodedToken = helper.decodeToken(token!);       
        decodedToken.codigoempresa =codigoempresa;
        decodedToken.contraseniaSharepoint = contraseniaSharepoint;
        decodedToken.strFoto = localStorage.getItem(environment.FOTO);
        return decodedToken;
      }else{
        return null
      }
    // }else{
    //   return null;
    // }
  }

  sessionFiltro(){
    let filtro = localStorage.getItem(environment.CODIGO_FILTRO);

    let result = null;
    if(filtro!="" && filtro!=null && filtro!=undefined){
       result = filtro?.split('|');
    }      
    return result;
  }

  sessionDetalle(){
    let filtro = localStorage.getItem(environment.CODIGO_DETALLE);

    let result = null;
    if(filtro!="" && filtro!=null && filtro!=undefined){
       result = filtro?.split('|');
    }      
    return result;
  }

  closeLogin(){
    localStorage.clear();
    //this.router.navigate(['']);
    window.location.reload();
    // return false;
  }

}
