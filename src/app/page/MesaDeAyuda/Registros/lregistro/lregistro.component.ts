import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Permiso } from 'src/app/_model/permiso';
import { Registro, RegistroRequest } from 'src/app/_model/registros/registro';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RegistroService } from 'src/app/_service/registro.service';
import forms from 'src/assets/json/formulario.json';
import { Combobox } from 'src/app/_model/combobox';
import { environment } from 'src/environments/environment';
import { merge, startWith, switchMap, of as observableOf, catchError, map } from 'rxjs';
import { FregistroComponent } from '../fregistro/fregistro.component';
import { IregistroComponent } from '../iregistro/iregistro.component';
import { response } from 'express';

@Component({
  selector: 'app-lregistro',
  templateUrl: './lregistro.component.html',
  styleUrls: ['./lregistro.component.css']
})
export class LregistroComponent implements OnInit {

  dataSource: Registro[] = [];
  displayedColumns: string[] = ['codigo1', 'codigo', 'tipo', 'usuario', 'categoria', 'servicio', 'estado', 'accion','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  ticketsN1:number = 0;
  totalTickets:number = 0;
  kpiTicketsResueltos:number = 0;
  fdesde:Date = new Date();
  fhasta:Date = new Date();

  idPantalla: number = 0;
  tituloPantalla: string[] = ['','','',''];

  request = new RegistroRequest();

  permiso: Permiso = {};

  tablasMaestras = ['USUARIO','ESO'];
  tbUsuario: Combobox[] = [];
  listaEstados: Combobox[] = [];
  tbMoneda: Combobox[] = [];

  selection = new SelectionModel<Registro>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private registroService : RegistroService,
    private usuarioService : UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private confirmService : ConfimService,
    public customPaginator: MatPaginatorIntl,
    private comboboxService: ComboboxService,
    private notifierService : NotifierService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.configurarPaginador();
    
    //debugger;
    this.obtenerpermiso();
    //this.listarestados();

    this.listarUsuario();
  }

  listarUsuario(){    
    this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;
        
        this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUARIO');
      }

    });
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.etiqueta?.toString()?.trim() === cod);
  }

  configurarPaginador(){
    this.customPaginator.itemsPerPageLabel = 'Ítems por página';
    this.customPaginator.firstPageLabel = 'Primera página';    
    this.customPaginator.previousPageLabel = 'Página anterior'; 
    this.customPaginator.nextPageLabel  = 'Página siguiente';
    this.customPaginator.lastPageLabel = 'Última página';
    this.customPaginator.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 a ${length }`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }

  completarCombo(json: any){
    var tbCombo = [];

    for(var i in json) {
      let el: Combobox = {};

      el.valor = json[i].valor;
      el.descripcion = json[i].descripcion;
      el.visual = json[i].visual;
      
      tbCombo.push(el);
    }

    return tbCombo;
  }

  cargarFiltros(){
    let filtro = this.usuarioService.sessionFiltro();

    if(filtro!=null){
      this.request.IdeUsuario = parseInt(filtro[0]);
      this.request.IdeEstado = filtro[1];
      this.request.CodCat = filtro[2];
      this.request.Codigo = filtro[3];
      this.request.FechaIni = new Date(filtro[4]);
      this.request.FechaFin = new Date(filtro[5]);
      this.request.Canal = filtro[6]; //Sistemas
    }else{
      this.request.IdeUsuario! = this.usuarioService.sessionUsuario().ideUsuario;
      this.request.IdeEstado! = '0';
      this.request.CodCat! = '0';
      this.request.Codigo! = '';      
      this.request.FechaIni! = new Date();
      this.request.FechaIni.setMonth(this.request.FechaIni!.getMonth() - 1);
      this.request.FechaFin! = new Date();
      this.request.Canal = '001'; //Sistemas
    }

    //debugger;
    localStorage.setItem(environment.CODIGO_FILTRO,
    this.request.IdeUsuario?.toString() + '|' +
    this.request.IdeEstado?.toString() + '|' +
    this.request.CodCat + '|' +
    this.request.Codigo + '|' +
    this.request.FechaIni + '|' +
    this.request.FechaFin + '|' +
    this.request.Canal);
  }

  actualizar(){
    //debugger;
    //this.cargarFiltros();
    
    this.ngAfterViewInit();
  }

  ngAfterViewInit(codigo: string = '') {
    this.cargarFiltros();

    this.registroService = new RegistroService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
         
          this.loading = true;
          let filtro = this.usuarioService.sessionFiltro();

          //console.log(filtro);
          return this.registroService!.listar(
            parseInt(filtro![0]),
            filtro![1],
            filtro![2],
            (codigo === '' ? filtro![3] : codigo),
            new Date(filtro![4]),
            new Date(filtro![5]),
            filtro![6],
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

          this.loading = false;
          this.existRegistro = res === null;

          this.selection = new SelectionModel<Registro>(true, []);

          if (res === null) {
            return [];
          }
          this.countRegistro = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.dataSource = data));      
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.reporteAdmin.codigo).subscribe(data=>{
      //debugger;
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  GetKPITickets(){
    this.spinner.showLoading();
    return this.registroService.GetKPITickets(this.fdesde,this.fhasta).subscribe(datos=>{
      this.kpiTicketsResueltos = Math.round(datos.kpiTicketsResueltos ? datos.kpiTicketsResueltos : 0);
      this.totalTickets = Math.round(datos.totalTickets ? datos.totalTickets : 0);
      this.ticketsN1 = Math.round(datos.ticketsN1 ? datos.ticketsN1 : 0);
      this.spinner.hideLoading();
    })
  }

  buscaUsuario(idUsuario: number){
    //debugger;
    var nombre: string = '';
    var usuObj = this.tbUsuario.find(e => e.valor === idUsuario.toString());
    if(usuObj !== undefined)
      nombre = usuObj.descripcion === undefined?'':usuObj.descripcion;
    return nombre;
  }

  abrirBusqueda(){
    const dialogRef =this.dialog.open(FregistroComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data: {
        //titulos: this.tituloPantalla,
        //idPantalla: this.idPantalla,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.paginator.pageIndex = 0,
        this.paginator.pageSize = 20
        this.ngAfterViewInit();
        }
    })
  }

  getDescripcion(value: string, lista: Combobox[]){
    //debugger;
    var obj = lista?.find(e => e.valor === value);
    var desc: string = '';
    if(obj !== undefined)
      desc = obj.descripcion!;
    return desc;
  }

  puedeAccionEstado(ideEstado: number){
    if(this.idPantalla === 2 && (ideEstado === 3 || ideEstado === 6))
      return true;
    if(this.idPantalla === 3 && (ideEstado === 3))
      return true;
    if(this.idPantalla === 4 && (ideEstado === 2))
      return true;
    return false;
  }

  puedeEditar(usu: number, est: number){
    //return est <= 1 && (this.permiso.editartodos || this.mismoUsuario(usu));
    return true;
  }

  mismoUsuario(usu: number){
    return usu == this.usuarioService.sessionUsuario().ideUsuario;
  }

  abrirAgregar(){
    const dialogRef =this.dialog.open(IregistroComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data: {
        //titulos: this.tituloPantalla,
        //idPantalla: this.idPantalla,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && result !== ''){
        this.ngAfterViewInit(result.toString());
      }
      else{
        this.ngAfterViewInit();
      }
    });  
  }
}
