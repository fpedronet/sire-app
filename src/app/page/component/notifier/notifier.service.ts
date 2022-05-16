import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private toastr: ToastrService) { }

  showNotification(tipo:number,title:string, message: string){
      if(tipo==0){
        this.toastr.error(message, '', {
          timeOut: 3000,
          positionClass:'toast-top-center',
          closeButton:true
        })
      }
      else if(tipo==1){
        this.toastr.success(message, '',{
          timeOut: 3000,
          positionClass:'toast-top-center',
          closeButton:true
        })
      }
      else if(tipo==2){
        this.toastr.warning(message, '',{
          timeOut: 3000,
          positionClass:'toast-top-center',
          closeButton:true
        })
      }
   
    }
}
