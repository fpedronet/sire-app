import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rptetiqueta',
  templateUrl: './rptetiqueta.component.html',
  styleUrls: ['./rptetiqueta.component.css']
})
export class RptetiquetaComponent implements OnInit {

  window?: any;
  nombres?: string;
  documento: string ="";
  sexo?: string;
  hematocritos?: string;
  hemoglobina?: string;
  fecNacimiento?: string;
  edad?: string;
  grupo?: string;
  mostrarRh?: string;
  codMuestra?: string;
  vFecha?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
