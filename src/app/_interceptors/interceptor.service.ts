import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotifierService } from '../page/component/notifier/notifier.service';
import { SpinnerService } from '../page/component/spinner/spinner.service';
import { UsuarioService } from '../_service/configuracion/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private notifierService : NotifierService,
    private spinner : SpinnerService,
    private usuarioService : UsuarioService,
  ) { }

intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  let session =this.usuarioService.sessionUsuario();
  let request = req;

    if (session!=null) {
      let token =localStorage.getItem(environment.TOKEN_NAME);
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
     }

     request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

     return next.handle(request).pipe(
      // map((event: HttpEvent<any>) => {
      //     if (event instanceof HttpResponse) {
      //         // console.log('event--->>>', event);
      //         this.spinner.hideLoading();
      //     }
      //     return event;
      // }),
      catchError((error: HttpErrorResponse) => {
       
          let errorMsg = '';
          if(error.status === 401){           
           return this.handleRefreshToken(req,next);
          }
          else if (error.error instanceof ErrorEvent) {            
              errorMsg = `Error: ${error.error.message}`;
              this.notifierService.showNotification(0,"Error",errorMsg);
              this.spinner.hideLoading();
          } else {
              errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
              this.notifierService.showNotification(0,"Error",errorMsg);
              this.spinner.hideLoading();
          }    
          return throwError(errorMsg);      
         })
      );

  }

  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler){
   return this.usuarioService.refreshtoken().pipe(
    switchMap((data:any)=>{
      this.usuarioService.savetoken(data);
        return next.handle(this.AddTokenheader(req, data.access_token));
    }),
    catchError(errorMsg => {
      this.usuarioService.closeLogin();
      return throwError(errorMsg);      
    })
   );
  }

  AddTokenheader(req: HttpRequest<any>, token:any){
    return req.clone({headers: req.headers.set('Authorization', 'Bearer'+ token)});
  }
}
