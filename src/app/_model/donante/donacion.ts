import { Combobox } from "../combobox";
import { Unidade } from "./unidade";

export class Donacion{
    codDonacion?:string;
    codPostulante?: string;
    idePreDonante?: number;
    ideDonacion?: number;
    ideMuestra?: number;
    ideExtraccion?: number;
    fecha?: Date;
    codTipoExtraccion?: string; 
    selloCalidad?: string;
    donante?: string;
    usuario?: string;
    codEstado?: number;
    estado?: string;
    ideGrupo?: string;
    hemoglobina?: number;
    hematocrito?: number;
    obsedrvaciones?: string;
    fechaExtraccion?: Date;
    tipoExtraccion?: string;
    ideTipoBolsa?: string;
    brazo?: string;
    dificultad?: string;
    operador?: string;
    vHoraIni?: string;
    vHoraFin?: string;
    existExtraccion?: Boolean;
    ideMotivoRechazo?: string;

    codTubuladura?: string;
    rendimiento?: number;
    codReaccionAdversa?: string;
    documento?: string;


    listaTipoExtraccion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaTipoBolsa?: Combobox[];
    listaBrazo?: Combobox[];
    listaDificultad?: Combobox[];
    listaHemoComponente?: Combobox[];
    listaExtraccionUnidad?: Unidade[];
    listaMotivoRechazo?: Combobox[];
}
