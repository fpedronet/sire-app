import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Permiso } from 'src/app/_model/permiso';
import { RendicionM } from 'src/app/_model/rendiciones/rendicionM';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crendicion',
  templateUrl: './crendicion.component.html',
  styleUrls: ['./crendicion.component.css']
})
export class CrendicionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};
  
  nombres: string = "";
  documento: string ="";
  CodEstado: string = "0";
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  currentTab: number = 0;

  existRendicion: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private confirm : ConfimService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private rendicionService: RendicionService
  ) {
  }

  ngOnInit(): void {
    
    this.inicializar();

    this.obtenerpermiso();

    this.existRendicion = this.id !== 0

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit =(data["edit"]==undefined) ? true : (data["edit"]=='true')? true : false;
      this.obtener(0);
    });
  }

  inicializar(){
    this.form = new FormGroup({
      'ideRendicion': new FormControl({ value: 0, disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'lugar': new FormControl({ value: '', disabled: false}),
      'motivo': new FormControl({ value: '', disabled: false}),
      'monedaRecibe': new FormControl({ value: '', disabled: true}),
      'montoRecibe': new FormControl({ value: 0, disabled: false}),
      'gastos': new FormControl({ value: 0, disabled: false}),
      'fechaPresenta': new FormControl({ value: new Date(), disabled: false}),
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
      'tipo': new FormControl({ value: '', disabled: false}),
      'fechaRevisado': new FormControl({ value: new Date(), disabled: true}),
      'ideUsuRevisa': new FormControl({ value: 0, disabled: true})
    });
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  obtener(codigo: any){
    //this.spinner.showLoading();

    if(codigo!=0){
    }else{
    }

    /*this.entrevistaService.obtener(ids,cod,codigobanco).subscribe(data=>{

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
    });      */
  }

  obtenerpermiso(){
    /*this.configPermisoService.obtenerpermiso(forms.entrevista.codigo).subscribe(data=>{
      this.permiso = data;
    });*/
  }

  changestepper(stepper: any){
    this.currentTab = stepper._selectedIndex;
  }

  guardar(){
    let id = this.form.value['idePreDonante'];
    let submit = true;
    let $estado = this.CodEstado;

    if(submit){
      let model = new RendicionM();
     
      model.ideRendicion = this.form.value['ideRendicion'];
      model.lugar = this.form.value['lugar'];
      model.motivo = this.form.value['motivo'];
      model.montoRecibe = this.form.value['montoRecibe'];
      model.tipo = this.form.value['tipo'];
  
      this.$guardar(model);
    }
  }

  $guardar(model: RendicionM){
  }

  limpiar(){
    this.inicializar();
  }

}
