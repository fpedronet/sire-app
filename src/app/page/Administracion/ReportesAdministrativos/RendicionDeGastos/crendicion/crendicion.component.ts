import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Permiso } from 'src/app/_model/permiso';
import { RendicionD } from 'src/app/_model/rendiciones/rendicionD';
import { RendicionM } from 'src/app/_model/rendiciones/rendicionM';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import forms from 'src/assets/json/formulario.json';
import jsonEstado from 'src/assets/json/rendicion/renestado.json';
import jsonTipo from 'src/assets/json/rendicion/rentipo.json';
import { environment } from 'src/environments/environment';
import { CdetalleComponent } from '../cdetalle/cdetalle.component';
import jsonConcepto from 'src/assets/json/detalle/concepto.json';
import jsonMoneda from 'src/assets/json/detalle/moneda.json';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { CrechazoComponent } from '../crechazo/crechazo.component';
import { ReporteService } from 'src/app/_service/reporte/reporte.service';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-crendicion',
  templateUrl: './crendicion.component.html',
  styleUrls: ['./crendicion.component.css']
})

export class CrendicionComponent implements OnInit {

  @ViewChild(MatStepper)
  stepper!: MatStepper;

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  listaEstados?: Combobox[] = [];
  listaTipos?: Combobox[] = [];
  
  estado: string = "";
  documento: string = "";

  existenObs: boolean = false;

  txtEditarR: string = "";
  txtEditarM: string = "";
  sgteEstadoR: number = 0;
  sgteEstadoM: number = 0;
  sgteIconR: string = "";
  sgteIconM: string = "";
  delete: boolean = false;
  rejectRevi: boolean = false;
  apruebarechaza: boolean = false;
  claseEstado: string = "";

  tablasMaestras = ['USUARIO'];
  tbUsuario: Combobox[] = [];
  nombresUsuario?: string = '';

  CodEstado: string = "0";
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  currentTab: number = 0;

  rendicionCargada?: RendicionM;
  existRendicion: boolean = false;
  existDetalle: boolean = false;

  tbConcepto: Combobox[] = [];
  tbMoneda: Combobox[] = [];
  curMoneda: string = '';

  curUsuario: number = 0;
  curCodigo: string = '';
  
  vIngresos?: string = '0.00';
  vGastos?: string = '0.00';
  vBalance?: string = '0.00';

  idPantalla?: number = 1;
  pantallaPrev?: string = '';

  dataSource: RendicionD[] = [];
  initDisplayedColumns: string[] = ['concepto', 'vFecha', 'documento', 'vMonto', 'proveedor', 'descripcion', 'comodato', 'adjunto', 'accion', 'mo'];
  displayedColumns: string[] = [];

  maxDate: Date = new Date();
  url_m: string = '';
  iconSharePoint: string =environment.UrlImage + "sharePoint.png";

  isLinear = false;
  
  nombreAprobador: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private confirmService : ConfimService,
    private usuarioService: UsuarioService,
    private comboboxService: ComboboxService,
    private configPermisoService : ConfigPermisoService,
    private rendicionService: RendicionService,
    private reporteService: ReporteService
  ) {
  }


  ngOnInit(): void {
    localStorage.setItem(environment.CODIGO_DETALLE, "");
    
    this.obtenerpermiso();
    
    this.listarestados();
    this.listartipos();    

    this.tbConcepto = this.completarCombo(jsonConcepto);
    this.tbMoneda = this.completarCombo(jsonMoneda);
    
    this.inicializar();
    
    this.existRendicion = this.id !== 0

    this.route.params.subscribe((data: Params)=>{
      this.idPantalla = (data["idPantalla"]==undefined)?1:parseInt(data["idPantalla"]);
      this.id = (data["id"]==undefined)?0:parseInt(data["id"]);
      this.listarUsuario().then(res => {
        this.obtener(true);
      });      
    });
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  async listarUsuario(){
    return new Promise(async (resolve) => {
    
      this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
        if(data === undefined){
          this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
        }
        else{
          var tbCombobox: Combobox[] = data.items;
          
          this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUARIO');
        }

        resolve('ok')
      });
    })
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.etiqueta?.toString()?.trim() === cod);
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

  listarestados(){
      this.listaEstados = [];

      for(var i in jsonEstado) {
        let el: Combobox = {};
  
        el.valor = jsonEstado[i].nIdEstado;
        el.descripcion = jsonEstado[i].vDescripcion;
        el.visual = jsonEstado[i].visual;
        
        this.listaEstados.push(el);
      }
  }

  listartipos(){
    this.listaTipos = [];

    for(var i in jsonTipo) {
      let el: Combobox = {};

      el.valor = jsonTipo[i].nIdTipo;
      el.descripcion = jsonTipo[i].vDescripcion;
      el.visual = jsonTipo[i].visual;
      
      this.listaTipos.push(el);
    }
    //debugger;
  }

  inicializar(){
    this.form = new FormGroup({
      'ideRendicion': new FormControl({ value: 0, disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'lugar': new FormControl({ value: '', disabled: false}),
      'motivo': new FormControl({ value: '', disabled: false}),
      'ideUsuario': new FormControl({ value: 0, disabled: false}),
      'monedaRecibe': new FormControl({ value: '', disabled: true}),
      'ingresos': new FormControl({ value: '0.00', disabled: false}),
      'gastos': new FormControl({ value: '0.00', disabled: true}),
      'fechaPresenta': new FormControl({ value: new Date(), disabled: true}),
      'fechaApruebaRechaza': new FormControl({ value: '', disabled: false}),
      'fechaProcesa': new FormControl({ value: new Date(), disabled: true}),
      'ideUsuProcesa': new FormControl({ value: 0, disabled: true}),
      'ideEstado': new FormControl({ value: -1, disabled: false}),
      'estado': new FormControl({ value: 'NUEVO', disabled: false}),
      'fechaCreacion': new FormControl({ value: new Date(), disabled: true}),
      'docuGenerado': new FormControl({ value: 0, disabled: true}),
      'fechaAceptado': new FormControl({ value: new Date(), disabled: true}),
      'ideUsuApruebaRechaza': new FormControl({ value: 0, disabled: false}),
      'obsAprobador': new FormControl({ value: '', disabled: false}),
      'obsRevisor': new FormControl({ value: '', disabled: false}),
      'tipo': new FormControl({ value: 'M', disabled: false}),
      'fechaRevisado': new FormControl({ value: '', disabled: false}),
      'ideUsuRevisa': new FormControl({ value: 0, disabled: false})
    });
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  getDescTipo(value: string){
    return this.listaTipos?.find(e => e.valor === value)?.descripcion?.toUpperCase();
  }

  obtener(primeraObs: boolean = false){
    if(this.idPantalla === 2)
      this.pantallaPrev = 'SEGUIMIENTO -';
    if(this.idPantalla === 3)
      this.pantallaPrev = 'REVISIÓN -';
    if(this.idPantalla === 4)
      this.pantallaPrev = 'APROBACIÓN -';

    this.nombreAprobador = '';

    if(this.id > 0){
      this.spinner.showLoading();
      this.rendicionService.obtener(this.id).subscribe(data=>{
        if(data!== undefined && data.ideRendicion !== 0){
          //debugger;
          this.rendicionCargada = data;
          this.existRendicion = true;
          this.form.patchValue({
            ideRendicion: data.ideRendicion,
            codigo: data.codigo,
            lugar: data.lugar,
            motivo: data.motivo,
            ideUsuario: data.ideUsuario,
            ingresos: data.ingresos?.toFixed(2),
            gastos: data.gastos?.toFixed(2),
            ideEstado: data.ideEstado,
            estado: this.listaEstados?.find(e => e.valor === data.ideEstado)?.descripcion,
            fechaCreacion: data.fechaCreacion,
            tipo: data.tipo,
            //Aprobador
            fechaApruebaRechaza: data.vFechaApruebaRechaza,
            ideUsuApruebaRechaza: data.ideUsuApruebaRechaza,
            obsAprobador: data.obsAprobador,
            //Revisor
            fechaRevisado: data.vFechaRevisado,
            ideUsuRevisa: data.ideUsuRevisa,
            obsRevisor: data.obsRevisor
          });

          if(data.tipo === 'M')
            this.displayedColumns = this.initDisplayedColumns.filter(e => e !== 'adjunto');
          else
            this.displayedColumns = this.initDisplayedColumns;

          if(data.ideEstado === 2 && data.ideUsuApruebaRechaza !== undefined && data.ideUsuApruebaRechaza !== 0)
            this.nombreAprobador = this.buscaUsuario(data.ideUsuApruebaRechaza);

          this.url_m = data.url_M!;
          //Muestra creador de rendición
          this.curUsuario = data.ideUsuario!;
          this.nombresUsuario = this.buscaUsuario(this.curUsuario);
          //Código de rendición actual
          this.curCodigo = data.codigo!;

          this.vIngresos = data.ingresos?.toFixed(2);
          this.vGastos = data.gastos?.toFixed(2);
          this.vBalance = (data.ingresos!-data.gastos!).toFixed(2);
          //debugger;
          this.muestraEstado(data.ideEstado);

          //Muestra observaciones
          this.existenObs = data.ideEstado === 1 && ((data.obsAprobador !== undefined && data.obsAprobador !== '') || (data.obsRevisor !== undefined && data.obsRevisor !== ''));
          if(this.existenObs && primeraObs)
            this.observacion();

          this.documento= data.codigo!;
          this.dataSource = data.listaDetalle!;
          //debugger;
          if(this.dataSource.length > 0){
            this.existDetalle = true;
            this.curMoneda = this.dataSource[0].codMoneda!;
          }
          else{
            //debugger;
            this.existRendicion = true;
            setTimeout(this.changestepper, 250, undefined, 1);
          }
          
        }
        this.spinner.hideLoading();
      });
    }
  }

  buscaUsuario(idUsuario: number){
    //debugger;
    var nombre: string = '';
    var usuObj = this.tbUsuario.find(e => e.valor === idUsuario.toString());
    if(usuObj !== undefined)
      nombre = usuObj.descripcion === undefined?'':usuObj.descripcion;
    return nombre;
  }

  muestraEstado(idEstado?: number){
    this.estado = this.listaEstados?.find(e => e.valor === idEstado)?.descripcion!;

    var objEstado = jsonEstado.find((e: any) => e.nIdEstado === idEstado);
    if(objEstado !== undefined){
      this.edit = objEstado.edicion && (this.curUsuario == this.usuarioService.sessionUsuario().ideUsuario);
      this.delete = objEstado.eliminar && this.edit;
      this.rejectRevi = objEstado.rechazar;
      this.apruebarechaza = objEstado.nIdEstado === 2 && this.soyAprobador(this.usuarioService.sessionUsuario().ideUsuario)
      
      //debugger;
      this.txtEditarR = objEstado.txtCambiarEstado.txt1;
      this.sgteEstadoR = objEstado.sgteEstado.num1;
      this.sgteIconR = objEstado.sgteIcono.icon1;

      this.txtEditarM = objEstado.txtCambiarEstado.txt2;      
      this.sgteEstadoM = objEstado.sgteEstado.num2;
      this.sgteIconM = objEstado.sgteIcono.icon2;

      this.claseEstado = objEstado.class;
    }    
  }

  soyAprobador(idUsuarioLog: number){
    //debugger;
    var idAprobador: number = this.getControlLabel('ideUsuApruebaRechaza');
    return idAprobador == idUsuarioLog;
  }

  cambiaEstado(sgteEstado: number, obs?: string){
    if(sgteEstado === 0){
      this.confirmService.openConfirmDialog(false, "¿Desea eliminar esta rendición? (Esta acción es irreversible)").afterClosed().subscribe(res =>{
        //Ok
        if(res){
          //console.log('Sí');
          this.$cambiaEstado(sgteEstado, obs);
        }
        else{
          //console.log('No');
        }
      });
    }
    else{
      if(this.rendicionCargada !== undefined){
        if(this.camposCambiados(this.rendicionCargada)){
          this.confirmService.openConfirmDialog(true, "Tiene cambios sin guardar");
        }
        else
          this.$cambiaEstado(sgteEstado, obs);
      }      
    }      
  }

  camposCambiados(rend: RendicionM){
    var lugar: boolean = rend.lugar !== this.getControlLabel('lugar');
    var motivo: boolean = rend.motivo !== this.getControlLabel('motivo');
    var tipo: boolean = rend.tipo !== this.getControlLabel('tipo');
    var ingresos: boolean = rend.ingresos !== Number(this.getControlLabel('ingresos'));
    //debugger;
    return lugar || motivo || tipo || ingresos;
  }

  $cambiaEstado(sgteEstado: number, obs?: string){
    this.spinner.showLoading();
    //debugger;
    this.rendicionService.cambiarEstado(this.id, sgteEstado, obs === undefined?'':obs).subscribe(data=>{

      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){
        this.muestraEstado(sgteEstado);
        this.spinner.hideLoading();

        if(sgteEstado === 0 || (this.curUsuario > 0 && this.curUsuario != this.usuarioService.sessionUsuario().ideUsuario))
          this.router.navigate(['/page/administracion/rendicion',this.idPantalla]);
        else
          this.obtener();

        /*if(sgteEstado === 0 || sgteEstado > 2)
          this.router.navigate(['/page/administracion/rendicion',this.idPantalla]);
        else
          this.obtener();*/
        
      }else{
        this.spinner.hideLoading();
      }

      
    });  
  }

  eliminarDetalle(model: RendicionD){
    this.confirmService.openConfirmDialog(false, "¿Desea eliminar esta detalle?").afterClosed().subscribe(res =>{
      //Ok
      if(res){
        //console.log('Sí');
        this.spinner.showLoading();

        model.swt = 0;

        this.rendicionService.guardarDet(model).subscribe(data=>{
          //debugger;
          this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

          if(data.typeResponse==environment.EXITO){      
            this.spinner.hideLoading();
          }else{
            this.spinner.hideLoading();
          }
          
          this.obtener();
        });
      }
      else{
        //console.log('No');
      }
    });
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.reporteAdmin.codigo).subscribe(data=>{
      this.permiso = data;
      //debugger;

      //this.permiso.revisar = false;
      //this.permiso.procesar = false;

      this.spinner.hideLoading();
    }); 
  }

  tienepermiso(sgte: number){
    if(sgte === 1){ //Recuperar
      return this.curUsuario == this.usuarioService.sessionUsuario().ideUsuario;
    }

    if(sgte === 5){ //Procesar
      //debugger;
      return this.permiso.procesar;
    }      
    
    if(sgte === 6) //Revisar
      return this.permiso.revisar;

    return true;
  }

  changestepper(stepper: any, numTab: number = -1){
    //debugger;
    if(numTab === -1)
      this.currentTab = stepper._selectedIndex;
    else
      this.currentTab = numTab;
  }

  guardar(){
      let model = new RendicionM();
     
      model.ideUsuario = this.form.value['ideUsuario'];
      model.ideRendicion = this.form.value['ideRendicion'];
      model.lugar = this.form.value['lugar'];
      model.motivo = this.form.value['motivo'];
      model.montoRecibe = this.form.value['ingresos'];
      model.tipo = this.form.value['tipo'];

      this.spinner.showLoading();
      //debugger;
      this.rendicionService.guardar(model).subscribe(data=>{
  
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
          if(data.typeResponse==environment.EXITO){

            if(this.id === 0){ // Cambia de pestaña y actualiza id en el primer registro
              this.existRendicion = true;
              this.currentTab = 1; //Segunda pestaña
              this.id = data.ide!;
              //debugger;
              this.router.navigate(['/page/administracion/rendicion/'+this.idPantalla+'/edit/',this.id]);
            }
            this.obtener();
            
            this.spinner.hideLoading();
          }else{
            this.spinner.hideLoading();
          }
        });
    }

  limpiar(){
    this.inicializar();
  }

  abrirDetalle(rendDet?: RendicionD){
    //debugger;
    var enRevision = this.tienepermiso(this.sgteEstadoR) && this.sgteEstadoR === 6;

    const dialogRef = this.dialog.open(CdetalleComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        detalle: rendDet,
        idPadre: this.id,
        edit: this.edit,
        enRevision: enRevision, //Editable cuando está en revisión
        tipoPadre: this.getControlLabel('tipo'),
        codigo: this.curCodigo
      }
    });

    //dialogRef.beforeClosed().subscribe(res)

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.obtener();
      }
    })
  }


  restarCampos(num1: string, num2: string){
    let valor = parseFloat(num1 === '' ? '0' : num1) - parseFloat(num2 === '' ? '0' : num2);
    return valor.toFixed(2);
  }

  getDescripcion(value: string, lista: Combobox[]){
    return lista?.find(e => e.valor === value)?.descripcion?.toUpperCase();
  }

  observacion(rol: string = ''){
    const dialogRef = this.dialog.open(CrechazoComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data: {
        rol: rol,

        nomRevisor: this.buscaUsuario(this.getControlLabel('ideUsuRevisa')),
        fecRevisor: this.getControlLabel('fechaRevisado'),
        obsRevisor: this.getControlLabel('obsRevisor'),

        nomAprobador: this.buscaUsuario(this.getControlLabel('ideUsuApruebaRechaza')),
        fecAprobador: this.getControlLabel('fechaApruebaRechaza'),
        obsAprobador: this.getControlLabel('obsAprobador')
      }
    });

    if(rol !== ''){
      dialogRef.afterClosed().subscribe(result => {
        if(result !== undefined && result !== ''){
          //Cambia a estado EN CURSO
          this.cambiaEstado(1, result);
        }
      });  
    }    
  }

  mostrarPDF(iderendicion: number){
    if(iderendicion == 0){
      this.notifierService.showNotification(2,'Mensaje',"No se encontro la rendición");
    }
    else{
    this.spinner.showLoading();
    this.reporteService
      .rptResumen(iderendicion)
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

  selectTipo(valor: string, elemento: any){
    //debugger;
    if(valor === 'M'){ //Si es movilidad no hay ingresos
      this.displayedColumns = this.initDisplayedColumns.filter(e => e !== 'adjunto');
      this.form.patchValue({
        ingresos: '0.00'
      })
    }
    else{
      //debugger;
      this.displayedColumns = this.initDisplayedColumns;
      setTimeout(function() {        
        elemento.focus();
        elemento.select();    
      }, 250);      
    }
  }
}
