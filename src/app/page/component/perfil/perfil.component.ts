import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Usuario } from 'src/app/_model/configuracion/usuario';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { environment } from 'src/environments/environment';
import { NotifierService } from '../notifier/notifier.service';
import { SpinnerService } from '../spinner/spinner.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PerfilComponent>,
    private spinner : SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService
  ) { }

  dato: string = ""
  usuario: string = ""
  password: string = ""
  perfil?: string =environment.UrlImage + "people.png";

  ngOnInit(): void {
    let session = this.usuarioService.sessionUsuario();

    if(session!=null){
      this.dato = session.nombreConocido;
      this.perfil = session.strFoto !== ''?session.strFoto:this.perfil;
      this.usuario = session.emailEmp;
      this.password = session.contraseniaSharepoint;
    }
  }

  guardar(){
    let model = new Usuario();
    
    if(this.password=="" || this.password== null || this.password== undefined){
      this.notifierService.showNotification(environment.ALERT!,'Mensaje',"Ingrese una contraseña");
    }else  if(this.usuario=="" || this.usuario== null || this.usuario== undefined){
      this.notifierService.showNotification(environment.ALERT!,'Mensaje',"Ingrese un usuario");
    }
    else{
      model.contraseniaSharepoint = this.password;
      this.spinner.showLoading();
      this.usuarioService.actualizarpasswordsharePoint(model).subscribe(data=>{

        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

        if(data.typeResponse = environment.EXITO){
          this.dialogRef.close();
          localStorage.setItem(environment.PASSWORD_SHAREPOINT, model.contraseniaSharepoint!);
        }

        this.spinner.hideLoading();
      });
    }  
  }

}
