import { Component, OnInit,Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data : any,
    public dialogRef: MatDialogRef<ConfirmComponent>
  ) { }

  otrasLineas: boolean = true;

  ngOnInit(): void {
    //Falta setear el valor de otras líneas según si la cadena msg2 es vacía
    var lineas = document.getElementById("otrasLineas");
    if(this.otrasLineas){
      if(lineas) lineas.style.display = "block"
    }
    else{
      if(lineas) lineas.style.display = "none"
    }
  }
}
