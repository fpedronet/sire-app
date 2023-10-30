import { Component, OnInit, ViewChild } from '@angular/core';
import { Combobox } from 'src/app/_model/combobox';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { TrackingService } from 'src/app/_service/tracking.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { tracking, trackingRequest } from 'src/app/_model/tracking';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, switchMap, of as observableOf, catchError, map, Observable } from 'rxjs';

@Component({
  selector: 'app-ltracking',
  templateUrl: './ltracking.component.html',
  styleUrls: ['./ltracking.component.css']
})
export class LtrackingComponent implements OnInit {
  @ViewChild('COMODATO') comboCmd: any;
  @ViewChild('RQ') comboRQ: any;
  @ViewChild('USUARIO') comboUsuario: any;


  constructor(
    private spinner : SpinnerService,
    private comboboxService: ComboboxService,
    private trackingService: TrackingService,
    private notifierService : NotifierService,
    private http: HttpClient,
    public customPaginator: MatPaginatorIntl,
  )
  {    }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

//TABLA DE TRACKING
displayedColumns: string[] = ['Usuario_Solicita','Fecha_Solicita','numero_RQ', 'aprobador1RQ', 'estadoAprobacion1RQ', 'fechaAprobacion1RQ', 'aprobador2RQ', 'estadoAprobacion2RQ', 'fechaAprobacion2RQ', 'comodato', 'estadoOCS', 'Usuario_OC', 'Fecha_OC', 'numero_OCS', 'aprobador1OCS', 'estadoAprobacion1OCS', 'fechaAprobacion1OCS', 'aprobador2OCS', 'estadoAprobacion2OCS', 'fechaAprobacion2OCS', 'estadoOrdenOCS'];
//IMPORTACION DE SERVICES
request = new trackingRequest();
detTracking: tracking = new tracking();
dataSource: tracking[] = [];

//USUARIOS
tbUsuario: Combobox[] = [];
filterUsuario: Combobox[] = [];
filterUsuarios: Observable<Combobox[]> | undefined;
idUsuario: string = '';
controlUsuarios = new FormControl();
ideUsuario: number = 0;
usuarioColor: string = 'warn';
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
changeUsuario(event: any){
  //debugger;
  var usu = event.option.value;
  if(usu !== undefined){
    this.setCurUsuario(usu, true);
    console.log(usu);
    var ideEmpresa = localStorage.getItem(environment.CODIGO_EMPRESA)?.toString();
    this.obtenerTracking("",usu.valor,ideEmpresa);
  }
}
initFilterUsuarios(){
  this.filterUsuarios = this.controlUsuarios.valueChanges.pipe(
    startWith(''),
    map(value => (typeof value === 'string'?value:value.descripcion)),
    map(name  => (name?this.buscarUsuarios(name):[]))
  )
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

//REQUERIMIENTOS
tbRQ: Combobox[] = [];
filterRQ: Combobox[] = [];
listarComboRQ(){
   this.spinner.showLoading();
   this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
     if(data === undefined){
       this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
     }
     else{
       var tbRequerimiento: Combobox[] = data.items;

       this.tbRQ = this.obtenerSubtabla(tbRequerimiento,'RQ');
       this.filterRQ = this.tbRQ;
       this.obtener(this.detTracking);
     }
   });
}
selectRQ(valor: string){
   var RQ = this.tbRQ.find(e => e.valor === valor);
   var lineaFind = RQ?.descripcion
   var ideEmpresa = localStorage.getItem(environment.CODIGO_EMPRESA)?.toString();
   this.obtenerTracking(lineaFind,"",ideEmpresa)
}

//OCC
tbOCS: Combobox[] = [];
filterOCS: Combobox[] = [];
listarComboOCS(){
   this.spinner.showLoading();
   this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
     if(data === undefined){
       this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
     }
     else{
       var tbOCS: Combobox[] = data.items;
       this.tbOCS = this.obtenerSubtabla(tbOCS,'OCS');
       this.filterOCS = this.tbOCS;
       this.obtener(this.detTracking);
     }
   });
}
selectOCS(valor: string){
   var OCS = this.tbOCS.find(e => e.valor === valor);
   var lineaFind = OCS?.descripcion
   var ideEmpresa = localStorage.getItem(environment.CODIGO_EMPRESA)?.toString();
   this.obtenerTracking(lineaFind,"",ideEmpresa)
}

//COMODATO
tbComodato: Combobox[] = [];
filterComodato: Combobox[] = [];
selectcomodato(valor: string){
  var comodato = this.tbComodato.find(e => e.valor === valor);
  var lineaFind = comodato?.valor;
  var ideEmpresa = localStorage.getItem(environment.CODIGO_EMPRESA)?.toString();
  this.obtenerTracking(lineaFind,"",ideEmpresa)
}
filtrarComodatos(idSede: string, rucsede?: string){
  var filterSegunId = this.tbComodato.filter(
    e => (e.aux2 === idSede ||
    e.valor === 'CMD')
  );

  var filterSegunRuc = this.tbComodato.filter(
    e => rucsede === undefined ? false : e.aux3 === rucsede ||
    e.valor === 'CMD'
  );

  if(filterSegunId.length > 1){
    //Encontro resultados por Id
    this.filterComodato = filterSegunId
  }
  else if(filterSegunRuc.length > 1){
    //No encontró por Id, pero sí por sede
    this.filterComodato = filterSegunRuc
  }
  else{
    //Solo coincidió Ninguno
    this.filterComodato = this.tbComodato;
  }
}

//SEDE
tbSede: Combobox[] = [];
filterSedes: Observable<Combobox[]> | undefined;
sedeColor: string = 'warn';
controlSedes = new FormControl();
ideSede: number = 0;
setCurSede(sede?: Combobox, notControl: boolean = false, reiniciaCmd: boolean = false){
   if(sede === undefined){
     if(!notControl)
       this.controlSedes.setValue(new Combobox());
     this.ideSede = 0;
     this.sedeColor = 'warn';

     this.filterComodato = this.tbComodato;
     if(reiniciaCmd){
       this.form.patchValue({
         comodato: 'CMD'
       });
     }
   }
   else{
     if(!notControl)
       this.controlSedes.setValue(sede);
     this.ideSede = sede.valor! === ''? 0 : parseInt(sede.valor!);
     this.sedeColor = 'primary';

     this.filtrarComodatos(sede.valor!, sede.aux1) //Ruc
   }
}
changeSede(event: any){
     var sede = event.option.value;
     if(sede !== undefined){
       this.setCurSede(sede, true)
     }
}
initFilterSedes(reiniciaCmd: boolean = false){
     this.filterSedes = this.controlSedes.valueChanges.pipe(
       startWith(''),
       map(value => (typeof value === 'string'?value:value.descripcion)),
       map(name  => (name?this.buscarSedes(name):[]))
     );
     if(reiniciaCmd){

     }
}
buscarSedes(name: string): Combobox[]{
   this.setCurSede(undefined, true);
   var results: Combobox[] = [];
   if(name.length >= this.carBuscaAuto){
     var filtro = name.toLowerCase();
     results = this.tbSede.filter(e => e.descripcion?.toLowerCase().includes(filtro));
   }
   return results.slice(0,this.nroMuestraAuto===0?results.length:this.nroMuestraAuto);
}

// //LINEA
// tbLinea: Combobox[] = [];
// controlLineas = new FormControl();
// codLinea: string = '';
// lineaColor: string = 'warn';
// filterLineas: Observable<Combobox[]> | undefined;
// setCurLinea(linea?: Combobox, notControl: boolean = false, reiniciaCmd: boolean = false){
//     if(linea === undefined){
//       if(!notControl)
//         this.controlLineas.setValue(new Combobox());
//       this.codLinea = '';
//       this.lineaColor = 'warn';

//       if(reiniciaCmd){
//         this.form.patchValue({
//           comodato: 'CMD'
//         });
//         this.setCurSede(undefined, true);
//       }
//     }
//     else{
//       if(!notControl)
//         this.controlLineas.setValue(linea);
//       this.codLinea = linea.valor!;
//       this.lineaColor = 'primary';
//     }

// }
// changeLinea(event: any){
//     var linea = event.option.value;
//     if(linea !== undefined){
//       this.setCurLinea(linea, true)
//     }
// }
// initFilterLineas(reiniciaCmd: boolean = false){
//     this.filterLineas = this.controlLineas.valueChanges.pipe(
//       startWith(''),
//       map(value2 => (typeof value2 === 'string'?value2:value2.descripcion)),
//       map(name2  => (name2?this.buscarLineas(name2):[]))
//     );
//     if(reiniciaCmd)
//       this.initFilterSedes();
// }
// buscarLineas(name: string): Combobox[]{
//     this.setCurLinea(undefined, true);
//     var results: Combobox[] = [];
//     if(name.length >= this.carBuscaAuto){
//       var filtro = name.toLowerCase();
//       results = this.tbLinea.filter(e => e.descripcion?.toLowerCase().includes(filtro));
//     }
//     return results.slice(0,this.nroMuestraAuto===0?results.length:this.nroMuestraAuto);
// }








listarComboFiltro(){
  this.spinner.showLoading();
      var tbFiltroA: Combobox[] = [{valor:"1",descripcion:"COMODATO",etiqueta:"1"},{valor:"2",descripcion:"SOLICITANTE",etiqueta:"2"},{valor:"3",descripcion:"REQUERIMIENTO",etiqueta:"3"},{valor:"4",descripcion:"ORDEN",etiqueta:"4"}];

      this.tbFiltro = tbFiltroA;
      this.filterFiltro = this.tbFiltro;
      this.obtener(this.detTracking);
};
 tbFiltro: Combobox[] = [];
 //CREACION DE FILTROS
 filterFiltro: Combobox[] = [];

//CARGA DE COLUMNAS DE TABLA
 tablasMaestras = ['COMODATO', 'SEDE', 'LINEA', 'MAXMONTO', 'RQ', 'USUARIO', 'OCS'];

//ESTADO PARA MOSTRAR LOS FILTROS
 swtCMD = false;
 swtRQ = false;
 swtOCS = false;
 swtSolicitante = false;

 idPantalla?: number;

 form: FormGroup = new FormGroup({});

 edit?: boolean = true;

 carBuscaAuto: number = 3;
 nroMuestraAuto: number = 0;


  loading = true;
  existTracking = false;
  countTracking = 0;
  selection = new SelectionModel<tracking>(true, []);






  ngOnInit(): void {
    this.listarCombo();
    this.inicializar();
    this.listarComboRQ();
    this.listarComboOCS();
    this.listarComboFiltro();
    this.obtenerTracking();
  }

  inicializar(){
     var trackD = new tracking();

     this.form = new FormGroup({
       'RQ': new FormControl({ value: trackD.Numero_RQ, disabled: false}),
     });
  }


//CAMBIAR FILTROS
  cambiarEstado(valor?: number){
    if (valor == 1){
      this.swtCMD = true;
      this.swtRQ = false;
      this.swtSolicitante = false;
      this.swtOCS = false;
    }
    else if(valor == 2){
      this.swtSolicitante = true;
      this.swtCMD = false;
      this.swtRQ = false;
      this.swtOCS = false;
    }
    else if(valor == 3){
      this.swtRQ = true;
      this.swtCMD = false;
      this.swtOCS = false;
      this.swtSolicitante = false;
    }
    else{
      this.swtOCS = true;
      this.swtRQ = false;
      this.swtCMD = false;
      this.swtSolicitante = false;
    }
  }

//BUSCAR SEGUN FILTRO


  listarCombo(){
    this.spinner.showLoading();

    this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;


        this.tbComodato = this.obtenerSubtabla(tbCombobox,'COMODATO');
        this.filterComodato = this.tbComodato;

        this.tbSede = this.obtenerSubtabla(tbCombobox,'SEDE');
        this.initFilterSedes();

        // this.tbLinea = this.obtenerSubtabla(tbCombobox,'LINEA');
        // this.initFilterLineas();

        this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUARIO');
        this.initFilterUsuarios();

        this.obtener(this.detTracking);
      }
    });
  }







  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.etiqueta?.toString()?.trim() === cod);
  }









  obtener(detTracking: tracking){

    //Si es un registro nuevo, carga caché en campos
    this.form.patchValue({
      comodato: detTracking.Comodato
    });
    this.spinner.hideLoading();
  }

  mostrarAutoCombo(c: Combobox): string{
    var result = '';
    if(c !== undefined && c !== null && c.descripcion !== '')
      result = c.descripcion!;
    return result;
  }











obtenerTracking(filtro?:string,ideUsuario?:string,empresa?:string){
  this.trackingService = new TrackingService(this.http);
  this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));


    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.loading = true;
        return this.trackingService!.GetTrackingOrdenes(filtro,ideUsuario,empresa
        ).pipe(catchError(() => observableOf(null)));
      }),
      map(res => {

        //debugger;
        this.loading = false;
        this.existTracking = res === null;

        this.selection = new SelectionModel<tracking>(true, []);

        if (res === null) {
          return [];
        }
        this.countTracking = 0;

        //debugger;
        console.log(res.items);
        return res.items;
      }),
    ).subscribe(data => (this.dataSource = data));
}





  completarCombo(json: any){
    var tbCombo = [];

    for(var i in json) {
      let el: Combobox = {};

      el.valor = json[i].valor;
      el.descripcion = json[i].descripcion;
      el.aux1 = json[i].aux1;
      el.visual = json[i].visual;

      tbCombo.push(el);
    }

    return tbCombo;
  }
}
