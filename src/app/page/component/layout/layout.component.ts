import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { environment } from 'src/environments/environment';
import forms from 'src/assets/json/formulario.json';

import { ConfigPermisoService } from './../../../_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';

import { MenuResponse } from 'src/app/_model/configuracion/menu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner : SpinnerService,
    private ConfigPermisoService : ConfigPermisoService,
    private usuarioService: UsuarioService,
  ) { }

  menus: MenuResponse = {};
  codigo?:string;
  panelOpenState = false;
  count=true;
  banco?: string = "";
  logo?: string =environment.UrlImage + "logoMenu.png";
  user?: string =environment.UrlImage + "userMenu.png";
  username: string = "";
  userdni: string = "99999999";
  isshow: boolean = false;

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
    this.spinner.showLoading();
    let session = this.usuarioService.sessionUsuario();

    this.username= session.nombre.toUpperCase();
    this.userdni= (session.documento=="")? this.userdni: session.documento;

    this.ConfigPermisoService.listar().subscribe(data=>{

      this.menus.listaMenu = data.listaMenu;
      this.menus.listaBanco = data.listaBanco;
      let bancoselect = session.codigobanco;

      if(bancoselect!=null){
        this.codigo = bancoselect;
        this.banco = data.listaBanco?.filter(x=>x.codigo==bancoselect)[0].descripcion
      }else{
        this.codigo = data.listaBanco![0].codigo;
        this.banco = data.listaBanco![0].descripcion;
      }

      this.count = (data.listaBanco?.length!>1)? true: false;     

      localStorage.setItem(environment.CODIGO_BANCO, this.codigo!);

      this.spinner.hideLoading();
    });  
  }

  selectbanco(idbanco: number){
    this.spinner.showLoading();
    let split = this.router.url.split('/');
    localStorage.setItem(environment.CODIGO_BANCO, idbanco.toString()!);

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
    this.isshow = false;
    localStorage.setItem(environment.CODIGO_FILTRO, "");    
  }

  closeLogin(){
    this.isshow = false;
    localStorage.clear();
    this.router.navigate(['']);
  }

  abrirmenu(){

    if(this.isshow){
      this.isshow = false; 
    }else{
      this.isshow = true;  
    }
  }
}
