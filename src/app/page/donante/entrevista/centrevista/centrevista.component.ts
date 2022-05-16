import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { EntrevistaService } from 'src/app/_service/donante/entrevista.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Combobox } from 'src/app/_model/combobox';
import { Pregunta } from 'src/app/_model/donante/pregunta';
import { Entrevista } from 'src/app/_model/donante/entrevista';
import { environment } from 'src/environments/environment';
import { Permiso } from 'src/app/_model/permiso';
import { MatDialog } from '@angular/material/dialog';
import { MdiferidoComponent } from '../mdiferido/mdiferido.component';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-centrevista',
  templateUrl: './centrevista.component.html',
  styleUrls: ['./centrevista.component.css']
})
export class CentrevistaComponent implements OnInit {
  
  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  motivoRec = new FormControl();
  listaMotivoRechazo!: Observable<Combobox[]>;

  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];
  listaPregunta?: Pregunta[] = [];
  listaMotivoRechazo2?: Combobox[] = [];

  nombres: string = "";
  documento: string ="";
  CodEstado: string = "0";
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  btnaceptado: boolean = false;
  btnrechazado: boolean = false;
  btndisable: boolean = false;
  currentTab: number = 0;
  confirmado: boolean = false;
  fechaHasta?: Date;
  periodo: string = "";
  ideMotivoRec: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private confirm : ConfimService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private entrevistaService: EntrevistaService
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

    this.listaMotivoRechazo = this.motivoRec.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterMotivoRechazo(state) : this._filterMotivoRechazo(""))),
    );
  }

  inicializar(){
    this.form = new FormGroup({
      'idePreDonante': new FormControl({ value: '', disabled: false}),
      'idePersona': new FormControl({ value: '', disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'pesoDonacion': new FormControl({ value: '', disabled: true}),
      'hemoglobina': new FormControl({ value: '', disabled: true}),
      'nIdTipoProceso': new FormControl({ value: '', disabled: false}),
      'tallaDonacion': new FormControl({ value: '', disabled: true}),
      'hematocrito': new FormControl({ value: '', disabled: true}),
      'tipoExtraccion': new FormControl({ value: '', disabled: true}),
      'ideGrupo': new FormControl({ value: '', disabled: true}),
      'estadoVenoso': new FormControl({ value: '', disabled: true}),
      'lesionesVenas': new FormControl({ value: '', disabled: true}),
      'fechaMed': new FormControl({ value: new Date(), disabled: false}),
      'observacionesMed': new FormControl({ value: '', disabled: false}),
    });

    this.btnaceptado= false;
    this.btnrechazado= false;
    this.listaPregunta = [];
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
      this.$disable = false;
    }else{
      ids=  this.id;
      this.$disable = true;
    }

    this.entrevistaService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaLesionesPuncion = data.listaLesionesPuncion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaAspectoVenoso = data.listaAspectoVenoso;
      this.listaPregunta = data.listaPregunta;
      this.listaMotivoRechazo2 = data.listaMotivoRechazo;

      if(ids!=0 || cod!=0){

        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'idePersona': new FormControl({ value: data.idePersona, disabled: false}),
          'codigo': new FormControl({ value: data.codigo, disabled: this.$disable}),
          'pesoDonacion': new FormControl({ value: data.pesoDonacion, disabled: true}),
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: true}),
          'nIdTipoProceso': new FormControl({ value: data.nIdTipoProceso, disabled: !this.edit}),
          'tallaDonacion': new FormControl({ value: data.tallaDonacion, disabled: true}),
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: true}),
          'tipoExtraccion': new FormControl({ value: data.tipoExtraccion, disabled: true}),
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: true}),
          'estadoVenoso': new FormControl({ value: data.estadoVenoso, disabled: true}),
          'lesionesVenas': new FormControl({ value: data.lesionesVenas, disabled: true}),
          'fechaMed': new FormControl({ value: new Date(), disabled: !this.edit}),
          'observacionesMed': new FormControl({ value: data.observacionesMed, disabled: !this.edit}),
        });
      
        this.Codigo = data.codigo;
        this.CodEstado = (data.codEstado!=null)? data.codEstado!.toString()! : "0";
        this.nombres = data.nombres!;
        this.documento = data.documento!;

        if(this.CodEstado=="1"){
          this.btnaceptado= true;
          this.btnrechazado= false;
        }else if (this.CodEstado=="2"){
          this.btnaceptado= false;
          this.btnrechazado= true;
        }else{
          this.btnaceptado= false;
          this.btnrechazado= false;
        }

        if(!this.edit){
          this.motivoRec.disable();
        }else{
          this.motivoRec.enable();
        }

        this.ideMotivoRec = (this.btnrechazado==false)? 0: data.ideMotivoRec!;

        if(this.ideMotivoRec!=0 && this.ideMotivoRec!=null){
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

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.entrevista.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  changeestado(estado: string, btn: string){
    this.CodEstado= estado;
    this.confirmado =false;

    if(btn=="btn1"){
      this.btnaceptado= true;
      this.btnrechazado= false;
    }else if(btn=="btn2"){
      this.btnaceptado= false;
      this.btnrechazado= true;
    }
  }

  changeestadopregunta(estado: string, idePregunta?: number){
    var result = this.listaPregunta?.filter(y=>y.idePregunta==idePregunta)[0];
    result!.respuesta= estado;
  }

  changeestadopregunta2(event: any, idePregunta?: number){
    var result = this.listaPregunta?.filter(y=>y.idePregunta==idePregunta)[0];
    result!.respuesta= (event.target.value=="")? null : event.target.value;
  }

  changeobservacion(event: any, idePregunta?: number){
    var result = this.listaPregunta?.filter(y=>y.idePregunta==idePregunta)[0];
    result!.observacion= (event.target.value=="")? null : event.target.value;
  }

  changestepper(stepper: any){
    this.currentTab = stepper._selectedIndex;
  }

  guardar(){
    let id = this.form.value['idePreDonante'];
    let submit = true;
    let $estado = this.CodEstado;
    let $ideMotivoRec = (this.motivoRec.value ==null)? 0 : ((this.motivoRec.value.codigo==undefined || this.motivoRec.value.codigo==null || this.motivoRec.value.codigo=="")? 0 : parseInt(this.motivoRec.value.codigo));

    if(id==null || id=="" || id==0){
      submit = false;
      this.currentTab = 0;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','El código al que hace referencia no existe');
    }
    else if($estado=="0"){
      submit = false;
      this.currentTab = 0;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Seleccione un estado APTO/NO APTO');
    }
    else if(this.CodEstado=="2" && ($ideMotivoRec==undefined || $ideMotivoRec==0 )){
      submit = false;
      this.notifierService.showNotification(environment.ALERT,'Mensaje', 'Seleccione el motivo del rechazo');
    }

    if(submit){
      let model = new Entrevista();
     
      model.idePreDonante= this.form.value['idePreDonante'];
      model.idePersona= this.form.value['idePersona'];
      model.codigo= this.Codigo;
      model.fechaMed= this.form.value['fechaMed'];
      model.observacionesMed= this.form.value['observacionesMed'];
      model.codEstado= this.CodEstado;
      model.ideMotivoRec= (this.btnrechazado==false)? 0: $ideMotivoRec;
      model.listaPregunta = this.listaPregunta;
  
      let $pregunta = this.listaPregunta?.filter(x=>x.respuesta==null);

      if($pregunta?.length! > 0 && this.confirmado==false){
          let $listaPregunta = new Array;

          $pregunta?.forEach(x=>{
            $listaPregunta.push(x.idePregunta);
          });
         
          let $msg= "Preguntas = " + $listaPregunta.join(',');
          
          this.confirm.openConfirmDialog(false,"Preguntas sin contestar", $msg!,".", "Desea finalizar el cuestionario").afterClosed().subscribe(res =>{
            if(res){
              this.$guardar(model);
            }
          });
      }else{
            this.$guardar(model);
      }
    }
  }

  $guardar(model:Entrevista){
    if(model.ideMotivoRec!=0 && this.confirmado==false){
      this.abrirModal(model.ideMotivoRec);
    }else{

      model.fechaHasta = (this.btnrechazado==false)? undefined: this.fechaHasta;
      model.periodo = (this.btnrechazado==false)? "": this.periodo;

      this.spinner.showLoading();
      this.entrevistaService.guardar(model).subscribe(data=>{
  
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

  limpiar(){
    this.inicializar();
  }

  abrirModal(ideMotivoRec?: number){
  
    let $id = ideMotivoRec?.toString();
    let $motivo = this.listaMotivoRechazo2?.filter(x=>x.codigo==$id)[0];

    const dialogRef =this.dialog.open(MdiferidoComponent, {
      panelClass: 'full-screen-modal',
      data: {
        periodo: $motivo!.codAsocia!, 
        dias: $motivo!.dias!
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.confirmado= res.confirmado;
        this.fechaHasta= res.fechaHasta;
        this.periodo= res.periodo;
        this.guardar();
      }
    });
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

  private _filterMotivoRechazo(value: any){
    let filterValue = value.descripcion == undefined ? value.toLowerCase() : value.descripcion.toLowerCase();
    return this.listaMotivoRechazo2!.filter(state => state.descripcion!.toLowerCase().includes(filterValue));
  }
  
}
