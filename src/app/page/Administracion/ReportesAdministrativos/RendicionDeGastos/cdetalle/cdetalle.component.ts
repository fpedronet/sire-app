import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { map, Observable, startWith } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import {Html5Qrcode} from "html5-qrcode";
import { SharepointService } from 'src/app/_service/apiexterno/sharepoint.service';

@Component({
  selector: 'app-cdetalle',
  templateUrl: './cdetalle.component.html',
  styleUrls: ['./cdetalle.component.css']
})
export class CdetalleComponent implements OnInit {

  @ViewChild('COMODATO') comboCmd: any;

  scannerEnabled: boolean = false;
  public qrcode:string = '';    
  public windowsWidth:string = `${window.innerWidth > 500 ? 500 : window.innerWidth}px`;

  html5QrCodes! : any;
  private cameraId! : any;
  public output!: string;

  @ViewChild('video', {}) videoElement!: ElementRef;
  @ViewChild('canvas', {}) canvas!: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<CdetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private rendicionService : RendicionService,
    private usuarioService: UsuarioService,
    private comboboxService: ComboboxService,
    private notifierService : NotifierService,
    private sharepointService : SharepointService
  )
  {
    //debugger;
    if(this.data.detalle !== undefined)
      this.rendDet = this.data.detalle;
    else
      this.rendDet!.ideRendicion = this.data.idPadre;

    this.edit = this.data.edit;
    this.tipo = this.data.tipoPadre;
    this.codigo = this.data.codigo;
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
  filterComodato: Combobox[] = [];

  carBuscaAuto: number = 2;
  nroMuestraAuto: number = 15;

  tbSede: Combobox[] = [];  
  sedeColor: string = 'warn';
  filterSedes: Observable<Combobox[]> | undefined;
  controlSedes = new FormControl();
  ideSede: number = 0;

  tbLinea: Combobox[] = [];
  lineaColor: string = 'warn';
  filterLineas: Observable<Combobox[]> | undefined;
  controlLineas = new FormControl();
  codLinea: string = '';

  tipo: string = '';

  videoDevices: MediaDeviceInfo[] = [];

  fechaIni?: Date;
  fechaSelectIni?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  fechaMax?: Date;

  rendDet: RendicionD = new RendicionD();
  edit?: boolean = true;
  qr:string = "none;";
  body:string = "block;";
  existeProveedor: boolean = false;

  existCambio: boolean = false;
  adjunto: string = '';
  nombreAdjunto: string = '';
  url: string = ''
  url_M: string = ''

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
      'codConcepto': new FormControl({ value: rendD.codConcepto, disabled: false}),
      'nTipDocu': new FormControl({ value: rendD.nTipDocu, disabled: false}),
      'documento': new FormControl({ value: rendD.documento, disabled: false}),
      'codMoneda': new FormControl({ value: rendD.codMoneda, disabled: false}),
      'monto': new FormControl({ value: '', disabled: false}),
      'descripcion': new FormControl({ value: rendD.descripcion, disabled: false}),
      'rucPrv': new FormControl({ value: rendD.rucPrv, disabled: false}),
      'proveedor': new FormControl({ value: rendD.proveedor, disabled: false}),
      'nombreAdjunto': new FormControl({ value: rendD.nombreAdjunto, disabled: false}),
    });
  }

  obtener(rendDet: RendicionD){

    //Si es un registro nuevo, carga caché en campos
    if(rendDet.ideRendicionDet === 0){
      let filtro = this.usuarioService.sessionDetalle();
      if(filtro!=null){
        rendDet.comodato = filtro[0];
        rendDet.ideSede = filtro[1] === '' ? 0 : parseInt(filtro[1]);
        rendDet.nCodLinea = filtro[2];
        rendDet.codMoneda = filtro[3];
      }
    }

    this.form.patchValue({
      ideRendicionDet: rendDet.ideRendicionDet,
      ideRendicion: rendDet.ideRendicion,
      fecha: rendDet.fecha,
      comodato: rendDet.comodato,
      codConcepto: rendDet.codConcepto,
      nTipDocu: rendDet.nTipDocu,
      documento: rendDet.documento,
      codMoneda: rendDet.codMoneda,
      monto: rendDet.monto === 0?'':rendDet.monto?.toFixed(2),
      descripcion: rendDet.descripcion,
      rucPrv: rendDet.rucPrv,
      proveedor: rendDet.proveedor
    })
  
    this.existCambio = false;
    this.nombreAdjunto = rendDet.nombreAdjunto!;
    this.url = rendDet.url!;
    this.url_M = rendDet.url_M!;

    var sedeFind = this.tbSede.find(e => e.valor === rendDet.ideSede?.toString()); //Ruc
    if(sedeFind !== undefined){
      var sede: Combobox = sedeFind;      
      this.setCurSede(sede);
    }
    var lineaFind = this.tbLinea.find(e => e.valor === rendDet.nCodLinea); //CodLin
    if(lineaFind !== undefined){
      var linea: Combobox = lineaFind;      
      this.setCurLinea(linea);
    }
  }

  listarCombo(){
    this.spinner.showLoading();
    
    this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;
        
        this.tbComodato = this.obtenerSubtabla(tbCombobox,'COMODATO');
        this.filterComodato = this.tbComodato;

        this.tbSede = this.obtenerSubtabla(tbCombobox,'SEDE');
        this.filterSedes = this.controlSedes.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string'?value:value.descripcion)),
          map(name  => (name?this.buscarSedes(name):[]))
        )

        this.tbLinea = this.obtenerSubtabla(tbCombobox,'LINEA');
        this.filterLineas = this.controlLineas.valueChanges.pipe(
          startWith(''),
          map(value2 => (typeof value2 === 'string'?value2:value2.descripcion)),
          map(name2  => (name2?this.buscarLineas(name2):[]))
        )
        
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

  buscarSedes(name: string): Combobox[]{
    this.setCurSede(undefined, true);
    var results: Combobox[] = [];
    //debugger;
    if(name.length >= this.carBuscaAuto){
      var filtro = name.toLowerCase();
      results = this.tbSede.filter(e => e.descripcion?.toLowerCase().includes(filtro));
    }    
    return results.slice(0,this.nroMuestraAuto);
  }

  buscarLineas(name: string): Combobox[]{
    this.setCurLinea(undefined, true);
    var results: Combobox[] = [];
    //debugger;
    if(name.length >= this.carBuscaAuto){
      var filtro = name.toLowerCase();
      results = this.tbLinea.filter(e => e.descripcion?.toLowerCase().includes(filtro));
    }    
    return results.slice(0,this.nroMuestraAuto);
  }
  
  onDateChange(){
    this.fechaIni = this.fechaSelectIni;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){
    let rendDet: RendicionD = new RendicionD();
    rendDet.ideRendicion = this.data.idPadre;

    let filtro = this.usuarioService.sessionDetalle();
    if(filtro!=null){
      rendDet.comodato = filtro[0];
      rendDet.ideSede = filtro[1] === '' ? 0 : parseInt(filtro[1]);
      rendDet.nCodLinea = filtro[2];
      rendDet.codMoneda = filtro[3];
    }

    this.form.patchValue({
      fecha: rendDet?.fecha,
      comodato: rendDet?.comodato,
      //ideSede: rendDet?.ideSede,
      //nCodLinea: rendDet?.nCodLinea,
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
    this.filterComodato = this.tbComodato;
    this.setCurSede(undefined);
    this.setCurLinea(undefined);
  }

  guardar(){
    let model = new RendicionD();
    
    model.ideRendicionDet = this.form.value['ideRendicionDet'];
    model.ideRendicion = this.form.value['ideRendicion'];
    model.fecha = this.form.value['fecha'];
    model.comodato = this.form.value['comodato'];

    model.ideSede = this.ideSede;

    model.codLinea = this.codLinea;

    model.codConcepto = this.form.value['codConcepto'];
    model.tipDocu = this.form.value['nTipDocu'];
    model.documento = this.form.value['documento'];
    model.codMoneda = this.form.value['codMoneda'];
    model.monto = this.form.value['monto'] === ''?0:this.form.value['monto'];
    model.descripcion = this.form.value['descripcion'];
    model.rucPrv = this.form.value['rucPrv'];
    model.proveedor = this.form.value['proveedor'];

    model.codigo = this.codigo;
    model.emailEmp = this.usuarioService.sessionUsuario()?.emailEmp;
    model.password = this.usuarioService.sessionUsuario()?.contraseniaSharepoint;
    model.adjunto = this.adjunto;
    model.url = this.url;
    model.url_M = this.url_M;
    model.nombreAdjunto = this.nombreAdjunto;

    this.spinner.showLoading();

    this.rendicionService.guardarDet(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){      
        this.spinner.hideLoading();

        //Guarda caché de valores ingresados
        localStorage.setItem(environment.CODIGO_DETALLE, 
          (model.comodato === undefined ? '' : model.comodato) + "|" +
          (model.ideSede === undefined ? '' : model.ideSede?.toString()) + "|" +
          (model.codLinea === undefined ? '' : model.codLinea) + "|" +
          (model.codMoneda === undefined ? '' : model.codMoneda)
        );
        
        this.dialogRef.close();
      }else{
        this.spinner.hideLoading();
      }
    });    
    
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
    var lineaFind = this.tbLinea.find(e => e.valor === comodato!.aux1); //CodLin
    if(lineaFind !== undefined){
      var linea: Combobox = lineaFind;
      this.setCurLinea(linea);

      var sedeFind = this.tbSede.find(e => e.aux1 === comodato!.aux2); //Ruc
      if(sedeFind !== undefined){
        var sede: Combobox = sedeFind;
        this.setCurSede(sede);
      }
    }
  }

  mostrarAutoCombo(c: Combobox): string{
    var result = '';
    if(c !== undefined && c !== null && c.descripcion !== '')
      result = c.descripcion!;
    return result;
  }

  setCurSede(sede?: Combobox, notControl: boolean = false){
    //debugger;
    if(sede === undefined){
      if(!notControl)
        this.controlSedes.setValue(new Combobox());
      this.ideSede = 0;
      this.sedeColor = 'warn';

      this.filterComodato = this.tbComodato
    }
    else{
      if(!notControl)
        this.controlSedes.setValue(sede);
      this.ideSede = sede.valor! === ''? 0 : parseInt(sede.valor!);
      this.sedeColor = 'primary';

      this.filtrarComodatos(sede.aux1!) //Ruc
    }
  }

  filtrarComodatos(ruc: string){
    //debugger;
    this.filterComodato = this.tbComodato.filter(e => e.aux2 === ruc || e.valor === 'CMD');
    if(this.filterComodato.length === 1) //Solo Ninguno
      this.filterComodato = this.tbComodato;
    //else
    //  this.comboCmd.open();
  }

  changeSede(event: any){
    var sede = event.option.value;
    if(sede !== undefined){
      this.setCurSede(sede, true)
    }
  }

  setCurLinea(linea?: Combobox, notControl: boolean = false){
    if(linea === undefined){
      if(!notControl)
        this.controlLineas.setValue(new Combobox());
      this.codLinea = '';
      this.lineaColor = 'warn';
    }
    else{
      if(!notControl)
        this.controlLineas.setValue(linea);
      this.codLinea = linea.valor!;
      this.lineaColor = 'primary';
    }
  }

  changeLinea(event: any){
    var linea = event.option.value;
    if(linea !== undefined){
      this.setCurLinea(linea, true)
    }
  }


  subirArchivo(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.adjunto = imgBase64Path;
          this.nombreAdjunto = fileInput.target.files[0].name;
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  borrarAdjunto(){
    this.existCambio = true;
    this.url = "";
    this.url_M = "";
    this.nombreAdjunto = "";
    this.adjunto = "";
  }

  getCameras() {
    // alert("paso alert 1");
    Html5Qrcode.getCameras().then((devices:any[]) => {    
      
      // alert(devices.length);
      if (devices && devices.length) {
       
        if(devices.length>=3){
          this.cameraId = devices[2].id;
        }
        else if(devices.length==2){
          this.cameraId = devices[1].id;
        }
        else if(devices.length==1){
          this.cameraId = devices[0].id;
        }
        this.enableScanner();
      }
    })
  }

  enableScanner() {   
    const html5QrCode = new Html5Qrcode("reader", true);

    this.html5QrCodes = html5QrCode;
    this.scannerEnabled = true;
    this.body = "none;";

    html5QrCode.start(
      this.cameraId, 
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      },   
      (decodedText, decodedResult) => {
        this.setearValores(decodedText);
        this.disableScanner()
      },
      (errorMessage) => {
      })
    .catch((err) => {
    });
  }

  disableScanner() {
    this.scannerEnabled = false;
    this.body = "block;";

    if(this.html5QrCodes!=undefined){
      this.html5QrCodes.stop().then(() => {
      }).catch(() => {
      });
    }
  }

  setearValores($event : string){
    this.body = "block;";

    let tt_filas= $event.split('|');

    if(tt_filas.length > 0)
    {
      for (let i = 0; i < tt_filas.length; i++) 
      {
        switch(i + 1)
        {
          case 1:
            this.rendDet.rucPrv = tt_filas[i].trim();
            this.comboboxService.obtenerProveedor(this.rendDet.rucPrv!).subscribe(data=>{
              if(data!== undefined && data.valor !== null){
                this.rendDet.proveedor= data.descripcion?.trim()
              }
              this.obtener(this.rendDet);
            })
            break;
          case 2:
            if (tt_filas[i].trim() == "01" || tt_filas[i].trim() == "1" || tt_filas[i].trim() == "F")
            {
              this.rendDet.nTipDocu = "001";
            }
            else if (tt_filas[i].trim() == "02" || tt_filas[i].trim() == "2" || tt_filas[i].trim() == "R")
            {
              this.rendDet.nTipDocu = "002";
            }
            else if (tt_filas[i].trim() == "03" || tt_filas[i].trim() == "3" || tt_filas[i].trim() == "B")
            {
              this.rendDet.nTipDocu = "003";
            }
            break;
          case 3:
            this.rendDet.documento = tt_filas[i].trim();
              break;
          case 4:
            this.rendDet.documento += "-" + tt_filas[i].trim();
            break;
          case 5:
             break;
          case 6:
            try
            {
              this.rendDet.monto = parseFloat(tt_filas[i].trim());
            }
            catch (Exception)
            { }
            break;
          case 7:
            this.rendDet.fecha =new Date(tt_filas[i].trim());
              break;

        }          
      }
    }
  }

  closeModal(){
    this.dialogRef.close();
    this.disableScanner();
  }
}
