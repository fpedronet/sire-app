import { Component, OnInit } from '@angular/core';
import { Ficha } from 'src/app/_model/reporte/ficha';

@Component({
  selector: 'app-rptficha',
  templateUrl: './rptficha.component.html',
  styleUrls: ['./rptficha.component.css']
})
export class RptfichaComponent implements OnInit {

  window?: any;
  tipDocu?: string = 'DNI';
  numDocu?: string = '99999999';
  apPaterno?: string = 'apPaterno';
  apMaterno?: string = 'apMaterno';
  primerNombre?: string = 'nombre';
  fecNacimiento?: string = '99/99/9999(N)';
  edad?: string = '00';
  sexo?: string = 'X';
  estadoCivil?: string = 'estC';
  lugarNacimiento?: string = 'lugarNac';
  procedencia?: string = 'proced';
  direccion?: string = 'direccion';
  distrito?: string = 'distrito';
  provincia?: string = 'provincia';
  departamento?: string = 'departamento';
  ocupacion?: string = 'ocupacion';
  telefono?: string = 'telefono';
  celular?: string = 'celular';
  correo?: string = 'correo';
  lugarTrabajo?: string = 'lugarTrabajo';
  codigoPre?: string = 'codigoPre';
  fechaDona?: string = '99/99/9999';
  tipoDonacion?: string;
  tipoExtraccion?: string;
  personaRelacion?: string = 'RECEPTOR 1234';
  otrosRecepcion?: string = 'otrosRecepcion';
  grupoABO?: string = 'grupoABO';
  hemoglobina?: string = '0.00';
  hematocrito?: string = '0.00';
  tallaDonacion?: string = 'talla';
  pesoDonacion?: string = 'peso';
  presionArterial?: string = 'presionArterial';
  frecuenciaCardiaca?: string = 'frecuenciaCardiaca';
  viajes?: string = 'viajes';
  permanencia?: string = 'permanencia';
  fechaViaje?: string = '99/99/9999(V)';
  lesionesVenas?: string = 'lesionesVenas';
  estadoVenoso?: string = 'estadoVenoso';
  campo1A?: string = 'campo1A';
  campo2A?: string = 'campo2A';
  campo3A?: string = 'campo3A';
  campo4A?: string = 'campo4A';
  campo4B?: string = 'campo4B';
  campo5A?: string = 'campo5A';
  campo5B?: string = 'campo5B';
  campo6A?: string = 'campo6A';
  campo6B?: string = 'campo6B';
  campo7A?: string = 'campo7A';
  campo8A?: string = 'campo8A';
  campo9A?: string = 'campo9A';
  campo10A?: string = 'campo10A';
  campo10B?: string = 'campo10B';
  campo11A?: string = 'campo11A';
  campo12A?: string = 'campo12A';
  campo13A?: string = 'campo13A';
  campo14A?: string = 'campo14A';
  campo14B?: string = 'campo14B';
  campo15A?: string = 'campo15A';
  campo16A?: string = 'campo16A';
  campo17A?: string = 'campo17A';
  campo18A?: string = 'campo18A';
  campo19A?: string = 'campo19A';
  campo20A?: string = 'campo20A';
  campo21A?: string = 'campo21A';
  campo22A?: string = 'campo22A';
  campo23A?: string = 'campo23A';
  campo24A?: string = 'campo24A';
  campo25A?: string = 'campo25A';
  campo26A?: string = 'campo26A';
  campo27A?: string = 'campo27A';
  campo28A?: string = 'campo28A';
  campo29A?: string = 'campo29A';
  campo29B?: string = 'campo29B';
  estado?: string;
  motivoRec?: string;
  periodoRechazo?: string;
  observacionesChec?: string = 'obsChec';
  faseRechazo?: string;
  titulo?: string = 'titulo';
  subTitulo1?: string = 'sub1';
  subTitulo2?: string = 'sub2';
  logo?: string;
  codDonacion?: string = 'codDonacion';

  //Fórmulas
  xVoluntario?: string = 'V';
  xAutologo?: string = 'U';
  xReposicion?: string = 'R';
  xDirigida?: string = 'D';
  xSangre?: string = 'S';
  xAferesis?: string = 'F';
  xApto?: string = 'A';
  xNoAptoTemp?: string = 'T';
  xNoAptoPerm?: string = 'P';
  apPatFase1?: string = 'apPatFase1';
  apMatFase1?: string = 'apMatFase1';
  nombresFase1?: string = 'nomFase1';
  apPatFase2?: string = 'apPatFase2';
  apMatFase2?: string = 'apMatFase2';
  nombresFase2?: string = 'nomFase2';
  motivoTem?: string = 'motivoTem';
  motivoPerm?: string = 'motivoPerm';
  subTitulo?: string = this.subTitulo1 + ' ' + this.subTitulo2;;

  constructor() {

  }

  ngOnInit(): void {
  }

  setFicha(data: Ficha){
    this.tipDocu = data.tipDocu;
    this.numDocu = data.numDocu;
    this.apPaterno = data.apPaterno;
    this.apMaterno = data.apMaterno;
    this.primerNombre = data.primerNombre;
    this.fecNacimiento = data.vFecNacimiento;
    this.edad = data.edad;
    this.sexo = data.sexo;
    this.estadoCivil = data.estadoCivil;
    this.lugarNacimiento = data.lugarNacimiento;
    this.procedencia = data.procedencia;
    this.direccion = data.direccion;
    this.distrito = data.distrito;
    this.provincia = data.provincia;
    this.departamento = data.departamento;
    this.ocupacion = data.ocupacion;
    this.telefono = data.telefono;
    this.celular = data.celular;
    this.correo = data.correo1;
    this.lugarTrabajo = data.lugarTrabajo;
    this.codigoPre = data.codigoPre;
    this.fechaDona = data.vFechaDona;
    this.tipoDonacion = data.tipoDonacion;
    this.tipoExtraccion = data.tipoExtraccion;
    this.personaRelacion = data.personaRelacion;
    this.otrosRecepcion = data.otrosRecepcion;
    this.grupoABO = data.grupoABO;
    this.hemoglobina = data.hemoglobina;
    this.hematocrito = data.hematocrito;
    this.tallaDonacion = data.tallaDonacion;
    this.pesoDonacion = data.pesoDonacion;
    this.presionArterial = data.presionArterial;
    this.frecuenciaCardiaca = data.frecuenciaCardiaca;
    this.viajes = data.viajes;
    this.permanencia = data.permanencia;
    this.fechaViaje = data.vFechaViaje;
    this.lesionesVenas = data.lesionesVenas;
    this.estadoVenoso = data.estadoVenoso;
    this.campo1A = data.campo1A;
    this.campo2A = data.campo2A;
    this.campo3A = data.campo3A;
    this.campo4A = data.campo4A;
    this.campo4B = data.campo4B;
    this.campo5A = data.campo5A;
    this.campo5B = data.campo5B;
    this.campo6A = data.campo6A;
    this.campo6B = data.campo6B;
    this.campo7A = data.campo7A;
    this.campo8A = data.campo8A;
    this.campo9A = data.campo9A;
    this.campo10A = data.campo10A;
    this.campo10B = data.campo10B;
    this.campo11A = data.campo11A;
    this.campo12A = data.campo12A;
    this.campo13A = data.campo13A;
    this.campo14A = data.campo14A;
    this.campo14B = data.campo14B;
    this.campo15A = data.campo15A;
    this.campo16A = data.campo16A;
    this.campo17A = data.campo17A;
    this.campo18A = data.campo18A;
    this.campo19A = data.campo19A;
    this.campo20A = data.campo20A;
    this.campo21A = data.campo21A;
    this.campo22A = data.campo22A;
    this.campo23A = data.campo23A;
    this.campo24A = data.campo24A;
    this.campo25A = data.campo25A;
    this.campo26A = data.campo26A;
    this.campo27A = data.campo27A;
    this.campo28A = data.campo28A;
    this.campo29A = data.campo29A;
    this.campo29B = data.campo29B;
    this.estado = data.estado;
    this.motivoRec = data.motivoRec;
    this.periodoRechazo = data.periodoRechazo;
    this.observacionesChec = data.observacionesChec;
    this.faseRechazo = data.faseRechazo;
    this.titulo = data.titulo;
    this.subTitulo1 = data.subTitulo1;
    this.subTitulo2 = data.subTitulo2;
    this.logo = data.strLogo;
    this.codDonacion = data.codDonacion;

    //Fórmulas
    this.subTitulo = this.subTitulo1 + ' ' + this.subTitulo2;
    this.xVoluntario = this.tipoDonacion==='Voluntario'?'X':'';
    this.xAutologo = this.tipoDonacion==='Autologo'?'X':'';
    this.xReposicion = this.tipoDonacion==='Reposicion'?'X':'';
    this.xDirigida = this.tipoDonacion==='Dirigida'?'X':'';;
    this.xSangre = this.tipoExtraccion==='Sangre Total'?'X':'';
    this.xAferesis = this.tipoExtraccion==='Aferesis'?'X':'';
    this.xApto = this.estado==='APTO'?'X':'';
    this.xNoAptoTemp = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='T')?'X':'';
    this.xNoAptoPerm = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='D')?'X':'';
    this.apPatFase1 = (this.estado==='NO APTO' && this.faseRechazo=='1')?this.apPaterno:'';
    this.apMatFase1 = (this.estado==='NO APTO' && this.faseRechazo=='1')?this.apMaterno:'';
    this.nombresFase1 = (this.estado==='NO APTO' && this.faseRechazo=='1')?this.primerNombre:'';
    this.apPatFase2 = (this.estado==='NO APTO' && this.faseRechazo=='2')?this.apPaterno:'';
    this.apMatFase2 = (this.estado==='NO APTO' && this.faseRechazo=='2')?this.apMaterno:'';
    this.nombresFase2 = (this.estado==='NO APTO' && this.faseRechazo=='2')?this.primerNombre:'';
    this.motivoTem = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='T')?this.motivoRec:'....................................................................';
    this.motivoPerm = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='D')?this.motivoRec:'....................................................................';
  }

}
