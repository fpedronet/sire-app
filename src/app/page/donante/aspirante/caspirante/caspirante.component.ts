import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, startWith, map, Subject } from 'rxjs';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Distrito } from 'src/app/_model/distrito';
import { Permiso } from 'src/app/_model/permiso';
import { Persona } from 'src/app/_model/donante/persona';
import { PersonaHistorial } from 'src/app/_model/donante/personahistorial';
import { Predonante } from 'src/app/_model/donante/predonante';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { PoclabService } from 'src/app/_service/apiexterno/poclab.service';
import { PredonanteService } from 'src/app/_service/donante/predonante.service';
import forms from 'src/assets/json/formulario.json';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { environment } from 'src/environments/environment';
import { Foto } from 'src/app/_model/foto';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
  selector: 'app-caspirante',
  templateUrl: './caspirante.component.html',
  styleUrls: ['./caspirante.component.css']
})
export class CaspiranteComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private confirm : ConfimService,
    private comboboxService: ComboboxService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
    private poclabService: PoclabService,
  ) { }

  /*tabla de encuesta maestra */
  form: FormGroup = new FormGroup({});

  foto?: string =environment.UrlImage + "people.png";
  lector?: string =environment.UrlImage + "lector.png";

  permiso: Permiso = {};

  id: number = 0;
  edit: boolean = true;
  codigo: string = ''
  loading = true;

  curUser: number = 0;
  curBanco: number = 0;

  tablasMaestras = ['TDoc', 'PAIS', 'DEPA', 'PROV', 'DST', 'GENE', 'ECV', 'NCN',
  'PRDO', 'OCUPA', 'GINS', 'ORI', 'CAMP', 'TPRO', 'TEXR', 'TDON', 'EJE', 'VNCL', 'TREC'];
  tbTipoDocu: Combobox[] = [];
  tbPais: Combobox[] = [];
  tbGenero: Combobox[] = [];
  tbEstCivil: Combobox[] = [];
  tbGraIns: Combobox[] = [];
  tbNacion: Combobox[] = [];
  tbProced: Combobox[] = [];
  tbOcupa: Combobox[] = [];
  tbViajes: string[] = ['Sí', 'No']
  tbOrigen: Combobox[] = [];
  tbCampana: Combobox[] = [];
  tbTipoProced: Combobox[] = [];
  tbTipoExtrac: Combobox[] = [];
  filterTipoExtrac: Combobox[] = [];
  tbTipoDonac: Combobox[] = [];
  tbEje: Combobox[] = [];
  tbVinculo: Combobox[] = [];
  tbTipoRecep: Combobox[] = [];

  muestraPaciente: boolean = false;
  selectedTipoDonacion: string = '';
  idPaciente: number = 0;
  pacientePoclab: boolean = false;

  idPersona: number = 0;

  muestraDistrito: boolean = false;
  carBuscaDistrito: number = 2;
  nroDistritosMuestra: number = 15;
  distritos: Distrito[] = [];
  distritoColor: string = 'accent'
  filterDistritos: Observable<Distrito[]> | undefined;
  controlDistritos = new FormControl();
  codDistrito: string = '';

  selectedPais: string = '';

  fechaNac: Date | null = null;
  
  maxDate: Date = new Date();
  minDate: Date = new Date();

  textDono: string = 'SÍ DONÓ';
  textNoDono: string = 'NO DONÓ';

  btnEstadoSel: boolean[] = [false, false];
  estadoIni: number = 0;

  muestraSangre: boolean = false;
  abo: string = '';
  rh: string = '';
  colFondo: string = '';
  colLetra: string = '';

  fotoUrl: string = '';
  fotoError: string = '';

  //Webcam
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 200},
    height: {ideal: 222}
  };
  public mirrorOptions: string = 'never';
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage | null = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  

  //currentTab: number = 0;

  ngOnInit(): void {
    //Inicia cámara
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    
    //Extrae permisos
    this.obtenerpermiso();

    //Obtiene parámetros de URL
    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : ((data["edit"]=='true') ? true : false)      
    });

    //atributos de tokeN usuario
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
      this.curBanco = user.codigobanco;
    }     

    //Busca origen y campaña de caché
    var ideOri = localStorage.getItem('IdeOrigen');
    ideOri = ideOri?ideOri:this.curBanco.toString();
    var ideCam = localStorage.getItem('IdeCampania');
    ideCam = ideCam?ideCam:'1';

    //Inicializa componentes del form
    this.listarCombo();
    this.minDate.setMonth(this.maxDate.getMonth() - 12*120);  

    this.form = new FormGroup({
      'Codigo': new FormControl({ value: '#######', disabled: true}),
      'IdePersona': new FormControl({ value: 0, disabled: !this.edit}),
      'TipDocu': new FormControl({ value: '1', disabled: !this.edit}),
      'NumDocu': new FormControl({ value: '', disabled: !this.edit}),
      'ApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'ApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'Nombres': new FormControl({ value: '', disabled: !this.edit}),
      'FecNacimiento': new FormControl({ value: null, disabled: !this.edit}),
      'Edad': new FormControl({ value: '', disabled: !this.edit}),
      'EstadoCivil': new FormControl({ value: '', disabled: !this.edit}),
      'Sexo': new FormControl({ value: '', disabled: !this.edit}),
      'Nacionalidad': new FormControl({ value: '', disabled: !this.edit}),
      'LugarNacimiento': new FormControl({ value: '', disabled: !this.edit}),
      'Procedencia': new FormControl({ value: '', disabled: !this.edit}),
      'CodGradoInstruccion': new FormControl({ value: '', disabled: !this.edit}),
      'CodOcupacion': new FormControl({ value: 0, disabled: !this.edit}),
      'Direccion': new FormControl({ value: '', disabled: !this.edit}),
      'CodPais': new FormControl({ value: '', disabled: !this.edit}),
      'Celular': new FormControl({ value: '', disabled: !this.edit}),
      'Telefono': new FormControl({ value: '', disabled: !this.edit}),
      'Correo': new FormControl({ value: '', disabled: !this.edit}),
      'LugarTrabajo': new FormControl({ value: '', disabled: !this.edit}),
      'ViajeSN': new FormControl({ value: 'No', disabled: !this.edit}),
      'Lugar': new FormControl({ value: '', disabled: !this.edit}),
      'Permanencia': new FormControl({ value: '', disabled: !this.edit}),
      'FechaViaje': new FormControl({ value: null, disabled: !this.edit}),
      'Otros': new FormControl({ value: '', disabled: !this.edit}),
      'CodTipoProcedimiento': new FormControl({ value: '', disabled: !this.edit}),
      'CodTipoExtraccion': new FormControl({ value: '', disabled: !this.edit}),
      'CodTipoDonacion': new FormControl({ value: '', disabled: !this.edit}),
      'IdePaciente': new FormControl({ value: 0, disabled: !this.edit}),
      'PacTipDocu': new FormControl({ value: '1', disabled: !this.edit}),
      'PacNumDocu': new FormControl({ value: '', disabled: !this.edit}),
      'PacApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'PacApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'PacNombres': new FormControl({ value: '', disabled: !this.edit}),
      'PacFecNacimiento': new FormControl({ value: null, disabled: !this.edit}),
      'PacSexo': new FormControl({ value: '', disabled: !this.edit}),
      'CodEje': new FormControl({ value: '', disabled: !this.edit}),
      'CodParentesco': new FormControl({ value: '', disabled: !this.edit}),
      'TipRecep': new FormControl({ value: '', disabled: !this.edit}),
      'IdeOrigen': new FormControl({ value: ideOri, disabled: !this.edit}),
      'IdeCampania': new FormControl({ value: ideCam, disabled: !this.edit}),      
      'Fecha': new FormControl({ value: new Date(), disabled: !this.edit}),
      'CodEstado': new FormControl({ value: 0, disabled: !this.edit}),
    }); 
  }

  ngAfterViewInit(){
    //Ahora el obtener se llama después de listar distritos
    //this.obtener();
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.aspirantesligth.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  listarCombo(){
    this.comboboxService.cargarDatos(this.tablasMaestras,this.curUser,this.curBanco).subscribe(data=>{
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;

        this.tbTipoDocu = this.obtenerSubtabla(tbCombobox,'TDoc');
        this.tbGenero = this.obtenerSubtabla(tbCombobox,'GENE');
        this.tbEstCivil = this.obtenerSubtabla(tbCombobox,'ECV');
        this.tbNacion = this.obtenerSubtabla(tbCombobox,'NCN');
        this.tbProced = this.obtenerSubtabla(tbCombobox,'PRDO');
        this.tbOcupa = this.obtenerSubtabla(tbCombobox,'OCUPA');
        //debugger;
        this.tbGraIns = this.obtenerSubtabla(tbCombobox,'GINS');
        this.tbOrigen = this.obtenerSubtabla(tbCombobox,'ORI');
        this.tbCampana = this.obtenerSubtabla(tbCombobox,'CAMP');
        this.tbPais = this.obtenerSubtabla(tbCombobox,'PAIS');
        this.tbTipoProced = this.obtenerSubtabla(tbCombobox,'TPRO');
        this.tbTipoExtrac = this.obtenerSubtabla(tbCombobox,'TEXR');
        this.changeTipoProced(); //Llena por defecto todo para msotrar
        this.tbTipoDonac = this.obtenerSubtabla(tbCombobox,'TDON');
        this.tbEje = this.obtenerSubtabla(tbCombobox,'EJE');
        this.tbVinculo = this.obtenerSubtabla(tbCombobox,'VNCL');
        this.tbTipoRecep = this.obtenerSubtabla(tbCombobox,'TREC');
        var tbDpto: Combobox[] = this.obtenerSubtabla(tbCombobox,'DEPA');
        var tbProv: Combobox[] = this.obtenerSubtabla(tbCombobox,'PROV');
        var tbDist: Combobox[] = this.obtenerSubtabla(tbCombobox,'DST');

        //Valores por defecto de tipo proc. y extracción
        this.form.patchValue({
          CodTipoProcedimiento: this.tbTipoProced[0].codigo
        });
        this.changeTipoProced(this.tbTipoProced[0].codigo)

        //debugger;

        this.listarDistritos(tbDpto, tbProv, tbDist).then(res => {
          this.obtener();
        });
      }
    });
  }

  changeTipoProced(value: string = ''){
    if(value === ''){
      this.filterTipoExtrac = this.tbTipoExtrac;
    }
    else{
      this.filterTipoExtrac = this.tbTipoExtrac.filter(e => e.codAsocia === value);
      if(this.filterTipoExtrac.length > 0){
        this.form.patchValue({
          CodTipoExtraccion: this.filterTipoExtrac[0].codigo
        });
      }
    }
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.codTabla?.trim() === cod);
  }

  async listarDistritos(tbDpto: Combobox[], tbProv: Combobox[], tbDist: Combobox[]){
    return new Promise(async (resolve) => {
      tbDist.sort((a, b) => (a.descripcion === undefined || b.descripcion === undefined) ? 1 : (a.descripcion < b.descripcion ? -1 : (a.descripcion > b.descripcion ? 1 : 0)));
      tbDist.forEach(d => {
        var distrito: Distrito = new Distrito();
        distrito.dist = d;
        distrito.prov = tbProv.find(e => d.codigo?.startsWith(e.codigo!));
        distrito.dpto = tbDpto.find(e => d.codigo?.startsWith(e.codigo!));
        this.distritos.push(distrito);
      });
  
      this.filterDistritos = this.controlDistritos.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string'?value:value.dist.descripcion)),
        map(name  => (name?this.buscarDistritos(name):[]))
      )

      if(this.distritos.length === 0)
        resolve('error')
      else
        resolve('ok')
    })
  }

  changePais(value: string){
    //debugger;
    this.selectedPais = value;
    this.muestraDistrito = true;
    if(this.selectedPais !== '01'){
      this.codDistrito = '';
      this.distritoColor = 'accent';
      this.muestraDistrito = false;
    }
  }

  changeDonacion(value: string){
    //debugger;
    this.selectedTipoDonacion = value;
    
    if(this.selectedTipoDonacion === '002' || this.selectedTipoDonacion === '004'){
      this.muestraPaciente = true;
    }
    else{
      this.muestraPaciente = false;
      //this.reiniciaPersona(true)
    }
  }

  buscarDistritos(name: string): Distrito[]{
    this.distritoColor = 'accent';
    this.codDistrito = '';
    var results: Distrito[] = [];
    //debugger;
    if(name.length >= this.carBuscaDistrito){
      var filtro = name.toLowerCase();
      results = this.distritos.filter(e => e.dist?.descripcion?.toLowerCase().includes(filtro));
    }    
    return results.slice(0,this.nroDistritosMuestra);
  }

  mostrarDistrito(d: Distrito): string{
    //debugger;
    var result = '';
    if(d !== undefined && d !== null && d !== '' && d.dist?.descripcion !== '')
      result = d.dist?.descripcion! + ', ' + d.prov?.descripcion! + ', ' + d.dpto?.descripcion!;
    return result;
  }

  changeDistrito(event: any){
    var distrito = event.option.value;
    if(distrito !== undefined){
      this.distritoColor = 'primary';
      this.codDistrito = distrito.dist.codigo;
    }
    //debugger;
  }

  changeEstado(index: number){
    //Si el que aprieto está apagado
    if(!this.btnEstadoSel[index]){
      //Apaga el otro si eeste está prendindo
      if(this.btnEstadoSel[1-index]){
        this.btnEstadoSel[1-index] = false;
      }      
      this.btnEstadoSel[index] = true;
    }
    //Si el que aprieto está prendido
    else{
      //Si es nuevo o estaba pendiente podrá deseleccionar
      if(this.id === 0 || this.estadoIni == 0){
        this.btnEstadoSel[index] = false;
      }
      else{
        console.log('No se puede deseleccionar cuando ya no está pendiente')
      }
    }
  }

  obtenerPersonaEnter(key: number, esPaciente: boolean = false){
    if(key === 13){
      this.obtenerPersona(undefined, esPaciente);
    }
  }

  obtenerPersona(e?: Event, esPaciente: boolean = false){
    //console.log(e);
    e?.preventDefault(); // Evita otros eventos como blur   
    
    var tipoDocu = esPaciente?this.form.value['PacTipDocu']:this.form.value['TipDocu'];
    var numDocu = esPaciente?this.form.value['PacNumDocu']:this.form.value['NumDocu'];
    
    //debugger;

    var validacion = this.validaDocumento(tipoDocu, numDocu, esPaciente);
    if(validacion === ''){
      this.predonanteService.obtenerPersona(0, tipoDocu, numDocu).subscribe(data=>{
        //Verifica si existe en BD
        var formPersona = esPaciente?this.form.value['IdePaciente']:this.form.value['IdePersona'];

        if(data!== undefined && data.idePersona !== 0){
          //No carga repetidos (eficiencia)          
          if(formPersona !== data.idePersona){
            this.idPersona = 0;
            this.muestraDatosPersona(data, esPaciente);
            if(esPaciente){
              this.pacientePoclab = false;
              this.idPaciente = data.idePersona!==undefined?data.idePersona:0;
            }
            else{
              this.idPersona = data.idePersona!==undefined?data.idePersona:0;
            }
          }            
        }
        else{
          //Busca en Poclab
          if(tipoDocu === '1'){
            
            this.poclabService.obtenerPersona(tipoDocu, numDocu).subscribe(dataP=>{
              if(dataP!== undefined && dataP!== null && dataP.nIdePersona !== 0){
                if(formPersona !== dataP.nIdePersona){
                  //Convierte datos
                  //debugger;
                  var p = new Persona();
                  p.tipDocu = '1';
                  p.numDocu = dataP.vDocumento;
                  p.idePersona = 0;
                  p.apPaterno = dataP.vApePaterno;
                  p.apMaterno = dataP.vApeMaterno;
                  p.primerNombre = dataP.vPrimerNombre;
                  p.segundoNombre = dataP.vSegundoNombre;
                  p.sexo = dataP.vSexo;
                  p.fecNacimiento = dataP.dteNacimiento;

                  if(p.fecNacimiento !== undefined && p.fecNacimiento !== null)
                    this.fechaNac = p.fecNacimiento;
                  else
                    this.fechaNac = null;

                  var codPais = dataP.vCodPais;
                  if(codPais === 'PER'){
                    p.codPais = '01';
                  }
                  else{
                    p.codPais = dataP.vCodPais;
                  }                  
                  p.codDepartamento = dataP.vCodRegion;
                  p.codProvincia = dataP.vCodProvincia;
                  p.codDistrito = dataP.vCodDistrito;
                  p.correo1 = dataP.vEmail;
                  p.telefono = dataP.vTelefono1;
                  this.muestraDatosPersona(p, esPaciente);
                  if(esPaciente){
                    this.pacientePoclab = true;
                    //debugger;
                    this.idPaciente = 0;
                  }
                }                  
              }
            })
          }
        }
      })
    }
    else{
      if(validacion !== 'El tipo de documento y el documento no pueden estar vacíos')
        this.notifier.showNotification(2,'Mensaje',validacion);
      this.reiniciaPersona(esPaciente);
    }
  }

  muestraDatosPersona(data: Persona, esPaciente: boolean = false){
    //debugger;
    //Ocupación por defecto
    if(data.codOcupacion === undefined || !this.tbOcupa.find(e => e.codigo === data.codOcupacion?.toString()))
      data.codOcupacion = 111;

    //debugger
    var edadStr: string = data.edad?.toString()!;
    if(edadStr === undefined || edadStr === '0') edadStr = '';

    if(esPaciente){
      this.form.patchValue({
        IdePaciente: data.idePersona,
        PacTipDocu: data.tipDocu,
        PacNumDocu: data.numDocu,
        PacApPaterno: data.apPaterno,
        PacApMaterno: data.apMaterno,
        PacNombres: data.primerNombre + ' ' + data.segundoNombre,
        PacFecNacimiento: data.fecNacimiento,
        PacSexo: data.sexo
      });
    }
    else{
      this.form.patchValue({
        Edad: edadStr
      });
      //debugger;
      if(data.fecNacimiento !== undefined && data.fecNacimiento !== null)
        this.updateFechaNac(data.fecNacimiento);
      else
        this.fechaNac = null;

      this.form.patchValue({
        IdePersona: data.idePersona,
        TipDocu: data.tipDocu,
        NumDocu: data.numDocu,
        ApPaterno: data.apPaterno,
        ApMaterno: data.apMaterno,
        Nombres: data.primerNombre + ' ' + data.segundoNombre,
        Sexo: data.sexo,
        FecNacimiento: data.fecNacimiento,
        CodPais: data.codPais,
        Celular: data.celular,
        Telefono: data.telefono,
        Correo: data.correo1,
        //Datos completos
        //Edad: edadStr,
        EstadoCivil: data.estadoCivil,
        Nacionalidad: data.nacionalidad,
        LugarNacimiento: data.lugarNacimiento,
        Procedencia: data.procedencia,
        CodGradoInstruccion: data.codGradoInstruccion,
        CodOcupacion: data.codOcupacion,
        Direccion: data.direccion,
        LugarTrabajo: data.lugarTrabajo
      });

      this.webcamImage = null;
      this.showWebcam = false;
    }    

    if(!esPaciente){
      this.cambiaPaisDistrito(data.codPais, data.codDistrito);
      this.obtieneHistorial(data.idePersona, true);
      if(data.foto !== undefined && data.foto !== null && data.foto.strFoto !== undefined)
        this.fotoUrl = data.foto.strFoto!==null?data.foto.strFoto:'';
    }    
  }

  obtieneHistorial(idPersona: number = 0, muestraErrores: boolean){
    if(idPersona !== 0){
      this.predonanteService.obtenerHistorial(idPersona).subscribe(dataH=>{
        //debugger;
        if(dataH!==undefined){
          var historial: PersonaHistorial[] = dataH.items;

          //Tipo de sangre
          var hist1 = historial.find(e => e.tipo === 1);
          this.muestraSangre = false;
          if(hist1 !== undefined){
            var tipoSangre: PersonaHistorial = hist1;
            
            this.abo = tipoSangre.dato1!==undefined?tipoSangre.dato1:'';
            this.rh = tipoSangre.dato2!==undefined?tipoSangre.dato2:'';
            this.colFondo = tipoSangre.colorFondo!==undefined?tipoSangre.colorFondo:'';
            this.colLetra = tipoSangre.colorLetra!==undefined?tipoSangre.colorLetra:'';
            this.muestraSangre = true;
          }

          if(muestraErrores){
            //Posible error
            var hist2 = historial.filter(e => e.tipo?e.tipo >= 2:false);
            if(hist2 !== undefined){
              var errores: PersonaHistorial[] = hist2;
              if(errores.length > 1){
                var msgError = errores[errores.length-1].dato1;
                //console.log(msgError);
                if(msgError){
                  this.confirm.openConfirmDialog(true, msgError).afterClosed().subscribe(res =>{
                    //Ok
                    if(res){
                      this.reiniciaPersona();
                    }
                  });
                }
              }                                
            }
          }          
        }

      });
    }
  }

  validaDocumento(tipoDocu: string, numDocu: string, esPaciente: boolean){
    if(tipoDocu === '' || numDocu === '')
      return 'El tipo de documento y el documento no pueden estar vacíos';

    var noEsNro = !this.esEntero(numDocu);
    
    //DNI
    if(tipoDocu === '1'){
      if(numDocu.length !== 8)
        return 'El DNI debe tener 8 dígitos';
      if(noEsNro)
        return 'El DNI debe debe contener solo números';
    }

    //RUC
    if(tipoDocu === '6'){
      if(numDocu.length !== 11)
        return 'El RUC debe tener 11 dígitos';
      if(noEsNro)
        return 'El RUC debe debe contener solo números';
    }

    //CEXT
    if(tipoDocu === '4' && numDocu.length > 12)
      return 'El CEXT no puede exceder 12 dígitos';

    //PASS
    if(tipoDocu === '7' && numDocu.length > 12)
      return 'El PASS no puede exceder 12 dígitos';

    //Validaciones extra para paciente
    if(esPaciente){
      if(this.form.value['TipDocu'] === '' || this.form.value['NumDocu'] === '')
        return 'Debe completar el documento del postulante';
      
      if(this.form.value['TipDocu'] === tipoDocu && this.form.value['NumDocu'] === numDocu)
        return 'El paciente no puede ser el mismo postulante'
    }
    
    return '';
  }

  esEntero(cadena: string){
    const regex = /^[0-9]+$/;
    return regex.test(cadena);
  }

  cambiaFechaNac(dateStr: string){
    var arrDate = this.separarFecha(dateStr);
    if(arrDate.length === 0)
      this.fechaNac = null;
    else{
      var d = new Date(arrDate[2], arrDate[1]-1, arrDate[0]);
      //console.log(this.minDate + ' < ' + d + ' < ' + this.maxDate);
      if(d < this.minDate || d > this.maxDate)
        this.fechaNac = null;
      else
        this.updateFechaNac(d);
    }
  }

  updateFechaNac(d: Date){
    //debugger;
    //console.log(d);
    this.fechaNac = d;
    //Actualiza fecha si no existe
    if(this.form.get('Edad') !== undefined){
      var edad = this.calcularEdad(d);
      this.form.patchValue({
        Edad: edad.toString()
      });
    }
  }

  separarFecha(cad: string){
    var arrStr: string[] = [];
    var arr: number[] = [];
    arrStr = cad.split('/');
    if(arrStr.length !== 3)
      return arr;
    else{
      for (let str of arrStr){
        let num = parseInt(str);
        if(num === null){
          arr = [];
          break;
        }
        else
          arr.push(num)
      }
      return arr;
    }
  }

  calcularEdad(date: Date) {
    var hoy = new Date();
    var cumpleanos = new Date(date);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
  }

  reiniciaPersona(esPaciente: boolean = false){
    if(esPaciente){
      this.idPersona = 0;
      this.idPaciente = 0;
      this.pacientePoclab = false;
      this.form.patchValue({
        IdePaciente: 0,
        //PacTipDocu: '1',
        PacNumDocu: '',
        PacApPaterno: '',
        PacApMaterno: '',
        PacNombres: '',
        PacFecNacimiento: null,
        PacSexo: ''
      });
    }
    else{
      this.muestraSangre = false;
      this.muestraDistrito = false;
      this.controlDistritos.setValue(new Distrito());
      this.codDistrito = '';

      this.fotoUrl = '';
      this.webcamImage = null;
      this.showWebcam = false;

      this.form.patchValue({
        IdePersona: 0,
        //TipDocu: '1',
        NumDocu: '',
        ApPaterno: '',
        ApMaterno: '',
        Nombres: '',
        Sexo: '',
        FecNacimiento: null,
        CodPais: '',
        Celular: '',
        Telefono: '',
        Correo: '',
        //Datos completos
        Edad: '',
        EstadoCivil: '',
        Nacionalidad: '',
        LugarNacimiento: '',
        Procedencia: '',
        CodGradoInstruccion: '',
        CodOcupacion: 0,
        Direccion: '',
        LugarTrabajo: ''
      });
      this.fechaNac = null;
    }    
  }

  cambiaPaisDistrito(codPais: string = '', codDistrito: string = ''){
    this.changePais(codPais?codPais:'');
    //debugger;

    this.codDistrito = codDistrito?codDistrito:'';
    if(this.codDistrito !== ''){
      var distFind = this.distritos.find(e => e.dist?.codigo === this.codDistrito);
      if(distFind !== undefined){
        var distrito: Distrito = distFind;
        this.distritoColor = 'primary';
        this.controlDistritos.setValue(distrito);
      }
      else{
        this.distritoColor = 'accent';
        this.controlDistritos.setValue(new Distrito());
      }
    }
  }

  obtener(){
    if(this.id!=0){

      /*var c = document.getElementById('buttonsDonacion');
      if(c) window.scrollTo(0, c.scrollHeight);*/

      this.spinner.showLoading();
      this.predonanteService.obtener(this.id).subscribe(data=>{
        //debugger;
        var p = data.persona;
        
        if(p !== undefined){
          //debugger;
          var edadStr: string = p.edad?.toString()!;
          if(edadStr === undefined || edadStr === '0') edadStr = '';

          this.idPersona = p.idePersona!==undefined?0:p.idePersona!;

          this.codigo = data.codigo===undefined?'':data.codigo.toString();
          this.form.patchValue({
            IdePersona: p.idePersona,
            Codigo: data.codigo,
            TipDocu: p.tipDocu,
            NumDocu: p.numDocu,
            ApPaterno: p.apPaterno,
            ApMaterno: p.apMaterno,
            Nombres: p.primerNombre + ' ' + p.segundoNombre,
            Sexo: p.sexo,
            FecNacimiento: p.fecNacimiento,
            CodPais: p.codPais,
            Celular: p.celular,
            Telefono: p.telefono,
            Correo: p.correo1,
            IdeOrigen: data.ideOrigen?.toString(),
            IdeCampania: data.ideCampania?.toString(),
            Fecha: data.fecha,
            //Datos completos
            Edad: edadStr,
            EstadoCivil: p.estadoCivil,
            Nacionalidad: p.nacionalidad,
            LugarNacimiento: p.lugarNacimiento,
            Procedencia: p.procedencia,
            CodGradoInstruccion: p.codGradoInstruccion,
            CodOcupacion: p.codOcupacion?.toString(),
            Direccion: p.direccion,
            LugarTrabajo: p.lugarTrabajo,
            CodEstado: data.codEstado,
            //Otros datos predonante
            Otros: data.otros,            
            CodTipoDonacion: data.codTipoDonacion,
            IdePaciente: 0
          });

          if(p.fecNacimiento !== undefined && p.fecNacimiento !== null)
            this.fechaNac = p.fecNacimiento;
          else
            this.fechaNac = null;
          
          if(data.ideTipProc !== undefined){
            this.changeTipoProced(data.ideTipProc);
            this.form.patchValue({
              CodTipoProcedimiento: data.ideTipProc,
              CodTipoExtraccion: data.codTipoExtraccion
            });
          }
          //debugger;
          if(data.viajeSN === 'Si' || data.viajeSN === 'Sí'){
            this.form.patchValue({
              ViajeSN: 'Sí',
              Lugar: data.viajes,
              Permanencia: data.permanencia,
              FechaViaje: data.fechaViaje
            });
          }
          if(data.codTipoDonacion === '002' || data.codTipoDonacion === '004'){
            this.changeDonacion(data.codTipoDonacion);
            if(data.idePersonaRelacion !== undefined && data.idePersonaRelacion !== 0){
              this.predonanteService.obtenerPersona(data.idePersonaRelacion).subscribe(dataP=>{
                //debugger;
                if(dataP !== undefined && dataP.idePersona !== 0){
                  this.muestraDatosPersona(dataP, true);
                  this.pacientePoclab = false;
                  this.idPaciente = dataP.idePersona!==undefined?dataP.idePersona:0;
                  this.form.patchValue({
                    CodEje: data.codEje,
                    CodParentesco: data.codParentesco,
                    TipRecep: data.tipRecep
                  });
                }                  
              })
            }
            
          }
        

          //Deshabilita tipo de documento y documento si existe la postulación
          //Ya no (no deja enviar tipo de documento y documento)
          //this.form.get('TipDocu')?.disable();
          //this.form.get('NumDocu')?.disable();

          this.obtieneHistorial(p.idePersona, false);

          var codEstado = data.codEstado?data.codEstado:0;
          this.estadoIni = codEstado;
          //debugger;

          this.cambiaPaisDistrito(p.codPais, p.codDistrito);

          if(data.foto !== undefined && data.foto !== null && data.foto.strFoto !== undefined)
            this.fotoUrl = data.foto.strFoto!==null?data.foto.strFoto:'';
        }
        this.spinner.hideLoading();
      });
    }
  }

  guardar(aceptaAlarma: boolean = false){
    let model = new Predonante();

    //debugger;
    model.idePreDonante = this.id
    model.codigo = this.form.value['Codigo'];;

    let p = new Persona();
    p.idePersona = this.form.value['IdePersona'];;
    p.tipDocu = this.form.value['TipDocu'];
    p.numDocu = this.form.value['NumDocu'];
    p.apPaterno = this.form.value['ApPaterno'];
    p.apPaterno = p.apPaterno?.toUpperCase();
    p.apMaterno = this.form.value['ApMaterno']; 
    p.apMaterno = p.apMaterno?.toUpperCase();
    this.asignarNombres(p, this.form.value['Nombres']);
    
    p.sexo = this.form.value['Sexo'];
    p.fecNacimiento = this.form.value['FecNacimiento'];
    p.codPais = this.form.value['CodPais'];
    p.codPais = p.codPais===''?undefined:p.codPais;
    p.codDistrito = this.codDistrito===''?undefined:this.codDistrito;
    p.celular = this.form.value['Celular'];
    p.telefono = this.form.value['Telefono'];
    p.correo1 = this.form.value['Correo'];
    //Datos completos
    var edad = 0;
    if(this.form.value['Edad'] !== '') edad = parseInt(this.form.value['Edad']);
    p.edadManual = edad===undefined?0:edad;
    p.estadoCivil = this.form.value['EstadoCivil'];
    p.nacionalidad = this.form.value['Nacionalidad'];
    p.lugarNacimiento = this.form.value['LugarNacimiento'];
    p.procedencia = this.form.value['Procedencia'];
    p.codGradoInstruccion = this.form.value['CodGradoInstruccion'];
    var ocupacion = 0;
    if(this.form.value['CodOcupacion'] !== '') ocupacion = parseInt(this.form.value['CodOcupacion']);
    p.codOcupacion = ocupacion;
    p.direccion = this.form.value['Direccion'];
    p.lugarTrabajo = this.form.value['LugarTrabajo'];

    //Foto
    let f = new Foto();
    f.idePersona = p.idePersona;
    f.strFoto = this.webcamImage?this.webcamImage.imageAsDataUrl:this.fotoUrl;
    f.tipo = 2; //Predonante
    model.foto = f;
    //debugger;

    model.idePersona = p.idePersona;
    model.persona = p;

    model.ideBanco = this.curBanco;
    model.ideOrigen = this.form.value['IdeOrigen'];
    model.ideCampania = this.form.value['IdeCampania'];
    model.fecha = this.form.value['Fecha'];
    model.ideUsuReg = this.curUser;
    model.codEstado = this.form.value['CodEstado'];;
    //Datos completos
    model.viajeSN = this.form.value['ViajeSN'];
    model.viajes = this.form.value['Lugar'];
    model.permanencia = this.form.value['Permanencia'];
    model.fechaViaje = this.form.value['FechaViaje'];
    model.otros = this.form.value['Otros'];
    model.ideTipProc = this.form.value['CodTipoProcedimiento'];
    model.codTipoExtraccion = this.form.value['CodTipoExtraccion'];
    model.codTipoDonacion = this.form.value['CodTipoDonacion'];

    let a = new Persona();
    a.idePersona = this.form.value['IdePaciente'];
    a.tipDocu = this.form.value['PacTipDocu'];
    a.numDocu = this.form.value['PacNumDocu'];
    a.apPaterno = this.form.value['PacApPaterno'];
    a.apMaterno = this.form.value['PacApMaterno'];
    this.asignarNombres(a, this.form.value['PacNombres']);
    a.fecNacimiento = this.form.value['PacFecNacimiento'];
    a.sexo = this.form.value['PacSexo'];

    model.idePersonaRelacion = a.idePersona;
    model.paciente = a;

    model.codEje = this.form.value['CodEje'];
    model.codParentesco = this.form.value['CodParentesco'];
    model.tipRecep = this.form.value['TipRecep'];

    model.aceptaAlarma = aceptaAlarma?1:0;
    //debugger;
    
    if(this.showWebcam){
      this.confirm.openConfirmDialog(true, 'La cámara está activa pero no ha tomado ninguna foto.').afterClosed().subscribe(res =>{
        //Ok
        if(res){
          //console.log('Sí');
        }
      });
    }
    else{
      this.guardaPostulante(model);
    }
  }

  guardaPostulante(model: Predonante){
    this.spinner.showLoading();
    this.predonanteService.guardar(model).subscribe(data=>{
      //debugger;
      if(data.typeResponse==environment.EXITO){
        this.notifier.showNotification(data.typeResponse!,'Mensaje',data.message!);
        localStorage.setItem('IdeOrigen',model.ideOrigen===undefined?'':model.ideOrigen.toString());
        localStorage.setItem('IdeCampania',model.ideCampania===undefined?'':model.ideCampania.toString());
        this.form.patchValue({
          Codigo: data.codigo
        })
        if(data.codigo !== undefined && data.codigo !== null)
          this.codigo = data.codigo;
        this.router.navigate(['/page/donante/aspirante']);
        this.spinner.hideLoading();
      }else{
        if(data.typeResponse==environment.ALERT){
          this.confirm.openConfirmDialog(false, data.message!).afterClosed().subscribe(res =>{
            //Ok
            if(res){
              //console.log('Sí');
              this.guardar(true)
            }
            else{
              //console.log('No');
            }
          });
        }
        else{
          this.notifier.showNotification(data.typeResponse!,'Mensaje',data.message!);
        }          
        this.spinner.hideLoading();
      }      
    });
  }

  asignarNombres(p: Persona, nombres: string){
    nombres = nombres.toUpperCase();
    var posEspacio = nombres.indexOf(' ');
    if(posEspacio !== -1){
      p.primerNombre = nombres.substring(0, posEspacio);
      p.segundoNombre = nombres.substring(posEspacio+1, nombres.length);
    }
    else{
      p.primerNombre = nombres;
      p.segundoNombre = '';
    }
  }

  getCodigo(){
    var codigo = this.form.value['Codigo'];
    codigo = codigo===undefined?'#######':codigo;
    return codigo.toString();
  }

  subirFoto(fileInput: any) {
    this.fotoError = "";
    this.webcamImage = null;
    this.showWebcam = false;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.fotoUrl = imgBase64Path;
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  //Métodos para cámara
  public triggerSnapshot(): void {
    this.trigger.next();
    this.toggleWebcam();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  resetImage(){
    this.fotoUrl = '';
    this.webcamImage = null;
    this.showWebcam = false;
  }

  limpiar(){
    this.id = 0;
    this.codigo = '';

    this.resetImage();
    this.reiniciaPersona();
    
    //Limpia paciente
    this.reiniciaPersona(true);
    this.muestraPaciente = false;

    //Busca origen y campaña de caché
    var ideOri = localStorage.getItem('IdeOrigen');
    ideOri = ideOri?ideOri:this.curBanco.toString();
    var ideCam = localStorage.getItem('IdeCampania');
    ideCam = ideCam?ideCam:'1';

    //Valores por defecto de tipo proc. y extracción
    this.form.patchValue({
      CodTipoProcedimiento: this.tbTipoProced[0].codigo
    });
    this.changeTipoProced(this.tbTipoProced[0].codigo)

    this.form.patchValue({
      Codigo: '#######',
      TipDocu: '1',
      ViajeSN: 'No',
      Lugar: '',
      Permanencia: '',
      FechaViaje: null,
      Otros: '',
      CodTipoDonacion: '',
      IdeOrigen: ideOri,
      IdeCampania: ideCam,
      Fecha: new Date(),
      CodEstado: 0,
      CodEje: '',
      CodParentesco: '',
      TipRecep: ''
    })
  }

}