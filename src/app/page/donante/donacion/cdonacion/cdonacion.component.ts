import { Donacion } from 'src/app/_model/donante/donacion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Combobox } from 'src/app/_model/combobox';
import { environment } from 'src/environments/environment';
import { Permiso } from 'src/app/_model/permiso';
import { DonacionService } from 'src/app/_service/donante/donacion.service';
import { Unidade } from 'src/app/_model/donante/unidade';
import * as JsBarcode from 'jsbarcode';
import { RptetiquetaComponent } from 'src/app/page/reporte/rptetiqueta/rptetiqueta.component';
import { ReporteService } from 'src/app/_service/reporte/reporte.service';

@Component({
  selector: 'app-cdonacion',
  templateUrl: './cdonacion.component.html',
  styleUrls: ['./cdonacion.component.css']
})
export class CdonacionComponent implements OnInit {

  @ViewChild(RptetiquetaComponent) rptetiqueta!: RptetiquetaComponent;
  
  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  listaTipoExtraccion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaTipoBolsa?: Combobox[] = [];
  listaBrazo?: Combobox[] = [];
  listaDificultad?: Combobox[] = [];
  listaHemoComponente?: Combobox[] = [];
  listaUnidade?: Unidade[] = [];
  listaMotivoRechazo?: Combobox[] = [];

  donante: string = "";
  documento: string ="";
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  btndisable: boolean = false;
  btnestado:boolean = false;
  vHoraIni?: string;
  vHoraFin?: string;
  existExtraccion: boolean = false;
  descextrac?: boolean = false;
  existapto?: string = "0";
  tipoExtraccion?: number;
  currentTab: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private donacionService: DonacionService,
    private reporteService: ReporteService
  ) { 
  }

  ngOnInit(): void {

    this.inicializar();

    this.obtenerpermiso();

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit =(data["edit"]==undefined) ? true : (data["edit"]=='true')? true : false;
      this.btndisable = (this.id==0)? false: true;
      this.obtener(0);
    });
  }

  inicializar(){
    this.form = new FormGroup({
      'codDonacion': new FormControl({ value: '', disabled: true}),//ok
      'codPostulante': new FormControl({ value: '', disabled: true}),//ok
      'idePreDonante': new FormControl({ value: '', disabled: false}),//ok
      'ideDonacion': new FormControl({ value: '', disabled: false}),//ok
      'ideMuestra': new FormControl({ value: '', disabled: false}),//ok
      'ideExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'fecha': new FormControl({ value: '', disabled: false}),//ok
      'codTipoExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'ideGrupo': new FormControl({ value: '', disabled: false}),//ok
      'hemoglobina': new FormControl({ value: '', disabled: false}),//ok
      'hematocrito': new FormControl({ value: '', disabled: false}),//ok
      'codTubuladura': new FormControl({ value: '', disabled: false}),//ok
      'obsedrvaciones': new FormControl({ value: '', disabled: true}),//ok
      'vHoraIni': new FormControl({ value: '', disabled: false}),//ok
      'vHoraFin': new FormControl({ value: '', disabled: false}),//ok
      'fechaExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'tipoExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'ideTipoBolsa': new FormControl({ value: '', disabled: false}),//ok
      'brazo': new FormControl({ value: '', disabled: false}),         //ok 
      'dificultad': new FormControl({ value: '', disabled: false}),//ok
      'operador': new FormControl({ value: '', disabled: false}),//ok
      'rendimiento': new FormControl({ value: '', disabled: false}),//ok
      'ideMotivoRechazo': new FormControl({ value: '', disabled: false})//ok
    });
  }

  obtener(codigo: any){

    this.spinner.showLoading();
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
    let ids=0;
    let cod="";
    this.donante = "";
    this.documento = "";

    if(codigo!=0){
      cod = (codigo.target.value==0)? this.id: codigo.target.value;
      cod = (cod==undefined)? this.form.value['codigo']: cod; 
      this.$disable = false;
    }else{
      ids=  this.id;
      this.$disable = true;
    }

    this.donacionService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaTipoBolsa = data.listaTipoBolsa;
      this.listaBrazo = data.listaBrazo;
      this.listaDificultad = data.listaDificultad;
      this.listaUnidade = data.listaExtraccionUnidad;
      this.listaMotivoRechazo = data.listaMotivoRechazo;

      // data.listaMotivoRechazo?.forEach

      if(ids!=0 || cod!=""){

        let $fecha = new Date();

        let $fechaReg= data.fecha==null? $fecha:data.fecha; 
        let $fechaExtr= data.fechaExtraccion==null? $fecha:data.fechaExtraccion; 

        this.vHoraIni = (data.vHoraIni==null)? (`${(new Date().getHours()<10?'0':'') + new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`) : data.vHoraIni.substring(0,5);
        this.vHoraFin = (data.vHoraFin==null)? (`${(new Date().getHours()<10?'0':'') + new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`) : data.vHoraFin.substring(0,5);

        this.form = new FormGroup({
          'codDonacion': new FormControl({ value: data.codDonacion, disabled: true}),//ok
          'codPostulante': new FormControl({ value: data.codPostulante, disabled: true}),//ok
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),//ok
          'ideDonacion': new FormControl({ value: data.ideDonacion, disabled: false}),//ok
          'ideMuestra': new FormControl({ value: data.ideMuestra, disabled: false}),//ok
          'ideExtraccion': new FormControl({ value: data.ideExtraccion, disabled: false}),//ok
          'fecha': new FormControl({ value: $fechaReg, disabled: !this.edit}),//ok
          'codTipoExtraccion': new FormControl({ value: data.codTipoExtraccion, disabled: !this.edit}),//ok
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: !this.edit}),//ok
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: !this.edit}),//ok
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: !this.edit}),//ok
          'codTubuladura': new FormControl({ value: data.codTubuladura, disabled: !this.edit}),//ok
          'obsedrvaciones': new FormControl({ value: data.obsedrvaciones, disabled: true}),//ok
          'vHoraIni': new FormControl({ value: this.vHoraIni, disabled: !this.edit}),//ok
          'vHoraFin': new FormControl({ value: this.vHoraFin, disabled: !this.edit}),//ok
          'fechaExtraccion': new FormControl({ value: $fechaExtr, disabled: !this.edit}),//ok
          'tipoExtraccion': new FormControl({ value: 0, disabled: !this.edit}),//ok
          'ideTipoBolsa': new FormControl({ value: data.ideTipoBolsa, disabled: !this.edit}),//ok
          'brazo': new FormControl({ value: data.brazo, disabled: !this.edit}),         //ok 
          'dificultad': new FormControl({ value: data.dificultad, disabled: !this.edit}),//ok
          'operador': new FormControl({ value: data.operador, disabled: !this.edit}),//ok
          'rendimiento': new FormControl({ value: data.rendimiento, disabled: !this.edit}),//ok
          'ideMotivoRechazo': new FormControl({ value: data.ideMotivoRechazo?.toString(), disabled: !this.edit})//ok          
        });

        this.existapto = (data.codEstado!=null)? data.codEstado!.toString()! : "0";
        this.descextrac =  (data.ideMotivoRechazo?.toString()!="0")? true : false;
        this.donante = data.donante!;
        this.documento = data.documento!;
   
        if(data.ideDonacion==0 || data.ideDonacion==null){
          this.existExtraccion =false;
          this.currentTab = 0;
        }else{
          this.existExtraccion =true;
          this.currentTab = 1;
        }

        if(data.idePreDonante==0 || data.idePreDonante==null){
          this.notifierService.showNotification(environment.ALERT,'Mensaje','El código al que hace referencia no existe');
        }        
        else if(data.codEstado!.toString()!="1"){
          this.notifierService.showNotification(environment.ALERT,'Mensaje','Para la creación de la donación debe estar APTO');
        }else{
          this.calcularhora(2);
        }

      }

      this.spinner.hideLoading();
    });   

  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.entrevista.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  guardar(){

    let id = this.form.value['idePreDonante'];
    let iddonacion = this.form.value['ideDonacion'];
    let ideGrupo = this.form.value['ideGrupo'];
    let hemoglobina = this.form.value['hemoglobina'];
    let hematocrito = this.form.value['hematocrito'];
    let submit = true;
    let validatehemo = 0;

    if(id==null || id=="" || id==0){
      submit = false;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','El código Pre Donante no existe');
    }
    else if(ideGrupo=="" || ideGrupo==null){
      submit = false;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Seleccione el grupo ABO');
    }
    else if(hemoglobina<0){
      submit = false;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','La hemoglobina no puede ser menor a 0');
    }
    else if(hematocrito<0){
      submit = false;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','El hematocrito no puede ser menor a 0');
    }
    else if (iddonacion > 0){

      let rendimiento = this.form.value['rendimiento'];
      let fechaextracc = this.form.value['fechaExtraccion'];
      let timeHoraInicio = this.form.value['vHoraIni'];
      let timeHoraFin = this.form.value['vHoraFin'];
      let tiempoextraccion = this.form.value['tipoExtraccion'];
      let $countUnidades = this.listaUnidade?.filter(y=>y.volumen!>0).length;
      let $ideMotivoRec = this.form.value['ideMotivoRechazo'];  

      if(fechaextracc==null){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese la fecha de extracción');
      }   
      else if($countUnidades==0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese el volumen unos de los hemocomponente');
      } 
      else if(timeHoraInicio==""){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese la hora inicio');
      } 
      else if(timeHoraFin==""){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese la hora fin');
      }  
      else if(rendimiento<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','El rendimiento no puede ser menor a 0');
      }
      else if(tiempoextraccion<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La hora fin no puede menor a la hora inicio');
      }
      else if(this.descextrac && ($ideMotivoRec==undefined || $ideMotivoRec=="" || $ideMotivoRec=="0" )){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje', 'Seleccione descartar extracción');
      }
    }

    if(submit){

      hemoglobina = (hemoglobina==0 || hemoglobina==null)? 0 :hemoglobina;
      hematocrito = (hematocrito==0 || hematocrito==null)? 0 :hematocrito;
    
      validatehemo= hemoglobina + hematocrito;
    
      if(validatehemo==0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese Hemoglobina o Hematocrito');
      }
    }

    
    if(submit){
      let model = new Donacion();

      /*Insertar Donacion */
      model.ideDonacion= this.form.value['ideDonacion'];
      model.idePreDonante= this.form.value['idePreDonante'];
      model.fecha= this.form.value['fecha'];
      model.codTipoExtraccion= this.form.value['codTipoExtraccion'];
      model.selloCalidad= this.form.value['selloCalidad'];
      model.existExtraccion = this.existExtraccion;

      /*Insertar Chequeo */
      model.ideGrupo= this.form.value['ideGrupo'];
      model.hemoglobina= this.form.value['hemoglobina'];
      model.hematocrito= this.form.value['hematocrito'];

      if(this.existExtraccion){

         /*Insertar Extraccion */
          model.ideExtraccion= this.form.value['ideExtraccion'];
          model.ideDonacion= this.form.value['ideDonacion'];
          model.fechaExtraccion= this.form.value['fechaExtraccion'];
          model.vHoraIni= this.form.value['vHoraIni'];
          model.vHoraFin= this.form.value['vHoraFin'];
          model.ideTipoBolsa= this.form.value['ideTipoBolsa'];
          model.brazo= this.form.value['brazo'];
          model.dificultad= this.form.value['dificultad'];
          model.rendimiento= this.form.value['rendimiento'];
          model.codTubuladura= this.form.value['codTubuladura'];
          model.operador= this.form.value['operador'];
          model.ideMotivoRechazo= (this.descextrac==false)? 0: this.form.value['ideMotivoRechazo'];          

           /*Insertar Unidades */
          model.listaExtraccionUnidad= this.listaUnidade?.filter(y=>y.volumen!>0);
      }
     
      this.spinner.showLoading();
      this.donacionService.guardar(model).subscribe(data=>{
 
        this.notifierService.showNotification(data.swt!,'Mensaje',data.mensaje!);
      
          if(data.swt==environment.EXITO){
              if(!this.existExtraccion){
                this.obtener(0);                   
              }else{
                this.router.navigate(['/page/donante/aspirante']);                
              }
              this.spinner.hideLoading();
            }else{
              this.spinner.hideLoading();
            }
        });
    }
  }

  imprimir() {
    let idedonacion = this.form.value['ideDonacion'];
    let idepredonante = this.form.value['idePreDonante'];

    if(idedonacion==0 ||idedonacion==null){
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Para imprimir la etiqueta debe generar la donación');
    }else{
    this.spinner.showLoading();
    this.reporteService
      .rptetiqueta(idedonacion,idepredonante)
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
          window.open(fileURL, `${"etiqueta"}.pdf`);
        }
      );
    }
  }

  calcularhora(tipo: number){

    let $fechaextraccion =this.form.value['fechaExtraccion'];
    let $horainicial = this.form.value['vHoraIni'];
    let $horafinal = this.form.value['vHoraFin'];
    let $addminuto = this.form.value['tipoExtraccion'];

    if(tipo == 1){
      if($fechaextraccion!="" && $fechaextraccion!=null && $fechaextraccion!=undefined){

        $addminuto = ($addminuto ==null || $addminuto =="")? 0: $addminuto ;
        $fechaextraccion= new Date($fechaextraccion);

        this.$calcularhora($fechaextraccion,$horainicial, $horafinal, $addminuto, tipo)
      }else{
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese la fecha de extracción');
      }      
    }
    else if(tipo == 2){
      if($horainicial=="" || $horafinal=="" || $fechaextraccion=="" || $fechaextraccion==null){

        this.vHoraIni= ($horainicial=="")? "" : $horainicial;
        this.vHoraFin = ($horafinal=="")? "" : $horafinal;
        this.tipoExtraccion = 0
  
        if($fechaextraccion=="" || $fechaextraccion==null){
          this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese la fecha de extracción');
        }
      }else{
        $fechaextraccion= new Date($fechaextraccion);
        this.$calcularhora($fechaextraccion,$horainicial, $horafinal, $addminuto, tipo)
      }
    }
  }

  $calcularhora($fechaextraccion: Date,$horainicial: string, $horafinal: string, $addminuto: number, tipo: number){

    let $horainicials = $horainicial.split(':');
    let horainicial =$horainicials[0];
    let minutoinicial = $horainicials[1];

    let $horafinals = $horafinal.split(':');
    let horafinal =$horafinals[0];
    let minutofinal = $horafinals[1];

    let $fechaextraccion1 = $fechaextraccion.getFullYear() + "-" + ($fechaextraccion.getMonth() + 1) + "-" + $fechaextraccion.getDate() + " " + horainicial + ":" + minutoinicial + ":" + 0;
    let $fechaextraccion2 = $fechaextraccion.getFullYear() + "-" + ($fechaextraccion.getMonth() + 1) + "-" + $fechaextraccion.getDate() + " " + horafinal + ":" + minutofinal + ":" + 0;

    let $fecha1 = new Date( $fechaextraccion1);
    let $fecha2 = new Date( $fechaextraccion2);

    if(tipo == 1){
      $fecha1.setMinutes($fecha1.getMinutes() + $addminuto);

      this.vHoraFin = `${($fecha1.getHours()<10?'0':'') + $fecha1.getHours()}:${($fecha1.getMinutes()<10?'0':'') + $fecha1.getMinutes()}`;  
    }
    else if(tipo == 2){
      let timeHora = $fecha2.getHours() - $fecha1.getHours();
      let timeMin = $fecha2.getMinutes() - $fecha1.getMinutes();

      this.tipoExtraccion = (timeHora == 0)? timeMin: ((timeHora * 60) + timeMin)
    }
  }

  changevolumen(event: any, ideHemocomponente?: number){
    var result = this.listaUnidade?.filter(y=>y.ideHemocomponente==ideHemocomponente)[0];
    result!.volumen= (event.target.value == "" ||  event.target.value == null)? 0 :  event.target.value;
  } 

  changepesototal(event: any, ideHemocomponente?: number){
    var result = this.listaUnidade?.filter(y=>y.ideHemocomponente==ideHemocomponente)[0];
    result!.pesoTotal= (event.target.value == "" ||  event.target.value == null)? 0 :  event.target.value;
  }

  changeestado(estado: boolean){
    this.descextrac = estado;
  }

  changestepper(stepper: any){
    this.currentTab = stepper._selectedIndex;
  }

  focus(name:any){
    name.focus();
    name.select();
  }

  limpiar(){
   this.inicializar();
  }

}
  

