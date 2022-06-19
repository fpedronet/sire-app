import { RendicionD } from "./rendicionD"

export class RendicionM {
    ideRendicion?: number
    codigo?: string
    ideUsuario?: number
    lugar?: string
    motivo?: string
    monedaRecibe?: string
    montoRecibe?: number
    ingresos?: number
    vIngresos?: string
    gastos?: number
    vGastos?: string
    balance?: number
    vBalance?: string
    vFechaPresenta?: string
    vFechaApruebaRechaza?: string
    vFechaProcesa?: string
    ideUsuProcesa?: number
    ideEstado?: number
    estado?: string
    fechaCreacion?: Date
    vFechaCreacion?: string
    docuGenerado?: number
    vFechaAceptado?: string
    ideUsuApruebaRechaza?: number
    obsAprobador?: string
    obsRevisor?: string
    tipo?: string
    fechaRevisado?: Date
    vFechaRevisado?: string
    ideUsuRevisa?: number
    correo?: string
    listaDetalle?: RendicionD[]
    url_M?: string
}

export class RendicionRequest {
    constructor(){
        this.LstEstados = [0, 0, 0, 0, 0, 0, 0]
    }
    Codigo?: string
    IdePantalla?: number
    IdeUsuario?: number
    LstEstados?: number[]
    FechaIni?: Date
    FechaFin?: Date
    Tipo?: string
    Page?: number;
    Pages?:number;
}

export class EstadoRequest {
    IdeRendicion?: number
    NuevoEstado?: number
    ObsRechazo?: string
}