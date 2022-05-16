import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { NotifierService } from '../../component/notifier/notifier.service';
import { SpinnerService } from '../../component/spinner/spinner.service';

import { CadenaConexionDto, Usuario } from './../../../_model/configuracion/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private notifierService : NotifierService,
    private spinner : SpinnerService,
    private usuarioService : UsuarioService, 
    private elementRef: ElementRef 
  ) { }


  form: FormGroup = new FormGroup({});
  mensaje?: string;
  error?: string;
  logologin?: string =environment.UrlImage + "logo.png";
  hospital?: CadenaConexionDto[] = [];
  idHospital?: any;
  verHospital: boolean = false;
  input: any;

  ngOnInit(): void {

    this.form = new FormGroup({
      'usuario': new FormControl(""),
      'clave': new FormControl(""),
      'idHospital': new FormControl("")
    });

    // this.listaHospital();
  }

  // listaHospital(){

  //   let model = new Usuario();
  //   this.spinner.showLoading();
  //     this.usuarioService.listaHospital(model).subscribe(data=>{
  //       this.hospital = data.items;
  //       this.idHospital = this.hospital[0].idHospital;
  //       this.verHospital = (data.items.length>1)? true: false;
  //       this.spinner.hideLoading();
  //     }); 
  // }
  
  login(){
    let model = new Usuario();

    model.usuario = this.form.value['usuario'];
    model.contrasenia= this.form.value['clave'];
    // model.idHospital= (this.verHospital == false)? this.idHospital:   this.form.value['idHospital'];

    if(model.usuario==null || model.contrasenia==""){
      if(model.usuario==null || model.usuario==""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingresa el usuario');
      }
      else if(model.contrasenia==null || model.contrasenia==""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingresa la contraseña');
      }
      this.spinner.hideLoading();

    }else{

      // this.spinner.showLoading();
      // this.usuarioService.login(model).subscribe(data=>{
        
      //   if(data.typeResponse==environment.EXITO){
      //     localStorage.setItem(environment.TOKEN_NAME, data.access_token!);
      //     localStorage.setItem(environment.CODIGO_BANCO, data.codigoBanco!);

      //     this.router.navigate(['/page/home']);
      //   }
      //   this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.mensaje!);
      //   this.spinner.hideLoading();
      //   if(data.typeResponse!=environment.EXITO){
      //     this.input.focus();
      //     this.input.select();
      //   }
      // }); 

      this.router.navigate(['/page/home']);
    }
  }

  focus(name:any, input: any, btn:string=""){
    this.input = input;
    if(btn=="btnlogin"){
      this.login();
    }else{
      name.focus();
      name.select();
    }
  }

}
