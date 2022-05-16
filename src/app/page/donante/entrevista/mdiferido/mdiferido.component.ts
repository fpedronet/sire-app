import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mdiferido',
  templateUrl: './mdiferido.component.html',
  styleUrls: ['./mdiferido.component.css']
})
export class MdiferidoComponent implements OnInit {

  fechadif: boolean = false;
  permanente: boolean = false;
  temporal: boolean  = false;
  periodo: string = '';
  dias: string = '';
  fechaHasta?: Date;
  fechaSelectHasta?: Date;
  fechaMin?: Date;

  constructor(
    private dialogRef: MatDialogRef<MdiferidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.periodo = this.data.periodo;
    this.dias = this.data.dias;

    this.changediferido(this.periodo);
  }

  ngOnInit(): void {
    this.fechaMin = new Date();
  }

  changediferido(estado: string){
  
    this.periodo = estado;
    let $dias =  (this.dias=="" ||  this.dias==null)? 0: parseInt(this.dias);

    if(this.periodo=="D"){
      this.permanente = true;
      this.temporal = false;
      this.fechadif = false;
    }
    else if(this.periodo=="T"){
      this.permanente = false;
      this.temporal = true;
      this.fechadif = true;
      this.fechaHasta = new Date();
      this.fechaSelectHasta = new Date();

      this.fechaHasta.setDate(this.fechaHasta.getDate() + $dias);
      this.fechaSelectHasta.setDate(this.fechaSelectHasta.getDate() + $dias);
    }
  }

  onDateChange(){
    this.fechaHasta = this.fechaSelectHasta;
  }

  confirmar(){
    this.dialogRef.close(
      { 
        confirmado: true,
        fechaHasta: this.fechaHasta,
        periodo: this.periodo
      });
  }
}
