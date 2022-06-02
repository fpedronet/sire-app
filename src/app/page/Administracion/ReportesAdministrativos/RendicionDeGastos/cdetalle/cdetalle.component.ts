import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { RendicionD } from 'src/app/_model/rendiciones/rendicionD';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cdetalle',
  templateUrl: './cdetalle.component.html',
  styleUrls: ['./cdetalle.component.css']
})
export class CdetalleComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CdetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private rendicionService : RendicionService,
    private usuarioService: UsuarioService,

  )
  {
    if(this.data.detalle !== undefined)
      this.rendDet = this.data.detalle;
  }

  form: FormGroup = new FormGroup({});
  loading = true;

  codigo? : string;

  tbConcepto: Combobox[] = [];
  tbTipoDocu: Combobox[] = [];
  tbMoneda: Combobox[] = [];
  tbComodato: Combobox[] = [];
  tbSede: Combobox[] = [];
  tbLinea: Combobox[] = [];

  fechaIni?: Date;
  fechaSelectIni?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  fechaMax?: Date;

  rendDet?: RendicionD = new RendicionD();

  ngOnInit(): void {
    this.fechaMax = new Date();

    this.inicializar();
  }

  inicializar(){
    this.form = new FormGroup({
      'ideRendicionDet': new FormControl({ value: this.rendDet?.ideRendicionDet, disabled: false}),
      'ideRendicion': new FormControl({ value: this.rendDet?.ideRendicion, disabled: false}),
      'fecha': new FormControl({ value: this.rendDet?.fecha, disabled: false}),
      'comodato': new FormControl({ value: '', disabled: false}),
      'ideSede': new FormControl({ value: 0, disabled: false}),
      'codLinea': new FormControl({ value: '', disabled: false}),
      'codConcepto': new FormControl({ value: '', disabled: false}),
      'tipDocu': new FormControl({ value: '', disabled: false}),
      'documento': new FormControl({ value: this.rendDet?.documento, disabled: false}),
      'codMoneda': new FormControl({ value: '', disabled: false}),
      'monto': new FormControl({ value: 0, disabled: false}),
      'descripcion': new FormControl({ value: '', disabled: false}),
      'rucPrv': new FormControl({ value: '', disabled: false}),
      'proveedor': new FormControl({ value: '', disabled: false}),
    });
  }

  obtener(){    

    this.spinner.showLoading();
  
    let filtro = this.usuarioService.sessionFiltro();

    

    this.spinner.hideLoading();
  }

  onCheckboxChange(e: any) {
    //console.log(this.listaEstados);
  }
  
  onDateChange(){
    this.fechaIni = this.fechaSelectIni;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){
    this.codigo = '';

    this.fechaIni = new Date();
    this.fechaSelectIni = new Date();
    this.fechaIni.setMonth(this.fechaMax!.getMonth() - 6);
    this.fechaSelectIni.setMonth(this.fechaMax!.getMonth() - 6);
    this.fechaFin = new Date();
    this.fechaSelectFin = new Date();
  }

  guardar(){
    
    this.dialogRef.close();
  }
}
