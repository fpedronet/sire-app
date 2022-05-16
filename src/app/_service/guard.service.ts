import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';


import { ConfigPermisoService } from './configpermiso.service';
import { map } from 'rxjs';
import { UsuarioService } from './configuracion/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private configPermisoService : ConfigPermisoService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //1) VERIFICAR SI ESTA LOGUEADO

    // return true;
    let token = localStorage.getItem(environment.TOKEN_NAME);
    let url = state.url;

    if (!token) {
      if(url=="/login" || url==""){
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
    }

    //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
    let helper = new JwtHelperService();
    if (!helper.isTokenExpired(token!)) {

      //3) vERIFICA SI CIERRAS SECCION 
      if(url=="/login"){
         this.router.navigate(['/page/home']);
         return false;
      }

      //3) OBTENIENDO EL ID DEL USUARIO PARA TRAER LAS OPCIONES DE MENU Y LOS PERMISO
      return this.configPermisoService.listar().pipe(map(x => {
        let cont = 0;
        for (let m of x.listaOpcionesMenu!) {

          if (url.startsWith(m.url!)) {

            var split1 = url.split('/')[3];

            if(split1=="aspirantelight"){
              var split2 = m.url!.split('/')[3];
              if(split1==split2){
                cont++;
                break;
              }
            }else{
              cont++;
              break;
            }

          }
        }
      
        if (cont > 0) {
          return true;
        } else {
          this.router.navigate(['/page/not-403']);
          return false;
        }

      }))     
    } else {
      this.usuarioService.closeLogin();
      return false;
    }
  } 
}
