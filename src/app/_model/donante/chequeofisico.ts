import { Combobox } from "../combobox";

export class ChequeoFisico{

    idePreDonante?: number;
    codigo?: number;
    fecha?: Date;
    pesoDonacion?: number; 
    tallaDonacion?: number;
    hemoglobina?: number;
    hematocrito?: number;
    plaquetas?: number;
    presionArterial1?: string;
    presionArterial2?: string;
    presionArterial?: string;
    frecuenciaCardiaca?: number;
    ideGrupo?: string;
    aspectoGeneral?: string;
    lesionesVenas?: string;
    estadoVenoso?: string;
    obsedrvaciones?: string;
    temperatura?: number;
    codEstado?: string;
    ideMotivoRec?: number;
    ideUsuario?: number;
    aceptaAlarma?: string;
    cns?: string;
    tipoExtraccion?: string;
    nombres?:string;
    documento?: string;

    listaTipoExtraccion?: Combobox[];
    listaLesionesPuncion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaAspectoGeneral?: Combobox[];
    listaAspectoVenoso?: Combobox[];
    listaMotivoRechazo?: Combobox[];
}