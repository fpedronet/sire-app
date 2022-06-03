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
import { environment } from 'src/environments/environment';
import { CdetalleComponent } from '../cdetalle/cdetalle.component';

@Component({
  selector: 'app-crendicion',
  templateUrl: './crendicion.component.html',
  styleUrls: ['./crendicion.component.css']
})
export class CrendicionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  listaEstados?: Combobox[] = [];
  
  estado: string = "";
  documento: string ="";

  CodEstado: string = "0";
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  currentTab: number = 0;

  existRendicion: boolean = false;
  existDetalle: boolean = false;

  adjunto: string = '';
  nombreAdjunto: string = '';

  dataSource: RendicionD[] = [];
  displayedColumns: string[] = ['concepto', 'vFecha', 'documento', 'codMoneda', 'vMonto', 'proveedor', 'descripcion', 'comodato', 'accion', 'mo'];

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

    this.listarestados();
    
    this.inicializar();

    this.obtenerpermiso();

    this.existRendicion = this.id !== 0

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit =(data["edit"]==undefined) ? true : (data["edit"]=='true')? true : false;
      this.obtener();
    });
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

  inicializar(){
    this.form = new FormGroup({
      'ideRendicion': new FormControl({ value: 0, disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'lugar': new FormControl({ value: '', disabled: false}),
      'motivo': new FormControl({ value: '', disabled: false}),
      'ideUsuario': new FormControl({ value: 0, disabled: false}),
      'monedaRecibe': new FormControl({ value: '', disabled: true}),
      'ingresos': new FormControl({ value: 0, disabled: false}),
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
      'ideUsuRevisa': new FormControl({ value: 0, disabled: true}),
      'nombreAdjunto': new FormControl({ value: '', disabled: true})
      
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
          //debugger;
          this.existRendicion = true;
          this.form.patchValue({
            ideRendicion: data.ideRendicion,
            codigo: data.codigo,
            lugar: data.lugar,
            motivo: data.motivo,
            ideUsuario: data.ideUsuario,
            ingresos: data.ingresos,
            gastos: data.gastos,
            ideEstado: data.ideEstado,
            estado: this.listaEstados?.find(e => e.valor === data.ideEstado)?.descripcion,
            fechaCreacion: data.fechaCreacion,
            tipo: data.tipo
          });
          //debugger;
          this.estado = this.listaEstados?.find(e => e.valor === data.ideEstado)?.descripcion!;
          this.documento= data.codigo!;
          this.dataSource = data.listaDetalle!;
          //debugger;
          this.existDetalle = this.dataSource.length > 0;
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
      model.adjunto =this.adjunto;
      model.nombreAdjunto =this.nombreAdjunto;

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

  abrirDetalle(rendDet?: RendicionD){
    //debugger;
    const dialogRef =this.dialog.open(CdetalleComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data: {
        detalle: rendDet
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
        console.log(this.nombreAdjunto)
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

}
