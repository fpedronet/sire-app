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

@Component({
  selector: 'app-lrendicion',
  templateUrl: './lrendicion.component.html',
  styleUrls: ['./lrendicion.component.css']
})
export class LrendicionComponent implements OnInit {

  dataSource: RendicionM[] = [];
  displayedColumns: string[] = ['codigo', 'tipo', 'lugar', 'motivo', 'balance','estado','correo','accion','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  idPantalla: number = 0;
  tituloPantalla: string[] = ['','','',''];

  request = new RendicionRequest();

  permiso: Permiso = {};

  listaEstados: Combobox[] = [];
  tbMoneda: Combobox[] = [];

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
}
