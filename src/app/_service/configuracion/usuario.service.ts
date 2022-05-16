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

  listaHospital(usuario: Usuario){
    usuario.key="!SDFT$$$$&F(/GF7&F7f))?=0'===IY(&&%$%$!H(U/GFD%VBN(MI YT% %RCGRCVBBUJNU(NN";
    let urls = `${this.url}/PostObtenerCandenaConexion`;

    return this.http.post<dataCollection>(urls, usuario);
  }

  sessionUsuario(){
    let helper = new JwtHelperService();
    let token = localStorage.getItem(environment.TOKEN_NAME);
    let banco = localStorage.getItem(environment.CODIGO_BANCO);

    if (!helper.isTokenExpired(token!)){
      let decodedToken = helper.decodeToken(token!); 
      
      decodedToken.codigobanco =banco;
      return decodedToken;
    }else{
      return null;
    }
  }

  sessionFiltro(){
    let filtro = localStorage.getItem(environment.CODIGO_FILTRO);

    let result = null;
    if(filtro!="" && filtro!=null && filtro!=undefined){
       result = filtro?.split('|');
    }      
    return result;
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
