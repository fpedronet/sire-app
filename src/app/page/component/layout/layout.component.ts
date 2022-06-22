import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { environment } from 'src/environments/environment';
import forms from 'src/assets/json/formulario.json';

import { ConfigPermisoService } from './../../../_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';

import { MenuResponse } from 'src/app/_model/configuracion/menu';
import { MatDialog } from '@angular/material/dialog';
import { PerfilComponent } from '../perfil/perfil.component';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner : SpinnerService,
    private ConfigPermisoService : ConfigPermisoService,
    private usuarioService: UsuarioService,
  ) { }

  menus: MenuResponse = {};
  codigo?:string;
  panelOpenState = false;
  count=false;
  empresa?: string = "";
  logo?: string =environment.UrlImage + "logoMenu.png";
  user?: string =environment.UrlImage + "userMenu.png";
  username: string = "";
  userdni: string = "99999999";
  isshow: boolean = false;
  interval:any;

  ngOnInit(): void {
    this.listar();   
    this.startTimer();
  }

  listar(){

    let session = this.usuarioService.sessionUsuario();

    if(session!=null){
      this.username= session.nombreConocido.toUpperCase();
      let empresaselect = session.codigoempresa;

      this.spinner.showLoading();
      this.ConfigPermisoService.listar(empresaselect).subscribe(data=>{
        this.menus.listaEmpresa = data.listaEmpresa;
        
        if(empresaselect!=null){
          this.codigo = empresaselect;
          this.empresa = data.listaEmpresa?.filter(x=>x.codigo==empresaselect)[0].nombreEmpresa
        }else{
          this.codigo = data.listaEmpresa![0].codigo;
          this.empresa = data.listaEmpresa![0].nombreEmpresa;
        }
        //debugger;
       
        this.count = (data.listaEmpresa?.length!>1)? true: false;     
        this.menus.listaMenu = data.listaMenu;

        localStorage.setItem(environment.CODIGO_EMPRESA, this.codigo!);
        localStorage.setItem(environment.PASSWORD_SHAREPOINT, data.contraseniaSharepoint!);
  
        this.spinner.hideLoading();
      });
    }else{
      this.usuarioService.closeLogin();
    }  
  }

  selectempresa(idbanco: number){
    this.spinner.showLoading();
    let split = this.router.url.split('/');
    localStorage.setItem(environment.CODIGO_EMPRESA, idbanco.toString()!);

    if(split.length > 3 && split.length <=4){

      window.location.reload();

    }else if(split.length >= 5){

      let $modulo = split[2];
      let modulo = forms.aspirante.modulo;
      let $nombre = split[3];

      if($modulo==modulo){

        let $url = ($nombre ==forms.aspirantesligth.nombre)? forms.aspirantesligth.nombre : forms.aspirante.nombre;
        let url = "/page/" + split[2] + "/" + $url;
        this.router.navigate([url]);

      }
    }
    else{
      window.location.reload();
    }

  }

  clearLocalStore(){
    //debugger;
    this.isshow = false;
    localStorage.setItem(environment.CODIGO_FILTRO, "");    
  }

  closeLogin(){
    this.isshow = false;
    localStorage.clear();
    this.router.navigate(['']);
  }

  abrirperfil(){
    const dialogRef =this.dialog.open(PerfilComponent, {
       width: '400px',
    });
  }


  abrirmenu(){

    if(this.isshow){
      this.isshow = false; 
    }else{
      this.isshow = true;  
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
        let session = this.usuarioService.sessionUsuario();
        if(session==null){
          clearInterval(this.interval);
          this.usuarioService.closeLogin();
          window.location.reload();
        }

    },30000)
  }
}
