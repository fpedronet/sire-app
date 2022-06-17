import { catchError, map } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotifierService } from '../page/component/notifier/notifier.service';
import { SpinnerService } from '../page/component/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private notifierService : NotifierService,
    private spinner : SpinnerService,
  ) { }

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  let token =localStorage.getItem(environment.TOKEN_NAME);
    let request = req;

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
     }

     request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

     return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              // console.log('event--->>>', event);
              this.spinner.hideLoading();
          }
          return event;
      }),
      catchError((error: HttpErrorResponse) => {

        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {            
            errorMsg = `Error: ${error.error.message}`;
        } else {
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }

          this.notifierService.showNotification(0,"Error",errorMsg);
          this.spinner.hideLoading();
          return throwError(errorMsg);
         })
      );

  }
}
