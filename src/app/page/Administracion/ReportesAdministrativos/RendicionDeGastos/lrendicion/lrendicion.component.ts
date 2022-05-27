import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-lrendicion',
  templateUrl: './lrendicion.component.html',
  styleUrls: ['./lrendicion.component.css']
})
export class LrendicionComponent implements OnInit {

  dataSource: RendicionM[] = [];
  displayedColumns: string[] = ['codigo', 'lugar', 'motivo', 'ingresos', 'tipo','estado','correo','accion','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  idPantalla: number = 1;

  request = new RendicionRequest();

  permiso: Permiso = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private rendicionService : RendicionService,
    private usuarioService : UsuarioService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();
  
    let filtro = this.usuarioService.sessionFiltro();
    let strEstados = "";

    if(filtro!=null){   
      this.request.Codigo! = filtro[0];
      strEstados! = filtro![1];
      this.request.Tipo! = filtro[2];
      this.request.FechaIni! = new Date(filtro[3]);
      this.request.FechaFin! = new Date(filtro[4]);
    }else{
      this.request.Codigo! = "";
      strEstados! = "0,1,1,1,0,0,0";
      this.request.Tipo! = "";
      this.request.FechaIni! = new Date();
      this.request.FechaIni.setMonth(this.request.FechaIni!.getMonth() - 6);
      this.request.FechaFin! = new Date();
    }

    localStorage.setItem(environment.CODIGO_FILTRO, ( this.request.Codigo===undefined?'': this.request.Codigo) +"|"+ strEstados+"|"+this.request.Tipo+"|"+this.request.FechaIni+"|"+this.request.FechaFin);
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
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

          console.log(filtro);
          return this.rendicionService!.listar(
            filtro![0],
            this.idPantalla,
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
    this.configPermisoService.obtenerpermiso(forms.rendicionGasto.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
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

  routeUrl(id: string){
    var editar = true;

    //PERMISO
    var editar = true;
    if(this.permiso.guardar)
      editar = true;
    else if(this.permiso.ver)
      editar = false;
    else
      return; 

    this.router.navigate(['/page/administracion/rendicion/edit/'+id+"/"+editar]);
  }
}
