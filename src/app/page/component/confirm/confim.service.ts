import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmComponent } from './confirm.component';


@Injectable({
  providedIn: 'root'
})
export class ConfimService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(onOk: boolean, msg: string, msg2: string = '', msg3: string = '', msg4: string = ''){
  return this.dialog.open(ConfirmComponent,{
      width:'430px',
      disableClose:true,
      data:{
        onlyOk: onOk,
        message: msg,
        message2: msg2,
        message3: msg3,
        message4: msg4,
      }
    });
  }
}
