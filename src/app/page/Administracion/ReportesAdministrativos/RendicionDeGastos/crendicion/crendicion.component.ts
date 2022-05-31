import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Permiso } from 'src/app/_model/permiso';
import { RendicionD } from 'src/app/_model/rendiciones/rendicionD';
import { RendicionM } from 'src/app/_model/rendiciones/rendicionM';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import forms from 'src/assets/json/formulario.json';
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

  listaDetalle: RendicionD[] = [];

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
      this.obtener();
    });
  }

  inicializar(){
    this.form = new FormGroup({
      'ideRendicion': new FormControl({ value: 0, disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'lugar': new FormControl({ value: '', disabled: false}),
      'motivo': new FormControl({ value: '', disabled: false}),
      'ideUsuario': new FormControl({ value: 0, disabled: false}),
      'monedaRecibe': new FormControl({ value: '', disabled: true}),
      'montoRecibe': new FormControl({ value: 0, disabled: false}),
      'gastos': new FormControl({ value: 0, disabled: false}),
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
      'ideUsuRevisa': new FormControl({ value: 0, disabled: true})
    });
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  obtener(){
    if(this.id > 0){
      this.spinner.showLoading();
      this.rendicionService.obtener(this.id).subscribe(data=>{
        if(data!== undefined && data.ideRendicion !== 0){
          this.form.patchValue({
            ideRendicion: data.ideRendicion,
            codigo: data.codigo,
            lugar: data.lugar,
            motivo: data.motivo,
            ideUsuario: data.ideUsuario,
            montoRecibe: data.montoRecibe,
            fechaPresenta: data.vFechaPresenta,
            ideEstado: data.ideEstado,
            estado: 'a',
            fechaCreacion: data.vFechaCreacion,
            tipo: data.tipo
          });
        }
        this.spinner.hideLoading();
      });
    }
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.rendicionGasto.codigo).subscribe(data=>{
      this.permiso = data;
    }); 
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
      model.montoRecibe = this.form.value['montoRecibe'];
      model.tipo = this.form.value['tipo'];
  
      this.spinner.showLoading();
      //debugger;
      this.rendicionService.guardar(model).subscribe(data=>{
  
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
          if(data.typeResponse==environment.EXITO){
            this.existRendicion = true;
            this.currentTab = 1; //Segunda pestaña            
            this.spinner.hideLoading();
          }else{
            this.spinner.hideLoading();
          }
        });
    }

  limpiar(){
    this.inicializar();
  }

}
