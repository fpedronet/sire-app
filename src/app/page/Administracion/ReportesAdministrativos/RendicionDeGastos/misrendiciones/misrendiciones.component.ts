import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Permiso } from 'src/app/_model/permiso';
import { RendicionM, RendicionRequest } from 'src/app/_model/rendiciones/rendicionM';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import { environment } from 'src/environments/environment';
import { FrendicionComponent } from '../frendicion/frendicion.component';

@Component({
  selector: 'app-misrendiciones',
  templateUrl: './misrendiciones.component.html',
  styleUrls: ['./misrendiciones.component.css']
})
export class MisrendicionesComponent implements OnInit {

  dataSource: RendicionM[] = [];
  displayedColumns: string[] = ['codigo', 'lugar', 'motivo', 'ingresos', 'estado','correo', 'tipo', 'accion'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  idPantalla: number = 1;

  request = new RendicionRequest();

  permiso: Permiso = {};

  interval: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private notifierService : NotifierService,
    private rendicionService : RendicionService,
    private usuarioService : UsuarioService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();

    this.obtieneFiltros();

    //localStorage.setItem(environment.CODIGO_FILTRO, this.predonante.Nombres +"|"+ this.predonante.Idecampania+"|"+this.predonante.IdeOrigen+"|"+this.predonante.IdeEstado+"|"+this.predonante.FechaDesde+"|"+this.predonante.FechaHasta);

    // this.startTimer();*/
  }

  obtieneFiltros(){
    let filtro = this.usuarioService.sessionFiltro();

    if(filtro!=null){   
      this.request.Codigo! = filtro[0];
      var strEstados = filtro![1].split(',');
      this.request.LstEstados = [];
      strEstados.forEach(e => {
        this.request.LstEstados?.push(parseInt(e))
      });
      this.request.Tipo! = filtro[2];
      this.request.FechaIni! = new Date(filtro[3]);
      this.request.FechaFin! = new Date(filtro[4]);
    }else{
      this.request.Codigo! = "";
      this.request.LstEstados! = [0, 1, 1, 1, 0, 0, 0];
      this.request.Tipo! = "";
      this.request.FechaIni! = new Date();
      this.request.FechaIni.setMonth(this.request.FechaIni!.getMonth() - 6);
      this.request.FechaFin! = new Date();
    }
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.rendicionService = new RendicionService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.obtieneFiltros();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          
          return this.rendicionService!.listar(
            this.request.Codigo!,
            this.idPantalla,
            this.request.LstEstados!,
            this.request.FechaIni!,
            this.request.FechaFin!,
            this.request.Tipo,
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
    /*Pendiente*/
  }

  abrirBusqueda(){
    const dialogRef =this.dialog.open(FrendicionComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){

        this.paginator.pageIndex = 0,
        this.paginator.pageSize = 5
        this.ngAfterViewInit();
        }
    })
  }

  
  routeUrl(id: string, tipo:string){
    var editar = true;

    //PERMISO
    var editar = true;
    if(this.permiso.guardar)
      editar = true;
    else if(this.permiso.ver)
      editar = false;
    else
      return; 
  }
}
