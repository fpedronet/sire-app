import { Combobox } from "../combobox";
import { Pregunta } from "./pregunta";

export class Entrevista{

    idePreDonante?: number;
    codigo?: number;
    ideUsuario?: number;
    codEstado?: string;
    ideMotivoRec?: number;
    pesoDonacion?: number;
    hemoglobina?: number; 
    nIdTipoProceso?: number;
    tallaDonacion?: number;
    hematocrito?: number;
    tipoExtraccion?: string;
    ideGrupo?: string;
    estadoVenoso?: string;
    lesionesVenas?: string;
    fechaMed?: Date;
    observacionesMed?: string;
    nombres?:string;
    documento?: string;
    fechaHasta?: Date;
    periodo?: string;
    idePersona?: string
    
    listaPregunta?: Pregunta[];
    listaTipoExtraccion?: Combobox[];
    listaLesionesPuncion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaAspectoVenoso?: Combobox[];
    listaMotivoRechazo?: Combobox[];
}