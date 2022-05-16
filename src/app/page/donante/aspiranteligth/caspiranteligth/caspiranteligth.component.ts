import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
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
import { PredonanteService } from 'src/app/_service/donante/predonante.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { environment } from 'src/environments/environment';
import forms from 'src/assets/json/formulario.json';
import { MatStepper } from '@angular/material/stepper';
import { PoclabService } from 'src/app/_service/apiexterno/poclab.service';

@Component({
  selector: 'app-caspiranteligth',
  templateUrl: './caspiranteligth.component.html',
  styleUrls: ['./caspiranteligth.component.css']
})
export class CaspiranteligthComponent implements OnInit {

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

  permiso: Permiso = {};

  id: number = 0;
  edit: boolean = true;
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  curUser: number = 0;
  curBanco: number = 0;

  tablasMaestras = ['TDoc', 'PAIS', 'DEPA', 'PROV', 'DST', 'GENE', 'ORI', 'CAMP'];
  tbTipoDocu: Combobox[] = [];
  tbPais: Combobox[] = [];
  tbGenero: Combobox[] = [];
  tbOrigen: Combobox[] = [];
  tbCampana: Combobox[] = [];

  muestraDistrito: boolean = false;
  carBuscaDistrito: number = 2;
  nroDistritosMuestra: number = 15;
  distritos: Distrito[] = [];
  distritoColor: string = 'accent'
  filterDistritos: Observable<Distrito[]> | undefined;
  controlDistritos = new FormControl();
  codDistrito: string = '';

  selectedPais: string = '';
  
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

  currentTab: number = 0;

  ngOnInit(): void {
    
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
    this.minDate.setMonth(this.maxDate.getMonth() - 12*80);  

    this.form = new FormGroup({
      'Codigo': new FormControl({ value: '#######', disabled: true}),
      'IdePersona': new FormControl({ value: 0, disabled: !this.edit}),
      'TipDocu': new FormControl({ value: '1', disabled: !this.edit}),
      'NumDocu': new FormControl({ value: '', disabled: !this.edit}),
      'ApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'ApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'Nombres': new FormControl({ value: '', disabled: !this.edit}),
      'Sexo': new FormControl({ value: '', disabled: !this.edit}),
      'FecNacimiento': new FormControl({ value: null, disabled: !this.edit}),
      'CodPais': new FormControl({ value: '', disabled: !this.edit}),
      'Celular': new FormControl({ value: '', disabled: !this.edit}),
      'Telefono': new FormControl({ value: '', disabled: !this.edit}),
      'Correo': new FormControl({ value: '', disabled: !this.edit}),
      'IdeOrigen': new FormControl({ value: ideOri, disabled: !this.edit}),
      'IdeCampania': new FormControl({ value: ideCam, disabled: !this.edit}),
      'Fecha': new FormControl({ value: new Date(), disabled: !this.edit}),
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
        this.tbOrigen = this.obtenerSubtabla(tbCombobox,'ORI');
        this.tbCampana = this.obtenerSubtabla(tbCombobox,'CAMP');
        this.tbPais = this.obtenerSubtabla(tbCombobox,'PAIS');
        var tbDpto: Combobox[] = this.obtenerSubtabla(tbCombobox,'DEPA');
        var tbProv: Combobox[] = this.obtenerSubtabla(tbCombobox,'PROV');
        var tbDist: Combobox[] = this.obtenerSubtabla(tbCombobox,'DST');

        //debugger;

        this.listarDistritos(tbDpto, tbProv, tbDist).then(res => {
          this.obtener();
        });
      }
    });
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

  obtenerPersonaEnter(key: number){
    if(key === 13){
      this.obtenerPersona(undefined);
    }
  }

  obtenerPersona(e?: Event){
    console.log(e);
    e?.preventDefault(); // Evita otros eventos como blur   
    
    //this.muestraSangre = false;

    var tipoDocu = this.form.value['TipDocu'];
    var numDocu = this.form.value['NumDocu'];
    
    //debugger;

    var validacion = this.validaDocumento(tipoDocu, numDocu);
    if(validacion === ''){
      this.predonanteService.obtenerPersona(0, tipoDocu, numDocu).subscribe(data=>{
        //console.log(data);
        //debugger;
        //Verifica si existe en BD
        if(data!== undefined && data.idePersona !== 0){
          //No carga repetidos (eficiencia)
          if(this.form.value['IdePersona'] !== data.idePersona)
            this.muestraDatosPersona(data);
        }
        else{
          //Busca en Poclab
          if(tipoDocu === '1'){
            
            this.poclabService.obtenerPersona(tipoDocu, numDocu).subscribe(dataP=>{
              if(dataP!== undefined && dataP!== null && dataP.nIdePersona !== 0){
                if(this.form.value['IdePersona'] !== dataP.nIdePersona){
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
                  this.muestraDatosPersona(p);
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
      this.reiniciaPersona();
    }
  }

  muestraDatosPersona(data: Persona){
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
      Correo: data.correo1
    });
    this.cambiaPaisDistrito(data.codPais, data.codDistrito);

    this.obtieneHistorial(data.idePersona, true);
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

  validaDocumento(tipoDocu: string, numDocu: string){
    if(tipoDocu === '' || numDocu === '')
      return 'El tipo de documento y el documento no pueden estar vacíos';

    //DNI
    if(tipoDocu === '1' && numDocu.length !== 8)
      return 'El DNI debe tener 8 dígitos';

    //RUC
    if(tipoDocu === '6' && numDocu.length !== 11)
      return 'El RUC debe tener 11 dígitos';

    //CEXT
    if(tipoDocu === '4' && numDocu.length > 12)
      return 'El CEXT no puede exceder 12 dígitos';

    //PASS
    if(tipoDocu === '7' && numDocu.length > 12)
      return 'El PASS no puede exceder 12 dígitos';
    
    return '';
  }

  reiniciaPersona(){
    this.muestraSangre = false;
    this.muestraDistrito = false;
    this.controlDistritos.setValue(new Distrito());
    this.codDistrito = '';

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
      Correo: ''
    });
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
      this.currentTab = 1;

      /*var c = document.getElementById('buttonsDonacion');
      if(c) window.scrollTo(0, c.scrollHeight);*/

      this.spinner.showLoading();
      this.predonanteService.obtener(this.id).subscribe(data=>{
        //debugger;
        var p = data.persona;
        if(p !== undefined){
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
            Fecha: data.fecha
          });

          //Deshabilita tipo de documento y documento si existe la postulación
          //Ya no (no deja enviar tipo de documento y documento)
          //this.form.get('TipDocu')?.disable();
          //this.form.get('NumDocu')?.disable();

          this.obtieneHistorial(p.idePersona, false);

          var codEstado = data.codEstado?data.codEstado:0;
          this.estadoIni = codEstado;
          //debugger;

          this.btnEstadoSel = [false, false];
          if(codEstado > 0){
            this.btnEstadoSel[codEstado-1] = true;
          }

          this.cambiaPaisDistrito(p.codPais, p.codDistrito);
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
    var nombres: string = this.form.value['Nombres'];
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
    p.sexo = this.form.value['Sexo'];
    p.fecNacimiento = this.form.value['FecNacimiento'];
    p.codPais = this.form.value['CodPais'];
    p.codPais = p.codPais===''?undefined:p.codPais;
    p.codDistrito = this.codDistrito===''?undefined:this.codDistrito;
    p.celular = this.form.value['Celular'];
    p.telefono = this.form.value['Telefono'];
    p.correo1 = this.form.value['Correo'];

    model.idePersona = p.idePersona;
    model.persona = p;

    model.ideTipProc = '01';
    model.codTipoExtraccion = '01';
    model.codTipoDonacion = '01';
    model.idePersonaRelacion = 0; //Paciente
    model.ideBanco = this.curBanco;
    model.ideOrigen = this.form.value['IdeOrigen'];
    model.ideCampania = this.form.value['IdeCampania'];
    model.fecha = this.form.value['Fecha'];
    model.ideUsuReg = this.curUser;
    model.codEstado = !this.btnEstadoSel[0]&&!this.btnEstadoSel[1]?0:(this.btnEstadoSel[0]?1:2);

    //debugger;

    this.spinner.showLoading();
    model.aceptaAlarma = aceptaAlarma?1:0;
    this.predonanteService.guardar(model).subscribe(data=>{

      if(data.typeResponse==environment.EXITO){
        this.notifier.showNotification(data.typeResponse!,'Mensaje',data.message!);
        localStorage.setItem('IdeOrigen',model.ideOrigen===undefined?'':model.ideOrigen.toString());
        localStorage.setItem('IdeCampania',model.ideCampania===undefined?'':model.ideCampania.toString());
        this.form.patchValue({
          Codigo: data.codigo
        })
        this.router.navigate(['/page/donante/aspirantelight']);
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

}
