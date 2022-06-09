import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { RendicionD } from 'src/app/_model/rendiciones/rendicionD';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RendicionService } from 'src/app/_service/rendicion.service';
import jsonConcepto from 'src/assets/json/detalle/concepto.json';
import jsonMoneda from 'src/assets/json/detalle/moneda.json';
import jsonTipoDocu from 'src/assets/json/detalle/tipoDocu.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cdetalle',
  templateUrl: './cdetalle.component.html',
  styleUrls: ['./cdetalle.component.css']
})
export class CdetalleComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CdetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private rendicionService : RendicionService,
    private usuarioService: UsuarioService,
    private comboboxService: ComboboxService,
    private notifierService : NotifierService,
  )
  {
    //debugger;
    if(this.data.detalle !== undefined)
      this.rendDet = this.data.detalle;
    else
      this.rendDet!.ideRendicion = this.data.idPadre;

    this.edit = this.data.edit;
  }

  form: FormGroup = new FormGroup({});
  loading = true;

  codigo? : string;

  tipDocuNoDeclaracion: boolean = true;

  tablasMaestras = ['COMODATO', 'SEDE', 'LINEA'];
  tbConcepto: Combobox[] = [];
  tbTipoDocu: Combobox[] = [];
  tbMoneda: Combobox[] = [];
  tbComodato: Combobox[] = [];
  tbSede: Combobox[] = [];
  tbLinea: Combobox[] = [];

  fechaIni?: Date;
  fechaSelectIni?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  fechaMax?: Date;

  rendDet: RendicionD = new RendicionD();
  edit?: boolean = true;

  existeProveedor: boolean = false;

  ngOnInit(): void {
    this.fechaMax = new Date();
    this.inicializar();
    this.listarCombo();    
  }

  inicializar(){
    //debugger;
    var rendD = new RendicionD();
    this.form = new FormGroup({
      'ideRendicionDet': new FormControl({ value: rendD.ideRendicionDet, disabled: false}),
      'ideRendicion': new FormControl({ value: rendD.ideRendicion, disabled: false}),
      'fecha': new FormControl({ value: rendD.fecha, disabled: false}),
      'comodato': new FormControl({ value: rendD.comodato, disabled: false}),
      'ideSede': new FormControl({ value: rendD.ideSede?.toString(), disabled: false}),
      'nCodLinea': new FormControl({ value: rendD.nCodLinea, disabled: false}),
      'codConcepto': new FormControl({ value: rendD.codConcepto, disabled: false}),
      'nTipDocu': new FormControl({ value: rendD.nTipDocu, disabled: false}),
      'documento': new FormControl({ value: rendD.documento, disabled: false}),
      'codMoneda': new FormControl({ value: rendD.codMoneda, disabled: false}),
      'monto': new FormControl({ value: '', disabled: false}),
      'descripcion': new FormControl({ value: rendD.descripcion, disabled: false}),
      'rucPrv': new FormControl({ value: rendD.rucPrv, disabled: false}),
      'proveedor': new FormControl({ value: rendD.proveedor, disabled: false}),
    });
  }

  obtener(rendDet: RendicionD){
    this.form.patchValue({
      ideRendicionDet: rendDet.ideRendicionDet,
      ideRendicion: rendDet.ideRendicion,
      fecha: rendDet.fecha,
      comodato: rendDet.comodato,
      ideSede: rendDet.ideSede?.toString(),
      nCodLinea: rendDet.nCodLinea,
      codConcepto: rendDet.codConcepto,
      nTipDocu: rendDet.nTipDocu,
      documento: rendDet.documento,
      codMoneda: rendDet.codMoneda,
      monto: rendDet.monto === 0?'':rendDet.monto?.toFixed(2),
      descripcion: rendDet.descripcion,
      rucPrv: rendDet.rucPrv,
      proveedor: rendDet.proveedor
    })
  }

  listarCombo(){
    
    this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;
        //debugger;
        this.tbComodato = this.obtenerSubtabla(tbCombobox,'COMODATO');
        this.tbSede = this.obtenerSubtabla(tbCombobox,'SEDE');
        this.tbLinea = this.obtenerSubtabla(tbCombobox,'LINEA');
        //debugger;
        this.tbConcepto = this.completarCombo(jsonConcepto);
        this.tbMoneda = this.completarCombo(jsonMoneda);
        this.tbTipoDocu = this.completarCombo(jsonTipoDocu);

        this.obtener(this.rendDet);

        this.spinner.hideLoading();
      }
    });
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

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.etiqueta?.toString()?.trim() === cod);
  }

  onCheckboxChange(e: any) {
    //console.log(this.listaEstados);
  }
  
  onDateChange(){
    this.fechaIni = this.fechaSelectIni;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){
    let rendDet: RendicionD = new RendicionD();
    this.form.patchValue({
      fecha: rendDet?.fecha,
      comodato: rendDet?.comodato,
      ideSede: rendDet?.ideSede,
      nCodLinea: rendDet?.nCodLinea,
      codConcepto: rendDet?.codConcepto,
      nTipDocu: rendDet?.nTipDocu,
      documento: rendDet?.documento,
      codMoneda: rendDet?.codMoneda,
      monto: '',
      descripcion: rendDet?.descripcion,
      rucPrv: rendDet?.rucPrv,
      proveedor: rendDet?.proveedor
    })
    this.existeProveedor = false;
  }

  guardar(){
    let model = new RendicionD();
    
    model.ideRendicionDet = this.form.value['ideRendicionDet'];
    model.ideRendicion = this.form.value['ideRendicion'];
    model.fecha = this.form.value['fecha'];
    model.comodato = this.form.value['comodato'];
    model.ideSede = this.form.value['ideSede']==""?0:parseInt(this.form.value['ideSede']);
    model.codLinea = this.form.value['nCodLinea'];
    model.codConcepto = this.form.value['codConcepto'];
    model.tipDocu = this.form.value['nTipDocu'];
    model.documento = this.form.value['documento'];
    model.codMoneda = this.form.value['codMoneda'];
    model.monto = this.form.value['monto'] === ''?0:this.form.value['monto'];
    model.descripcion = this.form.value['descripcion'];
    model.rucPrv = this.form.value['rucPrv'];
    model.proveedor = this.form.value['proveedor'];
    //debugger;

    this.spinner.showLoading();

    this.rendicionService.guardarDet(model).subscribe(data=>{
      //debugger;
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){      
        this.spinner.hideLoading();
      }else{
        this.spinner.hideLoading();
      }
    });
    
    this.dialogRef.close();
  }

  reiniciaProveedor(){
    this.form.patchValue({
      proveedor: '',
      rucPrv: ''
    })
    this.existeProveedor = false;
  }

  obtenerProveedorEnter(key: number){
    if(key === 13){
      this.obtenerProveedor();
    }
  }

  obtenerProveedor(e?: Event){
    //console.log(e);
    e?.preventDefault(); // Evita otros eventos como blur

    this.comboboxService.obtenerProveedor(this.form.value['rucPrv']).subscribe(data=>{
      //debugger;
      if(data!== undefined && data.valor !== null){
        this.form.patchValue({
          proveedor: data.descripcion
        })
        this.existeProveedor = true;
      }
    })
  }

  selectcomodato(valor: string){
    var comodato = this.tbComodato.find(e => e.valor === valor);
    var linea = this.tbLinea.find(e => e.valor === comodato!.aux1); //CodLin
    if(linea !== undefined){
      this.form.patchValue({
        nCodLinea: linea.valor
      })

      var sede = this.tbSede.find(e => e.aux1 === comodato!.aux2); //Ruc
      if(sede !== undefined){
        this.form.patchValue({
          ideSede: sede.valor
        })
      }
    }
  }
}
