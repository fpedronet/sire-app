import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import { environment } from 'src/environments/environment';
import jsonEstado from 'src/assets/json/rendicion/renestado.json';
import { formatDate } from '@angular/common';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { Permiso } from 'src/app/_model/permiso';
import forms from 'src/assets/json/formulario.json';
import { map, Observable, of, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-frendicion',
  templateUrl: './frendicion.component.html',
  styleUrls: ['./frendicion.component.css']
})
export class FrendicionComponent implements OnInit {
  
  constructor(
    private dialogRef: MatDialogRef<FrendicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private rendicionService : RendicionService,
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

  tablasMaestras = ['USUARIO'];
  tbUsuario: Combobox[] = [];
  usuarioColor: string = 'warn';
  filterUsuarios: Observable<Combobox[]> | undefined;
  controlUsuarios = new FormControl();
  idUsuario: string = '';

  listaEstados?: Combobox[] = [];
  initEstados?: number[] = [0, 1, 1, 0, 0, 0, 0];
  idEstados?: number[] = this.initEstados;

  listaTipos?: Combobox[] = [];
  idTipo?: string;

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
    this.fechaIni.setMonth(this.fechaMax.getMonth() - 6);
    this.fechaSelectIni.setMonth(this.fechaMax.getMonth() - 6);

    this.fechaFin = new Date();
    this.fechaSelectFin = new Date();

    //debugger;
    
    this.listarEstadosUsuarios().then(res => {
      this.obtener();
    });
  }

  async listarUsuario(){
    return new Promise(async (resolve) => {
      this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
        if(data === undefined){
          this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
        }
        else{
          var tbCombobox: Combobox[] = data.items;
          //debugger;
          
          this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUARIO');
          this.initFilterUsuarios();
        }
        resolve('ok');
      });
    });   
    
  }

  initFilterUsuarios(){
    this.filterUsuarios = this.controlUsuarios.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string'?value:value.descripcion)),
      map(name  => (name?this.buscarUsuarios(name):[]))
    )
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

  async listarEstadosUsuarios(){
    return new Promise(async (resolve) => {

      this.listaEstados = [];

      for(var i in jsonEstado) {
        let el: Combobox = {};
  
        el.valor = jsonEstado[i].nIdEstado;
        el.descripcion = jsonEstado[i].vDescripcion;
        el.visual = jsonEstado[i].visual && jsonEstado[i].pantallas[this.idPantalla!-1] === 1;
        el.arrayAux1 = jsonEstado[i].pantallas;
        el.isChecked = false;
        
        this.listaEstados.push(el);
      }

      this.listarUsuario().then(res => {
        resolve('ok');
      });

      
    });
    
  }

  obtener(){    

    this.spinner.showLoading();

    this.resetEstados();
  
    let filtro = this.usuarioService.sessionFiltro();

    if(filtro !== null){
      this.codigo = filtro![0];
      var strEstados = filtro![1].split(',');

      this.idEstados = [];
      let i = 0
      
      strEstados.forEach(e => {
        
        //Busca el estado correspondiente del combobox
        let est = this.listaEstados?.find(x => x.valor == i.toString())

        if(e === '0'){
          this.idEstados?.push(0);          
          if(est !== undefined)
            est.isChecked = false;
        }
        else{
          this.idEstados?.push(1);
          if(est !== undefined)
            est.isChecked = true;
        }
        i++;
      });
      this.idTipo=filtro![2];

      this.fechaSelectIni = new Date(filtro![3]);
      this.fechaIni = new Date(filtro![3]);

      this.fechaSelectFin = new Date(filtro![4]);
      this.fechaFin = new Date(filtro![4]);

      this.idUsuario = filtro![5];
      //debugger;
      var usuarioFind = this.tbUsuario.find(e => e.valor === this.idUsuario); //Usuario
      if(usuarioFind !== undefined){
        var usuario: Combobox = usuarioFind;      
        this.setCurUsuario(usuario);
      }
    }    

    this.spinner.hideLoading();
  }

  onCheckboxChange(e: any) {
    //console.log(this.listaEstados);
  }

  selecttipo(id: string){
    this.idTipo = id;
  }

  selectusuario(id: string){
    this.idUsuario = id;
  }
  
  onDateChange(){
    this.fechaIni = this.fechaSelectIni;
    this.fechaFin=  this.fechaSelectFin;    
  }

  getClassEstado(idEstado?: string){
    //debugger;
    var clase: string = '';
    var objEstado = jsonEstado.find((e: any) => e.nIdEstado.toString() === idEstado?.toString());
    if(objEstado !== undefined){
      clase = objEstado.class;
    }
    return clase;
  }

  limpiar(){
    this.codigo = '';
    this.resetEstados();

    this.fechaIni = new Date();
    this.fechaSelectIni = new Date();
    this.fechaIni.setMonth(this.fechaMax!.getMonth() - 6);
    this.fechaSelectIni.setMonth(this.fechaMax!.getMonth() - 6);
    this.fechaFin = new Date();
    this.fechaSelectFin = new Date();

    //Solo me setea por defecto cuando veo mis propias rendiciones
    if(this.idPantalla === 1)
      this.idUsuario = this.usuarioService.sessionUsuario().ideUsuario;
    else
      this.idUsuario = '0';

    var usuarioFind = this.tbUsuario.find(e => e.valor === this.idUsuario); //Usuario
    if(usuarioFind !== undefined){
      var usuario: Combobox = usuarioFind;      
      this.setCurUsuario(usuario);
    }

    localStorage.setItem(environment.CODIGO_FILTRO, this.codigo +"|"+ this.idEstados?.toString()+"||"+this.fechaIni+"|"+this.fechaFin+"|"+this.idUsuario?.toString());
  }

  resetEstados(){
    if(this.idPantalla === 1)
      this.initEstados = [0,1,1,0,0,0,0];
    if(this.idPantalla === 2)
      this.initEstados = [0,0,0,1,0,0,1];
    if(this.idPantalla === 3)
      this.initEstados = [0,0,0,1,0,0,0];
    if(this.idPantalla === 4)
      this.initEstados = [0,0,1,0,0,0,0];
    
    this.idEstados = this.initEstados;
    let i = 0;
    this.idEstados?.forEach(e => {
      let est = this.listaEstados?.find(x => x.valor == i.toString())
      if(est !== undefined){
        est.isChecked = e === 1;
      }
      i++;
    });
  }

  buscar(){
    this.idEstados = []
    this.listaEstados?.forEach(e => {
      if(e.isChecked)
        this.idEstados?.push(1);
      else
        this.idEstados?.push(0);
    });

    if(this.idUsuario === ''){
      if(this.idPantalla === 1)
        this.idUsuario = this.usuarioService.sessionUsuario().ideUsuario;
      else
        this.idUsuario = '0';
    }

    localStorage.setItem(environment.CODIGO_FILTRO, (this.codigo===undefined?'':this.codigo) +"|"+ this.idEstados?.toString()+"|"+this.idTipo+"|"+this.fechaIni+"|"+this.fechaFin+"|"+this.idUsuario?.toString());

    this.dialogRef.close();
  }

  changeUsuario(event: any){
    var usuario = event.option.value;
    if(usuario !== undefined){
      this.setCurUsuario(usuario, true)
    }
  }

  setCurUsuario(usuario?: Combobox, notControl: boolean = false){
    if(usuario === undefined){
      if(!notControl)
        this.controlUsuarios.setValue(new Combobox());
      this.idUsuario = '';
      this.usuarioColor = 'warn';
    }
    else{
      if(!notControl)
        this.controlUsuarios.setValue(usuario);
      this.idUsuario = usuario.valor!;
      this.usuarioColor = 'primary';
    }
  }
  
  mostrarAutoCombo(c: Combobox): string{
    var result = '';
    if(c !== undefined && c !== null && c.descripcion !== '')
      result = c.descripcion!;
    return result;
  }

  buscarUsuarios(name: string): Combobox[]{
    this.setCurUsuario(undefined, true);
    var results: Combobox[] = [];
    //debugger;
    if(name.length >= this.carBuscaAuto){
      var filtro = name.toLowerCase();
      //debugger;
      results = this.tbUsuario.filter(e => e.descripcion?.toLowerCase().includes(filtro));
    }    
    return results.slice(0,this.nroMuestraAuto===0?results.length:this.nroMuestraAuto);
  }

  regresaUsuario(){
    if(this.idUsuario === ''){
      var usuarioFind = this.tbUsuario.find(e => e.valor === '0'); //Usuario
      if(usuarioFind !== undefined){
        var usuario: Combobox = usuarioFind;      
        this.setCurUsuario(usuario);
      }
    }      
  }

}
