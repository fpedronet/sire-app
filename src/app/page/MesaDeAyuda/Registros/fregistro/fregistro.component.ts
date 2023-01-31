import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith } from 'rxjs';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Permiso } from 'src/app/_model/permiso';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RegistroService } from 'src/app/_service/registro.service';
import forms from 'src/assets/json/formulario.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fregistro',
  templateUrl: './fregistro.component.html',
  styleUrls: ['./fregistro.component.css']
})
export class FregistroComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FregistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private registroService : RegistroService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private comboboxService: ComboboxService,
    private configPermisoService : ConfigPermisoService,
  ) {
    if(this.data.idPantalla !== undefined)
      this.idPantalla = this.data.idPantalla;
    if(this.data.titulos !== undefined)
      this.titulos = this.data.titulos;
  }

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger!: MatAutocompleteTrigger;
  loading = true;

  codigo? : string;
  permiso: Permiso = {};

  tablasMaestras = ['USUSOPORTE', 'ESTTICKET', 'CATETICKET'];
  tbUsuario: Combobox[] = [];
  idUsuario?: string;
  tbEstado: Combobox[] = [];
  idEstado?: string;
  tbCategoria: Combobox[] = [];
  idCategoria?: string;
  idCanal?: string = '001';

  fechaIni?: Date;
  fechaSelectIni?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  idPantalla?: number;
  titulos?: string[] = [];

  fechaMax?: Date;

  carBuscaAuto: number = 0;
  nroMuestraAuto: number = 0;

  ngOnInit(): void {

    this.obtenerpermiso();
    //debugger;
    this.fechaMax = new Date();

    this.fechaIni = new Date();
    this.fechaSelectIni = new Date();
    this.fechaIni.setMonth(this.fechaMax.getMonth() - 1);
    this.fechaSelectIni.setMonth(this.fechaMax.getMonth() - 1);

    this.fechaFin = new Date();
    this.fechaSelectFin = new Date();

    this.listarCombos().then(res => {
      this.obtener();
    });   
  }

  async listarCombos(){
    return new Promise(async (resolve) => {
      this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
        if(data === undefined){
          this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
        }
        else{
          var tbCombobox: Combobox[] = data.items;
          
          this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUSOPORTE');
          this.tbEstado = this.obtenerSubtabla(tbCombobox,'ESTTICKET');
          this.tbCategoria = this.obtenerSubtabla(tbCombobox,'CATETICKET');
        }
        resolve('ok');
      });
    });   
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.etiqueta?.toString()?.trim() === cod);
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.reporteAdmin.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  obtener(){    

    this.spinner.showLoading();

    let filtro = this.usuarioService.sessionFiltro();

    this.tbEstado;

    if(filtro !== null){
      this.idUsuario = filtro![0];
      this.idEstado = filtro![1];
      this.idCategoria = filtro![2];
      this.codigo = filtro![3];

      this.fechaSelectIni = new Date(filtro![4]);
      this.fechaIni = new Date(filtro![4]);

      this.fechaSelectFin = new Date(filtro![5]);
      this.fechaFin = new Date(filtro![5]);

      this.idCanal = filtro![6];
    }    

    this.spinner.hideLoading();
  }

  selectEstado(id: string){
    this.idEstado = id;
  }

  selectUsuario(id: string){
    this.idUsuario = id;
  }

  selectCategoria(id: string){
    this.idCategoria = id;
  }
  
  onDateChange(){
    this.fechaIni = this.fechaSelectIni;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){

    this.idUsuario = this.idUsuario = this.usuarioService.sessionUsuario().ideUsuario;
    this.idEstado = '0'
    this.idCategoria = '0'
    this.codigo = ''

    this.fechaIni = new Date();
    this.fechaSelectIni = new Date();
    this.fechaIni.setMonth(this.fechaMax!.getMonth() - 1);
    this.fechaSelectIni.setMonth(this.fechaMax!.getMonth() - 1);
    this.fechaFin = new Date();
    this.fechaSelectFin = new Date();

    localStorage.setItem(environment.CODIGO_FILTRO,
      this.idUsuario?.toString() + '|' +
      this.idEstado?.toString() + '|' +
      this.idCategoria + '|' +
      this.codigo + '|' +
      this.fechaIni + '|' +
      this.fechaFin + '|' +
      this.idCanal);
  }

  buscar(){
    if(this.idUsuario === ''){
      if(this.idPantalla === 1)
        this.idUsuario = this.usuarioService.sessionUsuario().ideUsuario;
      else
        this.idUsuario = '0';
    }

    localStorage.setItem(environment.CODIGO_FILTRO,
      this.idUsuario?.toString() + '|' +
      this.idEstado?.toString() + '|' +
      this.idCategoria + '|' +
      this.codigo + '|' +
      this.fechaIni + '|' +
      this.fechaFin + '|' +
      this.idCanal);
    
    this.dialogRef.close();
  }

}
