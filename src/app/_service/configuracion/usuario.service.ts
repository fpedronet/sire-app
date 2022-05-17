import { dataCollection } from './../../_model/dataCollection';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { TokenUsuario, Usuario } from '../../_model/configuracion/usuario';

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

  sessionUsuario(){
    let helper = new JwtHelperService();
    let token = localStorage.getItem(environment.TOKEN_NAME);
    // let banco = localStorage.getItem(environment.CODIGO_BANCO);

    if (!helper.isTokenExpired(token!)){
      let decodedToken = helper.decodeToken(token!); 
      
      // decodedToken.codigobanco =banco;
      return decodedToken;
    }else{
      return null;
    }
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
