import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crechazo',
  templateUrl: './crechazo.component.html',
  styleUrls: ['./crechazo.component.css']
})
export class CrechazoComponent implements OnInit {
  observacion: string = '';
  rol: string = '';

  constructor(
    public dialogRef: MatDialogRef<CrechazoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if(this.data.rol !== undefined)
      this.rol = this.data.rol;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  rolNombre(){
    var nom: string = '';
    if(this.rol === 'A')
      nom = 'Aprobador, '
    if(this.rol === 'R')
      nom = 'Revisor, '
    return nom;
  }

}
