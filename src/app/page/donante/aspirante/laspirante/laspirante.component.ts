import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';

import { PredonanteService } from 'src/app/_service/donante/predonante.service';
import { SpinnerService } from '../../../component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { Permiso } from 'src/app/_model/permiso';
import { MatDialog } from '@angular/material/dialog';

import { MfaspiranteComponent } from '../mfaspirante/mfaspirante.component';
import { Predonante, PredonanteRequest } from 'src/app/_model/donante/predonante';
import forms from 'src/assets/json/formulario.json';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { RptfichaComponent } from 'src/app/page/reporte/rptficha/rptficha.component';
import { ReporteService } from 'src/app/_service/reporte/reporte.service';


@Component({
  selector: 'app-laspirante',
  templateUrl: './laspirante.component.html',
  styleUrls: ['./laspirante.component.css']
})
export class LaspiranteComponent implements OnInit {

  @ViewChild(RptfichaComponent) rptficha!: RptfichaComponent;

  dataSource: Predonante[] = [];
  displayedColumns: string[] = ['codigo', 'nombres', 'estado','pd','ch','en','do','mo', 'ficha'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  predonante = new PredonanteRequest();

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
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
    private reporteService: ReporteService
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
      this.predonante.IdeEstado! = 1;
      this.predonante.FechaDesde! = new Date();
      this.predonante.FechaHasta! = new Date();
    }    

    localStorage.setItem(environment.CODIGO_FILTRO, this.predonante.Nombres +"|"+ this.predonante.Idecampania+"|"+this.predonante.IdeOrigen+"|"+this.predonante.IdeEstado+"|"+this.predonante.FechaDesde+"|"+this.predonante.FechaHasta);

    // this.startTimer();
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
          // this.loading = true;
          let filtro = this.usuarioService.sessionFiltro();
          let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
          
          return this.predonanteService!.listar(
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
    const dialogRef =this.dialog.open(MfaspiranteComponent, {
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

      
    //URL
    if(tipo=="pd"){
      this.router.navigate(['/page/donante/aspirante/edit/'+id+"/"+editar]);
    }else if(tipo=="ch"){
      this.router.navigate(['/page/donante/chequeo/edit/'+id+"/"+editar]);
    }else if(tipo=="en"){
      this.router.navigate(['/page/donante/entrevista/edit/'+id+"/"+editar]);
    }else if(tipo=="do"){
      this.router.navigate(['/page/donante/donacion/edit/'+id+"/"+editar]);
    }   
  }

  imprimirFicha(idepredonante: number){
    if(idepredonante == 0){
      this.notifierService.showNotification(2,'Mensaje',"No se encontro la donación");
    }
    else{
      this.spinner.showLoading();
      this.reporteService.rptficha(idepredonante).subscribe(data=>{
        //console.log(data);

        //this.rptficha.setFicha(data);

        setTimeout(function(){
          const printContents = document.getElementById('imprimir-seccion')!.innerHTML;
          //  const popupWin = window.open('', '_blank', 'top=0,left=0,height=1000,width=1000')!;
          const popupWin = window.open('top=0,left=0,height=1000,width=1000')!;
           popupWin.document.open();
           popupWin.document.write(`
                <html>
                    <head>
                        <title>Pestaña de impresión</title>
                        <style type="text/css" media="print">
                          @page 
                          {
                              size: auto;
                              margin: 2mm 0mm;
                          }                    
                          body 
                          {
                              background-color:#FFFFFF; 
                              border: solid 0px white ;
                              margin: 0px 18px;
                          }
                          td {
                            vertical-align: middle;
                            padding-top: 1px;
                            padding-bottom: 1px;
                            padding-left: 3px;
                            padding-right: 3px;
                            height: 22px;
                            /*Para ver como se divide la tabla*/
                            border-style: outset;
                            border-width: 0px;
                            border-color: blue;
                        }
                        
                        .rpt-table-b{
                            border-width: 1px;
                            border-color: black;
                            border-style: solid;
                        }
                        
                        .rpt-img{
                            width: 128px;
                            aspect-ratio: auto 128 / 96;
                            height: 96px;
                        }
                        
                        .rpt-input-h1{
                            border-style: solid;
                            border-width: thin;
                            height: 20px;
                        }
                        
                        .rpt-input-h2{
                            border-style: solid;
                            border-width: thin;
                            height: 31px;
                        }
                        
                        .rpt-input-h3{
                            border-style: solid;
                            border-width: thin;
                            height: 70px;
                        }
                        
                        .rpt-input-h4{
                            border-style: solid;
                            border-width: thin;
                            height: 120px;
                        }
                        
                        .rpt-input-b{
                            border-style: solid;
                            border-width: 2px;
                            height: 20px;
                        }
                        
                        .rpt-input-b-2{
                            border-style: solid;
                            border-width: 2px;
                            height: 32px;
                        }
                        
                        .rpt-label{
                            border-style: none;
                            /*height: 21px;*/
                            line-height: 1;
                        }
                        
                        .rpt-input-firma{
                            border-style: solid;
                            border-width: 2px;
                            height: 62px;
                        }
                        
                        .rpt-input-h1 .rpt-font-8{
                            margin-left: 5px;
                        }
                        
                        .rpt-input-h1 .rpt-font-9{
                            margin-left: 5px;
                        }
                        
                        .rpt-input-h3 .rpt-font-7{
                            margin-left: 0px;
                            vertical-align: sub;
                        }
                        
                        .rpt-input-h3 .rpt-font-8{
                            margin-left: 0px;
                            vertical-align: sub;
                        }
                        
                        .rpt-input-h2 .rpt-font-9-b{
                            margin-left: 5px;
                            vertical-align: sub;
                        }
                        
                        .rpt-input-h1 .rpt-font-10{
                            margin-left: 5px;
                        }
                        
                        .rpt-input-h4 .rpt-font-9{
                            font-size: 9pt;
                            color: #808080;
                        }
                        
                        .rpt-input-firma .rpt-font-9{
                            font-size: 9pt;
                            color: #808080;
                        }
                        
                        .rpt-shadow{
                            border-style: none;
                            height: 25px;
                            background-color: #c0c0c0;
                            line-height: 1;
                        }
                        
                        .rpt-label-r{
                            border-style: none;
                            height: 21px;
                            /*line-height: 0.9;*/
                            text-align: right;
                        }
                        
                        .rpt-td-w1{ /*Para X*/
                            width: 36px;
                            text-align: center;
                        }
                        
                        .rpt-td-w2{
                            width: 53px;
                        }
                        
                        .rpt-td-w3{
                            width: 60px;
                        }
                        
                        .rpt-td-w4{
                            width: 85px;
                        }
                        
                        .rpt-td-w5{
                            width: 112px;
                        }
                        
                        .rpt-td-w6{
                            width: 167px;
                        }
                        
                        .rpt-td-w7{
                            width: 248px;
                        }
                        
                        .rpt-td-w8{
                            width: 254px;
                        }
                        
                        .rpt-td-w9{
                            width: 290px;
                        }
                        
                        .rpt-td-w50{
                            width: 445px;
                        }
                        
                        .rpt-td-preg-1{
                            height: 10px;
                            max-height: 10px;
                        }
                        
                        .rpt-tr-preg-1 td .rpt-label{
                            height: 12px;
                            max-height: 12px;
                        }
                        
                        .rpt-tr-preg-1 td{
                            height: 12px;
                            max-height: 12px;
                            border-bottom-width: thin;
                            border-bottom-color: #000000;
                        }
                        
                        .rpt-tr-preg-2 td .rpt-label{
                            height: 24px;
                            max-height: 24px;
                        }
                        
                        .rpt-tr-preg-2 td{
                            height: 24px;
                            max-height: 24px;
                            border-bottom-width: thin;
                            border-bottom-color: #000000;
                        }
                        
                        .rpt-tr-preg-3 td .rpt-label{
                            height: 36px;
                            max-height: 36px;
                        }
                        
                        .rpt-tr-preg-3 td{
                            height: 36px;
                            max-height: 36px;
                            border-bottom-width: thin;
                            border-bottom-color: #000000;
                        }
                        
                        .rpt-td-preg-1 .rpt-label{
                            height: 10px;
                            max-height: 10px;
                        }
                        
                        .rpt-font-7{
                            font-size: 7pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: normal;
                        }
                        
                        .rpt-font-7-b{
                            font-size: 7pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: bold;
                        }
                        
                        .rpt-font-8{
                            font-size: 8pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: normal;
                        }
                        
                        .rpt-font-9{
                            font-size: 9pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: normal;
                        }
                        
                        .rpt-font-9-u{
                            font-size: 9pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: normal;
                            text-decoration: underline;
                        }
                        
                        .rpt-font-10{
                            font-size: 10pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: normal;
                        }
                        
                        .rpt-font-8-b{
                            font-size: 8pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: bold;
                        }
                        
                        .rpt-font-9-b{
                            font-size: 9pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: bold;
                        }
                        
                        .rpt-font-10-b{
                            font-size: 10pt;
                            color: #000000;
                            font-family: Arial;
                            font-weight: bold;
                        }
                        
                        .rpt-divider{
                            border-color: black;
                            height: 0px;
                            margin-block-start: 0.0em;
                            margin-block-end: 0.0em;
                            width: 760px;
                            display: table-caption;
                        }
                       </style>
                    </head>
                    <body onload="window.print();window.close();">
                        ${printContents}
                    </body>
                </html>
                `
            );
          popupWin.document.close();
          popupWin.focus();

          popupWin.print();
          popupWin.close();
        },200);
        this.spinner.hideLoading();
      });
    }
  }

  imprimir(idepredonante: number){
    if(idepredonante == 0){
      this.notifierService.showNotification(2,'Mensaje',"No se encontro la donación");
    }
    else{
    this.spinner.showLoading();
    this.reporteService
      .rptficha(idepredonante)
      .subscribe(
        data => {
          this.spinner.hideLoading();
          let byteChar = atob(data);
          let byteArray = new Array(byteChar.length);
          for(let i = 0; i < byteChar.length; i++){
            byteArray[i] = byteChar.charCodeAt(i);
          }
          let uIntArray = new Uint8Array(byteArray);
          let blob = new Blob([uIntArray], {type : 'application/pdf'});
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, `${"ficha"}.pdf`);
        }
      );
    }
  }
}
