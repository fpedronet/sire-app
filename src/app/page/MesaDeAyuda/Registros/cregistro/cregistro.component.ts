import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Permiso } from 'src/app/_model/permiso';
import { map, Observable, startWith } from 'rxjs';
import { Registro } from 'src/app/_model/registros/registro';
import forms from 'src/assets/json/formulario.json';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RegistroService } from 'src/app/_service/registro.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-cregistro',
  templateUrl: './cregistro.component.html',
  styleUrls: ['./cregistro.component.css']
})
export class CregistroComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};
  
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

  btnAsignar: boolean = false;
  btnGuardar: boolean = false;
  btnActualiz: boolean = false;
  btnResuelto: boolean = false;
  btnEliminar: boolean = false;

  tablasMaestras = ['USUARIO', 'ESTTICKET', 'CATETICKET', 'TIPOTICKET', 'SUBTTICKET', 'USUSOPORTE', 'PRIOTICKET', 'SEDE'];
  tbUsuario: Combobox[] = [];
  tbTipo?: Combobox[] = [];
  tbSubTipo?: Combobox[] = [];
  filterCategoria?: Combobox[] = [];
  tbCategoria?: Combobox[] = [];
  tbEstado?: Combobox[] = [];
  tbResponsable?: Combobox[] = [];
  tbPrioridad?: Combobox[] = [];

  tbSede: Combobox[] = [];  
  sedeColor: string = 'warn';
  filterSedes: Observable<Combobox[]> | undefined;
  controlSedes = new FormControl();
  ideSede: number = 0;

  carBuscaAuto: number = 3;
  nroMuestraAuto: number = 0;

  ideEstado: number = 0;
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  currentTab: number = 0;

  registroCargada?: Registro;
  existRegistro: boolean = false;
  existDetalle: boolean = false;

  tbConcepto: Combobox[] = [];
  tbMoneda: Combobox[] = [];
  curMoneda: string = '';

  curUsuario: number = 0;
  curCodigo: string = '';
  
  muestraIngresos: boolean = false;
  vIngresos?: string = '0.00';
  vGastos?: string = '0.00';
  vBalance?: string = '0.00';

  idPantalla?: number = 1;
  pantallaPrev?: string = '';

  detallesRend: Registro[] = [];
  initDisplayedColumns: string[] = ['concepto', 'vFecha', 'documento', 'vMonto', 'proveedor', 'descripcion', 'comodato', 'adjunto', 'accion', 'mo'];
  displayedColumns: string[] = [];

  maxDate: Date = new Date();
  
  idResponsable: number = 0;
  prioridad: string = '';
  
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
    private registroService: RegistroService
  ) {
  }

  ngOnInit(): void {
    localStorage.setItem(environment.CODIGO_DETALLE, "");
    
    this.obtenerpermiso();
    
    this.inicializar();
    
    this.existRegistro = this.id !== 0

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)?0:parseInt(data["id"]);
      this.listarUsuario().then(res => {
        this.obtener();
      });      
    });
  }

  async listarUsuario(){
    return new Promise(async (resolve) => {
    
      this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
        if(data === undefined){
          this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
        }
        else{
          var tbCombobox: Combobox[] = data.items;

          this.tbSede = this.obtenerSubtabla(tbCombobox,'SEDE');
          this.initFilterSedes();

          //Elimina opción todos
          this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUARIO').filter(e => e.valor != '0');
          this.tbCategoria = this.obtenerSubtabla(tbCombobox,'CATETICKET').filter(e => e.valor != '0');
          this.tbResponsable = this.obtenerSubtabla(tbCombobox,'USUSOPORTE').filter(e => e.valor != '0');

          this.tbEstado = this.obtenerSubtabla(tbCombobox,'ESTTICKET');          
          this.tbTipo = this.obtenerSubtabla(tbCombobox,'TIPOTICKET');
          this.tbSubTipo = this.obtenerSubtabla(tbCombobox,'SUBTTICKET');
          this.tbPrioridad = this.obtenerSubtabla(tbCombobox,'PRIOTICKET');          
        }

        resolve('ok')
      });
    })
  }

  initFilterSedes(reiniciaCmd: boolean = false){
    this.filterSedes = this.controlSedes.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string'?value:value.descripcion)),
      map(name  => (name?this.buscarSedes(name):[]))
    );
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

  changeSede(event: any){
    var sede = event.option.value;
    if(sede !== undefined){
      this.setCurSede(sede, true)
    }
  }

  mostrarAutoCombo(c: Combobox): string{
    var result = '';
    if(c !== undefined && c !== null && c.descripcion !== '')
      result = c.descripcion!;
    return result;
  }

  setCurSede(sede?: Combobox, notControl: boolean = false){
    if(sede === undefined){
      if(!notControl)
        this.controlSedes.setValue(new Combobox());
      this.ideSede = 0;
      this.sedeColor = 'warn';
    }
    else{
      if(!notControl)
        this.controlSedes.setValue(sede);
      this.ideSede = sede.valor! === ''? 0 : parseInt(sede.valor!);
      this.sedeColor = 'primary';
    }
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

  inicializar(){
    this.form = new FormGroup({
      'ideRegistro': new FormControl({ value: 0, disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'fecSol': new FormControl({ value: new Date(), disabled: true}),
      //'ideSede': new FormControl({ value: 0, disabled: false}),
      //'ruc': new FormControl({ value: '', disabled: false}),
      //'cliente': new FormControl({ value: '', disabled: false}),
      'area': new FormControl({ value: '', disabled: false}),
      //'contactoExterno': new FormControl({ value: '', disabled: false}),
      'contactoInterno': new FormControl({ value: '', disabled: false}),
      'ideContacto': new FormControl({ value: 0, disabled: false}),
      'descripcion': new FormControl({ value: '', disabled: false}),
      //'descripcion2': new FormControl({ value: '', disabled: false}),
      'codCat': new FormControl({ value: '', disabled: false}),
      'categoria': new FormControl({ value: '', disabled: false}),
      'ideResponsable': new FormControl({ value: 0, disabled: false}),
      'responsable': new FormControl({ value: '', disabled: false}),
      'ideEstado': new FormControl({ value: '-1', disabled: false}),
      'estado': new FormControl({ value: '', disabled: false}),
      /*'fecAsignado': new FormControl({ value: new Date(), disabled: true}),
      'fecSolucion': new FormControl({ value: new Date(), disabled: true}),
      'fecFinalizado': new FormControl({ value: new Date(), disabled: true}),*/
      'observaciones': new FormControl({ value: '', disabled: false}),
      //'ideUsuReg': new FormControl({ value: 0, disabled: false}),
      'correoSolicita': new FormControl({ value: '', disabled: false}),
      'codTipo': new FormControl({ value: '', disabled: false}),
      'codSubTipo': new FormControl({ value: '', disabled: false}),
      //'impacto': new FormControl({ value: 0, disabled: false}),
      'urgencia': new FormControl({ value: 0, disabled: false}),
      'prioridad': new FormControl({ value: 0, disabled: false}),
      /*'ideCorreo': new FormControl({ value: 0, disabled: false}),
      'canal': new FormControl({ value: '', disabled: false})*/
    });
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  getDescTipo(value: string){
    return this.tbTipo?.find(e => e.valor === value)?.descripcion?.toUpperCase();
  }

  obtener(){
    if(this.id > 0){
      this.spinner.showLoading();
      this.registroService.obtener(this.id).subscribe(data=>{
        if(data!== undefined && data.ideRegistro !== 0){
          this.registroCargada = data;
          this.existRegistro = true;
          this.ideEstado = data.ideEstado!;
          this.form.patchValue({
            ideRegistro: data.ideRegistro,
            codigo: data.codigo,
            fecSol: data.vFecSol,
            //ideSede: data.ideSede,
            //ruc: data.ruc,
            //cliente: data.cliente,
            area: data.area,
            //contactoExterno: data.contactoExterno,
            contactoInterno: data.contactoInterno,
            ideContacto: data.ideContacto?.toString(),
            descripcion: data.descripcion,
            //descripcion2: data.descripcion2,
            //codCat: data.codCat,
            categoria: data.categoria,
            ideResponsable: data.ideResponsable?.toString(),
            responsable: data.responsable,
            ideEstado: data.ideEstado,
            estado: data.estado,
            /*fecAsignado: data.fecAsignado,
            fecSolucion: data.fecSolucion,
            fecFinalizado: data.fecFinalizado,*/
            observaciones: data.observaciones,
            //ideUsuReg: data.ideUsuReg,*/
            correoSolicita: data.correoSolicita,
            codTipo: data.codTipo,
            codSubTipo: data.codSubTipo,
            //impacto: data.impacto,
            urgencia: data.urgencia,
            prioridad: data.prioridad,
            /*ideCorreo: data.ideCorreo,
            canal: data.canal*/
          });

          this.muestraEstado(data.ideEstado!.toString());

          //Sede
          var sedeFind = this.tbSede.find(e => e.valor === data.ideSede?.toString());
          if(sedeFind !== undefined){
            var sede: Combobox = sedeFind;      
            this.setCurSede(sede);
          }

          //Muestra estado
          this.estado = data.estado!.toUpperCase();

          //Muestra código
          this.documento = data.codigo!.toString();

          //Muestra servicio
          this.selectCategoria(data.codSubTipo!);          

          //Responsable
          this.idResponsable = data.ideResponsable!;

          this.form.patchValue({
            codCat: data.codCat
          });

          //Calcula urgencia prioridad según servicio, después de obtenerlo
          this.calculaPrioridad(data.urgencia!.toString());
          
          //debugger;
          //this.muestraEstado(data.ideEstado);          
        }
        this.spinner.hideLoading();
      });
    }
    else{
      this.muestraEstado(this.form.value['ideEstado']);
    }
  }

  muestraEstado(idEstado: string){
    switch(idEstado){
      case '-1':
        this.btnAsignar = false;
        this.btnGuardar = true;
        this.btnActualiz = false;
        this.btnResuelto = false;
        this.btnEliminar = false;
        break;
      case '0':
        this.btnAsignar = false;
        this.btnGuardar = false;
        this.btnActualiz = false;
        this.btnResuelto = false;
        this.btnEliminar = false;
        break;
      case '1':
        this.btnAsignar = true;
        this.btnGuardar = false;
        this.btnActualiz = false;
        this.btnResuelto = false;
        this.btnEliminar = true;
        break;
      case '2':
        this.btnAsignar = false;
        this.btnGuardar = true;
        this.btnActualiz = true;
        this.btnResuelto = true;
        this.btnEliminar = true;
        break;
      case '3':
        this.btnAsignar = false;
        this.btnGuardar = true;
        this.btnActualiz = true;
        this.btnResuelto = true;
        this.btnEliminar = false;
        break;
      case '4':
        this.btnAsignar = false;
        this.btnGuardar = false;
        this.btnActualiz = true;
        this.btnResuelto = true;
        this.btnEliminar = false;
        break;
      case '5':
        this.btnAsignar = false;
        this.btnGuardar = false;
        this.btnActualiz = false;
        this.btnResuelto = true;
        this.btnEliminar = false;
        break;
      case '6':
        this.btnAsignar = false;
        this.btnGuardar = false;
        this.btnActualiz = false;
        this.btnResuelto = false;
        this.btnEliminar = false;
        break;
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

  camposCambiados(rend: Registro){
    /*var lugar: boolean = rend.lugar !== this.getControlLabel('lugar');
    var motivo: boolean = rend.motivo !== this.getControlLabel('motivo');
    var tipo: boolean = rend.tipo !== this.getControlLabel('tipo');
    var ingresos: boolean = rend.ingresos !== Number(this.getControlLabel('ingresos'));
    //debugger;*/
    //return lugar || motivo || tipo || ingresos;
    return true;
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.reporteAdmin.codigo).subscribe(data=>{
      this.permiso = data;
      //debugger;

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

  guardar(accion: number){
    var confirm: boolean = false;
    var mensaje: string = '';
    switch(accion){
      case 0:
        mensaje = "¿Confirma eliminar el ticket? Se reportará al usuario";
        confirm = true;
        break;
      case 5:
        mensaje = "¿Confirma cerrar el ticket?";
        confirm = true;
        break;
      default:
        confirm = false;
    }
    if(confirm){
      this.confirmService.openConfirmDialog(false, mensaje).afterClosed().subscribe(res =>{
        //Ok
        if(res){
          //console.log('Sí');
          this.$guardar(accion);
        }
        else{
          //console.log('No');
        }
      });
    }
    else{
      this.$guardar(accion);
    }    
  }

  $guardar(accion: number){
      let model = new Registro();
     
      //Nuevo registro
      model.ideRegistro = this.form.value['ideRegistro'];
      model.ideResponsable = this.form.value['ideResponsable'];
      model.fecSol = this.form.value['fecSol'];
      model.canal = '001';
      model.descripcion = this.form.value['descripcion'];

      //Registro existente
      model.ideSede = this.ideSede;
      //model.ideSede = this.form.value['ideSede'];
      model.area = this.form.value['area'];
      model.contactoExterno = this.form.value['contactoExterno'];
      model.ideContacto = this.form.value['ideContacto'];
      model.codCat = this.form.value['codCat'];
      model.observaciones = this.form.value['observaciones'];
      model.correoSolicita =  this.form.value['correoSolicita'];
      model.codTipo =  this.form.value['codTipo'];
      model.codSubTipo =  this.form.value['codSubTipo'];
      model.urgencia =  this.form.value['urgencia'];
      model.prioridad =  this.form.value['prioridad'];
      model.sgteEstado = accion;

      this.spinner.showLoading();
      //debugger;
      this.registroService.guardar(model).subscribe(data=>{
  
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
          if(data.typeResponse==environment.EXITO){

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

  getDescripcion(value?: string, lista?: Combobox[]){
    return lista?.find(e => e.valor === value)?.descripcion?.toUpperCase();
  }

  selectCategoria(valor: string){
    this.filterCategoria = this.tbCategoria?.filter(e => e.aux1 == valor);
  }

  selectServicio(valor: string){
    this.calculaPrioridad(valor);
  }

  validaUrgencia(valor: string, esAumenta: boolean){
    var cat = this.form.value['codCat'];
    if(cat === undefined || cat === null)
      return false;

    var urg: number = parseInt(valor);
    if(esAumenta && urg >= 5)
      return false;

    if(!esAumenta && urg <= 0)
      return false;

    return true;
  }

  changeUrgencia(valor: string, varia: number){
    var nuevoValor = parseInt(valor) + varia;
    this.form.patchValue({
      urgencia: nuevoValor
    });
    this.calculaPrioridad(nuevoValor.toString());
  }

  calculaPrioridad(valor: string){
    var cat = this.form.value['codCat'];
    this.filterCategoria;
    this.tbPrioridad;
    if(cat !== undefined && cat !== null){
      var impacto = this.filterCategoria!.find(e => e.valor === cat)?.aux2;
      if(impacto !== undefined){
        var calculo = parseInt(impacto) * parseInt(valor);
        if(calculo > 0){
          var prioridad = this.tbPrioridad!.find(e => parseInt(e.aux1!) <= calculo && parseInt(e.aux2!) >= calculo);
          if(prioridad !== undefined){
            this.form.patchValue({
              prioridad: prioridad.valor
            });
            this.prioridad = prioridad.descripcion!;
          }
        }        
        else
          this.prioridad = '';
      }
    }    
  }
}
