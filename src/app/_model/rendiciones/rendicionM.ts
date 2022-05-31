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
    vFechaPresenta?: string
    vFechaApruebaRechaza?: string
    vFechaProcesa?: string
    ideUsuProcesa?: number
    ideEstado?: number
    estado?: string
    vFechaCreacion?: string
    docuGenerado?: number
    vFechaAceptado?: string
    ideUsuApruebaRechaza?: number
    obsAprobador?: string
    obsRevisor?: string
    tipo?: string
    vFechaRevisado?: string
    ideUsuRevisa?: number
    correo?: string
    lstDetalle?: RendicionD[]
}

export class RendicionRequest {
    constructor(){
        this.LstEstados = [0, 0, 0, 0, 0, 0, 0]
    }
    Codigo?: string
    IdPantalla?: number
    LstEstados?: number[]
    FechaIni?: Date
    FechaFin?: Date
    Tipo?: string
    Page?: number;
    Pages?:number;
}