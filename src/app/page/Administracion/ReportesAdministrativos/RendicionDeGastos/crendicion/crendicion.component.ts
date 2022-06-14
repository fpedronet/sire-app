import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-crendicion',
  templateUrl: './crendicion.component.html',
  styleUrls: ['./crendicion.component.css']
})
export class CrendicionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  listaEstados?: Combobox[] = [];
  listaTipos?: Combobox[] = [];
  
  estado: string = "";
  documento: string ="";

  txtEditarR: string = "";
  txtEditarM: string = "";
  sgteEstadoR: number = 0;
  sgteEstadoM: number = 0;
  sgteIconR: string = "";
  sgteIconM: string = "";
  delete: boolean = false;
  reject: boolean = false;
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

  adjunto: string = '';
  nombreAdjunto: string = '';

  tbConcepto: Combobox[] = [];
  tbMoneda: Combobox[] = [];
  curMoneda: string = '';
  
  vIngresos?: string = '0.00';
  vGastos?: string = '0.00';
  vBalance?: string = '0.00';

  dataSource: RendicionD[] = [];
  displayedColumns: string[] = ['concepto', 'vFecha', 'documento', 'vMonto', 'proveedor', 'descripcion', 'comodato', 'accion', 'mo'];

  maxDate: Date = new Date();

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
    private rendicionService: RendicionService
  ) {
  }

  ngOnInit(): void {
    localStorage.setItem(environment.CODIGO_DETALLE, "");
    
    this.obtenerpermiso();
    
    this.listarestados();
    this.listartipos();
    this.listarUsuario();

    this.tbConcepto = this.completarCombo(jsonConcepto);
    this.tbMoneda = this.completarCombo(jsonMoneda);
    
    this.inicializar();

    this.obtenerpermiso();
    
    this.existRendicion = this.id !== 0

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.obtener();
    });
  }

  listarUsuario(){
    
    this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;
        
        this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUARIO');
        //debugger;
        this.nombresUsuario = this.tbUsuario.find(e => e.valor === this.usuarioService.sessionUsuario().ideUsuario)?.descripcion;
      }
    });
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
      'ingresos': new FormControl({ value: '', disabled: false}),
      'gastos': new FormControl({ value: '0.00', disabled: false}),
      'fechaPresenta': new FormControl({ value: new Date(), disabled: true}),
      'fechaApruebaRechaza': new FormControl({ value: new Date(), disabled: true}),
      'fechaProcesa': new FormControl({ value: new Date(), disabled: true}),
      'ideUsuProcesa': new FormControl({ value: 0, disabled: true}),
      'ideEstado': new FormControl({ value: -1, disabled: false}),
      'estado': new FormControl({ value: 'NUEVO', disabled: false}),
      'fechaCreacion': new FormControl({ value: new Date(), disabled: false}),
      'docuGenerado': new FormControl({ value: 0, disabled: true}),
      'fechaAceptado': new FormControl({ value: new Date(), disabled: true}),
      'ideUsuApruebaRechaza': new FormControl({ value: 0, disabled: true}),
      'obsAprobador': new FormControl({ value: '', disabled: true}),
      'obsRevisor': new FormControl({ value: '', disabled: true}),
      'tipo': new FormControl({ value: 'M', disabled: false}),
      'fechaRevisado': new FormControl({ value: new Date(), disabled: true}),
      'ideUsuRevisa': new FormControl({ value: 0, disabled: true}),
      'nombreAdjunto': new FormControl({ value: '', disabled: true})
    });
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  getDescTipo(value: string){
    return this.listaTipos?.find(e => e.valor === value)?.descripcion?.toUpperCase();
  }

  obtener(){
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
            tipo: data.tipo
          });

          this.vIngresos = data.ingresos?.toFixed(2);
          this.vGastos = data.gastos?.toFixed(2);
          this.vBalance = (data.ingresos!-data.gastos!).toFixed(2);
          //debugger;
          this.muestraEstado(data.ideEstado);
          
          this.documento= data.codigo!;
          this.dataSource = data.listaDetalle!;
          //debugger;
          if(this.dataSource.length > 0){
            this.existDetalle = true;
            this.curMoneda = this.dataSource[0].codMoneda!;
          }
          
        }
        this.spinner.hideLoading();
      });
    }
  }

  muestraEstado(idEstado?: number){
    this.estado = this.listaEstados?.find(e => e.valor === idEstado)?.descripcion!;

    var objEstado = jsonEstado.find((e: any) => e.nIdEstado === idEstado);
    if(objEstado !== undefined){
      this.edit = objEstado.edicion;
      this.delete = objEstado.eliminar;
      this.reject = objEstado.rechazar;

      this.txtEditarR = objEstado.txtCambiarEstado.txt1;
      this.sgteEstadoR = objEstado.sgteEstado.num1;
      this.sgteIconR = objEstado.sgteIcono.icon1;

      this.txtEditarM = objEstado.txtCambiarEstado.txt2;      
      this.sgteEstadoM = objEstado.sgteEstado.num2;
      this.sgteIconM = objEstado.sgteIcono.icon2;

      this.claseEstado = objEstado.class;
    }    
  }

  cambiaEstado(sgteEstado: number){
    if(sgteEstado === 0){
      this.confirmService.openConfirmDialog(false, "¿Desea eliminar esta rendición? (Esta acción es irreversible)").afterClosed().subscribe(res =>{
        //Ok
        if(res){
          //console.log('Sí');
          this.$cambiaEstado(sgteEstado);
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
          this.$cambiaEstado(sgteEstado);
      }      
    }      
  }

  camposCambiados(rend: RendicionM){
    var lugar: boolean = rend.lugar !== this.getControlLabel('lugar');
    var motivo: boolean = rend.motivo !== this.getControlLabel('motivo');
    var tipo: boolean = rend.tipo !== this.getControlLabel('tipo');
    var ingresos: boolean = rend.ingresos?.toFixed(2) !== this.getControlLabel('ingresos');
    return lugar || motivo || tipo || ingresos;
  }

  $cambiaEstado(sgteEstado: number){
    this.spinner.showLoading();
    //debugger;
    this.rendicionService.cambiarEstado(this.id, sgteEstado, "").subscribe(data=>{

      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){
        this.muestraEstado(sgteEstado);
        this.spinner.hideLoading();
        
      }else{
        this.spinner.hideLoading();
      }

      if(sgteEstado === 0)
        this.router.navigate(['/page/administracion/rendicion'])
      else
        this.obtener();
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
    this.configPermisoService.obtenerpermiso(forms.rendicionGasto.codigo).subscribe(data=>{
      this.permiso = data;

      //this.permiso.revisar = false;
      //this.permiso.procesar = false;

      this.spinner.hideLoading();
    }); 
  }

  tienepermiso(sgte: number){

    if(sgte === 5)
      return this.permiso.procesar;
    
    if(sgte === 6)
      return this.permiso.revisar;

    return true;
  }

  changestepper(stepper: any){
    this.currentTab = stepper._selectedIndex;
  }

  guardar(){
      let model = new RendicionM();
     
      model.ideUsuario = this.form.value['ideUsuario'];
      model.ideRendicion = this.form.value['ideRendicion'];
      model.lugar = this.form.value['lugar'];
      model.motivo = this.form.value['motivo'];
      model.montoRecibe = this.form.value['ingresos'];
      model.tipo = this.form.value['tipo'];
      model.adjunto =this.adjunto;
      model.nombreAdjunto =this.nombreAdjunto;

      this.spinner.showLoading();
      //debugger;
      this.rendicionService.guardar(model).subscribe(data=>{
  
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
          if(data.typeResponse==environment.EXITO){

            if(this.id === 0){ // Cambia de pestaña y actualiza id en el primer registro
              this.existRendicion = true;
              this.currentTab = 1; //Segunda pestaña
              this.id = data.ide!;
              this.router.navigate(['/page/administracion/rendicion/edit/',this.id]);
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
    const dialogRef = this.dialog.open(CdetalleComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data: {
        detalle: rendDet,
        idPadre: this.id,
        edit: this.edit
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.obtener();
      }
    })
  }

  subirArchivo(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgBase64Path = e.target.result;
        this.adjunto = imgBase64Path;
        this.nombreAdjunto = fileInput.target.files[0].name;
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  restarCampos(num1: string, num2: string){
    let valor = parseFloat(num1 === '' ? '0' : num1) - parseFloat(num2 === '' ? '0' : num2);
    return valor.toFixed(2);
  }

  getDescripcion(value: string, lista: Combobox[]){
    return lista?.find(e => e.valor === value)?.descripcion?.toUpperCase();
  }

  rechazar(){
    const dialogRef = this.dialog.open(CrechazoComponent, {
      width: '250px',
      data: {obsRevisor: this.getControlLabel('obsRevisor'), obsAprobador: this.getControlLabel('obsAprobador')},
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      this.form.patchValue({
        obsRevisor: result.obsRevisor,
        obsAprobador: result.obsAprobador
      });
    });

  }
}
