import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crechazo',
  templateUrl: './crechazo.component.html',
  styleUrls: ['./crechazo.component.css']
})
export class CrechazoComponent implements OnInit {
  ObsRevisor: string = '';
  obsAprobador: string = '';

  constructor(
    public dialogRef: MatDialogRef<CrechazoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if(this.data.ObsRevisor !== undefined)
      this.ObsRevisor = this.data.ObsRevisor;

    if(this.data.obsAprobador !== undefined)
      this.obsAprobador = this.data.obsAprobador;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
