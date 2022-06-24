import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Permiso } from 'src/app/_model/permiso';
import { RendicionM, RendicionRequest } from 'src/app/_model/rendiciones/rendicionM';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import forms from 'src/assets/json/formulario.json';
import { environment } from 'src/environments/environment';
import { FrendicionComponent } from '../frendicion/frendicion.component';
import jsonEstado from 'src/assets/json/rendicion/renestado.json';
import jsonMoneda from 'src/assets/json/detalle/moneda.json';
import { Combobox } from 'src/app/_model/combobox';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { CrechazoComponent } from '../crechazo/crechazo.component';

@Component({
  selector: 'app-lrendicion',
  templateUrl: './lrendicion.component.html',
  styleUrls: ['./lrendicion.component.css']
})
export class LrendicionComponent implements OnInit {

  dataSource: RendicionM[] = [];
  displayedColumns: string[] = ['select','codigo1', 'codigo', 'tipo', 'lugar', 'motivo', 'balance','estado','correo','accion','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  idPantalla: number = 0;
  tituloPantalla: string[] = ['','','',''];

  request = new RendicionRequest();

  permiso: Permiso = {};

  listaEstados: Combobox[] = [];
  tbMoneda: Combobox[] = [];

  selection = new SelectionModel<RendicionM>(true, []);

  sgteEstado1: number = 0;
  sgteIcono1: string = '';
  sgteAccion1: string = '';
  sgteEstado2: number = 0;
  sgteIcono2: string = '';
  sgteAccion2: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private rendicionService : RendicionService,
    private usuarioService : UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private confirmService : ConfimService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    //debugger;
    this.obtenerpermiso();
    this.listarestados();
    this.tbMoneda = this.completarCombo(jsonMoneda);

    //Obtiene tipo de pantalla actual
    this.route.params.subscribe((data: Params)=>{
      this.idPantalla = (data["idPantalla"]==undefined)?1:parseInt(data["idPantalla"]);
    });

    this.tituloPantalla[0] = 'MIS RENDICIONES/MOVILIDADES';
    this.tituloPantalla[1] = 'SEGUIMIENTO DE RENDICIONES/MOVILIDADES';
    this.tituloPantalla[2] = 'REVISIÓN DE RENDICIONES';
    this.tituloPantalla[3] = 'APROBACIÓN DE RENDICIONES/MOVILIDADES';
    
    if(this.idPantalla === 1)
      this.displayedColumns = this.displayedColumns.filter(e => e !== 'select');
    else
      this.configuraSgteEstado();
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

  configuraSgteEstado(){
    if(this.idPantalla === 2){ //Procesador
      this.sgteEstado1 = 5;
      this.sgteIcono1 = 'settings';
      this.sgteAccion1 = 'procesar';
      this.sgteEstado2 = 0;
      this.sgteIcono2 = '';
      this.sgteAccion2 = '';
    }
    if(this.idPantalla === 3){ //Revisor
      this.sgteEstado1 = 6;
      this.sgteIcono1 = 'check_circle';
      this.sgteAccion1 = 'aprobar revisión en';
      this.sgteEstado2 = 1;
      this.sgteIcono2 = 'cancel';
      this.sgteAccion2 = 'rechazar revisión en';
    }
    if(this.idPantalla === 4){ //Aprobador
      this.sgteEstado1 = 3;
      this.sgteIcono1 = 'check_circle';
      this.sgteAccion1 = 'aprobar';
      this.sgteEstado2 = 1;
      this.sgteIcono2 = 'cancel';
      this.sgteAccion2 = 'rechazar';
    }
  }

  cargarFiltros(){
    let filtro = this.usuarioService.sessionFiltro();

    let strEstados = "";
    if(filtro!=null){   
      this.request.Codigo! = filtro[0];
      strEstados! = filtro![1];
      this.request.Tipo! = filtro[2];
      this.request.FechaIni! = new Date(filtro[3]);
      this.request.FechaFin! = new Date(filtro[4]);
      this.request.IdeUsuario = parseInt(filtro[5]);
    }else{
      this.request.Codigo! = "";      
      if(this.idPantalla === 1)
        strEstados! = "0,1,1,0,0,0,0";
      if(this.idPantalla === 2)
        strEstados! = "0,0,0,1,0,0,1";
      if(this.idPantalla === 3)
        strEstados! = "0,0,0,1,0,0,0";
      if(this.idPantalla === 4)
        strEstados! = "0,0,1,0,0,0,0";      
      this.request.Tipo! = "";
      this.request.FechaIni! = new Date();
      this.request.FechaIni.setMonth(this.request.FechaIni!.getMonth() - 6);
      this.request.FechaFin! = new Date();

      //Solo me setea por defecto cuando veo mis propias rendiciones
      if(this.idPantalla === 1)
        this.request.IdeUsuario! = this.usuarioService.sessionUsuario().ideUsuario;
      else
        this.request.IdeUsuario! = 0;
    }

    this.request.IdePantalla! = this.idPantalla;

    //debugger;
    localStorage.setItem(environment.CODIGO_FILTRO, (this.request.Codigo===undefined?'': this.request.Codigo) +"|"+strEstados+"|"+this.request.Tipo+"|"+this.request.FechaIni+"|"+this.request.FechaFin+"|"+this.request.IdeUsuario?.toString());
  }

  actualizar(){
    //debugger;
    //this.cargarFiltros();
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.cargarFiltros();

    this.rendicionService = new RendicionService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
         
          this.loading = true;
          this.request.LstEstados = [];

          let filtro = this.usuarioService.sessionFiltro();
          let strEstados = filtro![1].split(',');

          strEstados.forEach(e => {
            this.request.LstEstados?.push(parseInt(e))
          });

          //console.log(filtro);
          return this.rendicionService!.listar(
            filtro![0],
            this.idPantalla,
            parseInt(filtro![5]),
            this.request.LstEstados!,
            new Date(filtro![3]),
            new Date(filtro![4]),
            filtro![2],
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

          this.loading = false;
          this.existRegistro = res === null;

          this.selection = new SelectionModel<RendicionM>(true, []);

          if (res === null) {
            return [];
          }
          //debugger;
          this.countRegistro = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.dataSource = data));      
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.reporteAdmin.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  listarestados(){
    this.listaEstados = [];

    for(var i in jsonEstado) {
      let el: Combobox = {};

      el.valor = jsonEstado[i].nIdEstado;
      el.descripcion = jsonEstado[i].vDescripcion;
      el.visual = jsonEstado[i].visual;
      el.aux1 = jsonEstado[i].class;
      
      this.listaEstados.push(el);
    }
    //debugger;
  }

  getClassEstado(idEstado: number){
    var clase: string = '';
    var objEstado = jsonEstado.find((e: any) => e.nIdEstado === idEstado);
    if(objEstado !== undefined){
      clase = objEstado.class;
    }
    return clase;
  }

  abrirBusqueda(){
    const dialogRef =this.dialog.open(FrendicionComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data: {
        titulos: this.tituloPantalla,
        idPantalla: this.idPantalla,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){

        this.paginator.pageIndex = 0,
        this.paginator.pageSize = 5
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

  mostrarBalance(codMoneda: string, balance: number){
    var descMoneda: string = this.getDescripcion(codMoneda, this.tbMoneda);
    var cadena: string = "";

    if(balance < 0)
      cadena = "- ";
    cadena = cadena + descMoneda + " " + Math.abs(balance).toFixed(2);

    return cadena;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filter(e => this.puedeAccionEstado(e.ideEstado!)).length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.forEach(row => {if(this.puedeAccionEstado(row.ideEstado!))this.selection.select(row)});
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

  cambiaEstadoSeleccion(idEstado: number, accion: string, rechaza: boolean = false){
    const nroMarcados = this.selection.selected.length;
    var fraseRegistros: string = "el registro seleccionado";
    if(nroMarcados > 0){
      if(nroMarcados > 1)
        fraseRegistros = "los " + nroMarcados + " registros seleccionados";
      this.confirmService.openConfirmDialog(false, "¿Desea " + accion + " " + fraseRegistros + "?").afterClosed().subscribe(res =>{
        //Ok
        if(res){
          //console.log('Sí');
          if(rechaza){
            if(this.idPantalla === 3){
              this.observacion(this.selection.selected, idEstado, 'R');
            }
            if(this.idPantalla === 4){
              this.observacion(this.selection.selected, idEstado, 'A');
            }
          }
          else{
            this.cambiaEstadoLista(this.selection.selected, idEstado);
          }
        }
        else{
          //console.log('No');
        }
      });
    }    
  }

  cambiaEstadoLista(lista: RendicionM[], sgteEstado: number, obs?: string){
    var i: number = 0;
    lista.forEach(item => {
      this.cambiaEstado(item.ideRendicion!, sgteEstado, obs===undefined?'':obs,i===lista.length-1);
      i++;
    });    
  }

  cambiaEstado(ideRendicion: number, sgteEstado: number, obs?: string, ultimo: boolean = false){
    this.spinner.showLoading();
    //debugger;
    this.rendicionService.cambiarEstado(ideRendicion, sgteEstado, obs === undefined?'':obs).subscribe(data=>{
      if(data.typeResponse==environment.EXITO){
        this.spinner.hideLoading();
        if(ultimo)
          this.actualizar();
      }else{
        this.spinner.hideLoading();
      }
    });  
  }

  observacion(lista: RendicionM[], sgteEstado: number, rol: string = ''){
    const dialogRef = this.dialog.open(CrechazoComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data: {
        rol: rol
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && result !== ''){
        this.cambiaEstadoLista(lista, sgteEstado, result);
      }
    });
  }

  puedeEditar(usu: number, est: number){
    //debugger;
    return est <= 1 && usu == this.usuarioService.sessionUsuario().ideUsuario;
  }
}
