import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Registro } from 'src/app/_model/registros/registro';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RegistroService } from 'src/app/_service/registro.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-iregistro',
  templateUrl: './iregistro.component.html',
  styleUrls: ['./iregistro.component.css']
})
export class IregistroComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<IregistroComponent>,
    private spinner : SpinnerService,
    private usuarioService: UsuarioService,
    private registroService : RegistroService,
    private comboboxService: ComboboxService,
    private notifierService : NotifierService,
    private confirmService : ConfimService
  )
  {
  }

  form: FormGroup = new FormGroup({});

  tablasMaestras = ['USUSOPORTE'];
  tbUsuario: Combobox[] = [];

  fecha?: Date;
  fechaSelect?: Date;

  fechaMax?: Date;

  reg: Registro = new Registro();

  ngOnInit(): void {
    this.fechaMax = new Date();
    this.inicializar();
    this.listarCombo();
  }

  inicializar(){
    var difUTC = (5 * 60) * 60000;
    var fecha: string = new Date(new Date().getTime() - difUTC).toISOString();
    var hora: string = this.horaFormateada(new Date());
    this.form = new FormGroup({
      'ideResponsable': new FormControl({ value: '', disabled: false}),
      'descripcion': new FormControl({ value: '', disabled: false}),
      'fecha': new FormControl({ value: fecha, disabled: false}),
      'hora': new FormControl({ value: hora, disabled: false})
    });
  }

  horaFormateada(dHora?: Date){
    var vHora: string = '';
    if(dHora !== undefined && dHora !== null)
        vHora = (`${(dHora.getHours()<10?'0':'') + dHora.getHours()}:${(dHora.getMinutes()<10?'0':'') + dHora.getMinutes()}`);
    return vHora;
  }

  listarCombo(){
    this.spinner.showLoading();
    
    this.comboboxService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;

        this.tbUsuario = this.obtenerSubtabla(tbCombobox,'USUSOPORTE').filter(e => e.valor !== '0');

        this.selectUsuario(this.usuarioService.sessionUsuario().ideUsuario.toString());
      }
      this.spinner.hideLoading();
    });
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.etiqueta?.toString()?.trim() === cod);
  }

  guardar(){
    let model = new Registro();
    let tipoDocumento = ""; 
    
    model.ideRegistro = 0;
    model.descripcion = this.form.value['descripcion'];
    model.ideResponsable = this.form.value['ideResponsable'];

    var field = new Date(this.form.value['fecha']);
    var iso = field.toISOString();
    var sFecha = iso.substring(0,11);
    var sHora = this.form.value['hora'];
    
    var horaValida = /^[[0-9]{2}:[0-9]{2}/.test(sHora);

    var sFH = sFecha + (!horaValida ? '00:00' : sHora);
    model.fecSol = new Date(sFH);

    //debugger;
    this.spinner.showLoading();
    this.registroService.guardar(model).subscribe(data=>{
  
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

        if(data.typeResponse==environment.EXITO){

            //this.router.navigate(['/page/mesadeayuda/registro/edit/',this.id]);
          this.spinner.hideLoading();
          this.dialogRef.close(data.ide);
        }else{
          this.spinner.hideLoading();
        }
      });
  }

  onDateChange(){
    this.form.patchValue({
      fechaSol: this.fechaSelect
    });
    this.fecha = this.fechaSelect;
  }

  selectUsuario(value: string){
    this.form.patchValue({
      ideResponsable: value
    });
  }

  closeModal(){
    this.dialogRef.close();
  }
}
