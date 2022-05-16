import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { PredonanteService } from 'src/app/_service/donante/predonante.service';
import { SpinnerService } from '../../../component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { Permiso } from 'src/app/_model/permiso';
import { MatDialog } from '@angular/material/dialog';

import { MfaspirantelingthComponent } from '../mfaspirantelingth/mfaspirantelingth.component';
import { Predonante, PredonanteRequest } from 'src/app/_model/donante/predonante';
import forms from 'src/assets/json/formulario.json';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-laspirantelight',
  templateUrl: './laspiranteligth.component.html',
  styleUrls: ['./laspiranteligth.component.css']
})
export class LaspiranteligthComponent implements OnInit {

  dataSource: Predonante[] = [];
  displayedColumns: string[] = ['codigo', 'nombres', 'codEstado'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  predonante = new PredonanteRequest();

  permiso: Permiso = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();

    let filtro = this.usuarioService.sessionFiltro();

    if(filtro!=null){   
      this.predonante.Nombres! = filtro[0];
      this.predonante.Idecampania! = parseInt(filtro[1]);
      this.predonante.IdeOrigen! = parseInt(filtro[2]);
      this.predonante.IdeEstado! = parseInt(filtro[3]);
      this.predonante.FechaDesde! = new Date(filtro[4]);
      this.predonante.FechaHasta! = new Date(filtro[5]);
    }else{

      this.predonante.Nombres! = "";
      this.predonante.Idecampania! = 0;
      this.predonante.IdeOrigen! = 0;
      this.predonante.IdeEstado! = 2;
      this.predonante.FechaDesde! = new Date();
      this.predonante.FechaHasta! = new Date();
    }    

    localStorage.setItem(environment.CODIGO_FILTRO, this.predonante.Nombres +"|"+ this.predonante.Idecampania+"|"+this.predonante.IdeOrigen+"|"+this.predonante.IdeEstado+"|"+this.predonante.FechaDesde+"|"+this.predonante.FechaHasta);

  }

  actualizar(){
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {

    this.predonanteService = new PredonanteService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let filtro = this.usuarioService.sessionFiltro();
          let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
          
          return this.predonanteService!.listarligth(
            codigobanco,
            parseInt(filtro![3]),
            parseInt(filtro![1]),
            parseInt(filtro![2]),
            filtro![0],
            new Date(filtro![4]),
            new Date(filtro![5]),
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
    this.configPermisoService.obtenerpermiso(forms.aspirantesligth.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  abrirBusqueda(){
    const dialogRef =this.dialog.open(MfaspirantelingthComponent, {
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

  abrirFormCrear(id: number){
    var editar = true;
    if(this.permiso.guardar)
      editar = true;
    else if(this.permiso.ver)
      editar = false;
    else
      return; //Si no tiene al menos un permiso no hace nada
    
    this.router.navigate(['/page/donante/aspirantelight/edit/', id, editar]);
  }
}
