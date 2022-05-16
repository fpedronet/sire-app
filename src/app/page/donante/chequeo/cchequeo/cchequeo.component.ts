import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { ChequeofisicoService } from 'src/app/_service/donante/chequeofisico.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Combobox } from 'src/app/_model/combobox';
import { ChequeoFisico } from 'src/app/_model/donante/chequeofisico';
import { Permiso } from 'src/app/_model/permiso';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-cchequeo',
  templateUrl: './cchequeo.component.html',
  styleUrls: ['./cchequeo.component.css']
})
export class CchequeoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};
  
  motivoRec = new FormControl();
  listaMotivoRechazo!: Observable<Combobox[]>;

  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoGeneral?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];
  listaMotivoRechazo2?: Combobox[] = [];

  nombres: string = "";
  documento: string ="";
  CodEstado: string = "";
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  btndisable: boolean = false;
  btnestado:boolean = false;
  ideMotivoRec: number = 0;
  InputValue: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private chequeofisicoService: ChequeofisicoService,
  ) { }

  ngOnInit(): void {

    this.inicializar();

    this.obtenerpermiso();

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : (data["edit"]=='true')? true : false;
      this.btndisable = (this.id==0)? false: true;
      this.obtener(0);
    });

    this.listaMotivoRechazo = this.motivoRec.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterMotivoRechazo(state) : this._filterMotivoRechazo(""))),
    );
  }

  inicializar(){
    this.form = new FormGroup({
      'idePreDonante': new FormControl({ value: 0, disabled: false}),
      'tipoExtraccion': new FormControl({ value: '', disabled: true}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'fecha': new FormControl({ value: new Date(), disabled: false}),
      'pesoDonacion': new FormControl({ value: '', disabled: false}),
      'tallaDonacion': new FormControl({ value: '', disabled: false}),
      'hemoglobina': new FormControl({ value: '', disabled: false}),
      'hematocrito': new FormControl({ value: '', disabled: false}),
      'plaquetas': new FormControl({ value: '', disabled: false}),
      'presionArterial1': new FormControl({ value: '', disabled: false}),
      'presionArterial2': new FormControl({ value: '', disabled: false}),
      'presionArterial': new FormControl({ value: '', disabled: false}),
      'frecuenciaCardiaca': new FormControl({ value: '', disabled: false}),
      'ideGrupo': new FormControl({ value: '', disabled: false}),
      'aspectoGeneral': new FormControl({ value: '', disabled: false}),
      'lesionesVenas': new FormControl({ value: '', disabled: false}),
      'estadoVenoso': new FormControl({ value: '', disabled: false}),
      'obsedrvaciones': new FormControl({ value: '', disabled: false}),
      'temperatura': new FormControl({ value: '', disabled: false})
    });

    this.CodEstado = "0";
  }
  
  obtener(codigo: any){

    this.spinner.showLoading();
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
    let ids=0;
    let cod=0;
    this.nombres = "";
    this.documento = "";

    if(codigo!=0){
      cod = (codigo.target.value==0)? this.id: codigo.target.value;
      cod = (cod==undefined)? this.form.value['codigo']: cod;
      //debugger;
      if(!this.esEntero(cod.toString())){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','El código ingresado no es válido');
        this.spinner.hideLoading();
        return;
      }
      this.$disable = false;
    }else{
      ids=  this.id;
      this.$disable = true;
    }

    this.chequeofisicoService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaLesionesPuncion = data.listaLesionesPuncion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaAspectoGeneral = data.listaAspectoGeneral;
      this.listaAspectoVenoso = data.listaAspectoVenoso;
      this.listaMotivoRechazo2 = data.listaMotivoRechazo;

      if(ids!=0 || cod!=0){

        let aterrial1='';
        let aterrial2='';
        if(data.presionArterial!="" && data.presionArterial!=null){
          let aterrial= data.presionArterial?.split('/');
  
          if(aterrial!.length>1){
            aterrial1= aterrial![0];
            aterrial2= aterrial![1];
          }
        }
     
        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'tipoExtraccion': new FormControl({ value: data.tipoExtraccion, disabled: true}),
          'codigo': new FormControl({ value: data.codigo, disabled: this.$disable}),
          'fecha': new FormControl({ value: data.fecha, disabled: !this.edit}),
          'pesoDonacion': new FormControl({ value: data.pesoDonacion, disabled: !this.edit}),
          'tallaDonacion': new FormControl({ value: data.tallaDonacion, disabled: !this.edit}),
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: !this.edit}),
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: !this.edit}),
          'plaquetas': new FormControl({ value: data.plaquetas, disabled: !this.edit}),
          'presionArterial1': new FormControl({ value: aterrial1, disabled: !this.edit}),
          'presionArterial2': new FormControl({ value: aterrial2, disabled: !this.edit}),
          'presionArterial': new FormControl({ value: data.presionArterial, disabled: !this.edit}),
          'frecuenciaCardiaca': new FormControl({ value: data.frecuenciaCardiaca, disabled: !this.edit}),
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: !this.edit}),
          'aspectoGeneral': new FormControl({ value: data.aspectoGeneral, disabled: !this.edit}),
          'lesionesVenas': new FormControl({ value: data.lesionesVenas, disabled: !this.edit}),
          'estadoVenoso': new FormControl({ value: data.estadoVenoso, disabled: !this.edit}),
          'obsedrvaciones': new FormControl({ value: data.obsedrvaciones, disabled: !this.edit}),
          'temperatura': new FormControl({ value: data.temperatura, disabled: !this.edit})
        });

        this.Codigo = data.codigo;
        this.CodEstado = (data.codEstado!=null)? data.codEstado!.toString()! : "0";
        this.btnestado = (this.CodEstado== "2")? true : false;
        this.nombres = data.nombres!;
        this.documento = data.documento!;

        if(!this.edit){
          this.motivoRec.disable();
        }else{
          this.motivoRec.enable();
        }

        this.ideMotivoRec = (this.CodEstado== '2')? data.ideMotivoRec! : 0;

        if(this.ideMotivoRec!=0){
          var distFind = this.listaMotivoRechazo2!.find(e => e.codigo === this.ideMotivoRec.toString());
          let setMotivo: Combobox = distFind!;
         
          this.motivoRec.setValue(setMotivo);
        }

        if(data.idePreDonante==0 || data.idePreDonante==null){
          this.notifierService.showNotification(environment.ALERT,'Mensaje','El código al que hace referencia no existe');
        }

      }

      this.spinner.hideLoading();
    });      
  }

  esEntero(cadena: string){
    const regex = /^[0-9]+$/;
    return regex.test(cadena);
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.chequeo.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  changeestado(estado: string){
    if(!this.btnestado){
      this.CodEstado= estado;
    }else{
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Cuando el estado es NO APTO, no se podra cambiar');
    }
  }

  guardar(){
      let $id = this.form.value['idePreDonante'];
      let peso = Number(this.form.value['pesoDonacion']);
      let talla = Number(this.form.value['tallaDonacion']);
      let presion1 = Number(this.form.value['presionArterial1']);
      let presion2 = Number(this.form.value['presionArterial2']);
      let $ideMotivoRec =  (this.motivoRec.value ==null)? 0 : ((this.motivoRec.value.codigo==undefined || this.motivoRec.value.codigo==null || this.motivoRec.value.codigo=="")? 0 : parseInt(this.motivoRec.value.codigo));
      let hemoglobina = Number(this.form.value['hemoglobina']);
      let hematocrito = Number(this.form.value['hematocrito']);
      let plaqueta =  Number(this.form.value['plaquetas']);
      let frecardiaca = Number(this.form.value['frecuenciaCardiaca']);
      let temperatura= Number(this.form.value['temperatura']);
      let submit = true;

      if($id==null  || $id== "" || $id==0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje', 'El código al que hace referencia no existe');
      }
      else if(this.CodEstado=="2" && ($ideMotivoRec==undefined || $ideMotivoRec==0 )){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje', 'Seleccione el motivo del rechazo');
      }
      else if(peso<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','El peso no puede ser menor a 0');
      }
      else if(talla<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La talla no puede ser menor a 0');
      }
      else if(presion1<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La medida sistolica no puede ser menor a 0');
      }
      else if(presion2<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La medida diastolica no puede ser menor a 0');
      }
      else if(hemoglobina<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La hemoglobina no puede ser menor a 0');
      }
      else if(hematocrito<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','El hematocrito no puede ser menor a 0');
      }
      else if(plaqueta<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La plaqueta no puede ser menor a 0');
      }
      else if(frecardiaca<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La frecuencia cardiaca no puede ser menor a 0');
      }
      else if(temperatura<0){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La temperatura no puede ser menor a 0');
      }

      let valTalla = this.numeroEntero(this.form.value['tallaDonacion']);

      if(valTalla=="entero"){
        submit = false;
        this.notifierService.showNotification(environment.ALERT,'Mensaje', 'La talla ingresada es incorrecta');
      }

      if(submit){
        let model = new ChequeoFisico();

        model.idePreDonante= this.form.value['idePreDonante'];
        model.codigo= this.Codigo;
        model.fecha= this.form.value['fecha'];
        model.pesoDonacion= Number(this.form.value['pesoDonacion']);
        model.tallaDonacion= Number(this.form.value['tallaDonacion']);
        model.hemoglobina= Number(this.form.value['hemoglobina']);
        model.hematocrito= Number(this.form.value['hematocrito']);
        model.plaquetas= Number(this.form.value['plaquetas']);
        model.presionArterial= this.form.value['presionArterial1'] + "/" + this.form.value['presionArterial2'];
        model.frecuenciaCardiaca= Number(this.form.value['frecuenciaCardiaca']);
        model.ideGrupo= this.form.value['ideGrupo'];
        model.aspectoGeneral= this.form.value['aspectoGeneral'];
        model.lesionesVenas= this.form.value['lesionesVenas'];
        model.estadoVenoso= this.form.value['estadoVenoso'];
        model.obsedrvaciones= this.form.value['obsedrvaciones'];
        model.temperatura= Number(this.form.value['temperatura']);
        model.codEstado=  this.CodEstado;
        model.ideMotivoRec= $ideMotivoRec;
        model.aceptaAlarma= "0";

        this.spinner.showLoading();
        this.chequeofisicoService.guardar(model).subscribe(data=>{
  
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
          if(data.typeResponse==environment.EXITO){
            this.router.navigate(['/page/donante/aspirante']);
            this.spinner.hideLoading();
          }else{
            this.spinner.hideLoading();
          }
        });

      }
  }

  focus(name:any){
      name.focus();
      name.select();
  }

  limpiar(){
    this.inicializar();
  }

  mostrarMotivoRechazo(d: Combobox): string{
    var result = '';
    if(d !== undefined && d !== null && d !== '' && d?.descripcion !== '')
      result = d?.descripcion!;
    return result;
  }

  changeMotivoReachazo(event: any){
    var value = event.option.value;
    if(value !== undefined){
      this.ideMotivoRec = parseInt(value.codigo);
    }
  }

  numeroEntero(numero: any){
    if (isNaN(numero) || numero==null){
      // no es un número.
      return "";
    } else {
        if (numero % 1 == 0) {
          // Es un numero entero
          return "entero";
        } else {
          // Es un numero decimal
          return "decimal";
        }
    }

}

  private _filterMotivoRechazo(value: any){
    let filterValue = value.descripcion == undefined ? value.toLowerCase() : value.descripcion.toLowerCase();
    return this.listaMotivoRechazo2!.filter(state => state.descripcion!.toLowerCase().includes(filterValue));
  }
}
