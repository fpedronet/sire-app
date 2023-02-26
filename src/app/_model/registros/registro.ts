export class Registro {
    ideRegistro?: number
    codigo?: number;
    fecSol?: Date;
    vFecSol?: string;
    ideSede?: number;
    ruc?: string;
    cliente?: string;
    area?: string;
    contactoExterno?: string;
    contactoInterno?: string;
    ideContacto?: number;
    descripcion?: string;
    descripcion2?: string;
    codCat?: string;
    categoria?: string;
    ideResponsable?: number;
    responsable?: string;
    ideResponsable2?: number;
    responsable2?: string;
    ideEstado?: number;
    estado?: string;
    fecAsignado?: Date;
    vFecAsignado?: string;
    fecAsignado2?: Date;
    vFecAsignado2?: string;
    fecSolucion?: Date;
    vFecSolucion?: string;
    fecFinalizado?: Date;
    vFecFinalizado?: string
    observaciones?: string;
    ideUsuReg?: number;
    correoSolicita?: string;
    codTipo?: string;
    codSubTipo?: string;
    impacto?: number;
    urgencia?: number;
    prioridad?: number;
    ideCorreo?: string;
    original?: string;
    origenTicket?: string;
    canal?: string;
    //
    tipo?: string;
    usuario?: string;
    servicio?: string;
    codCanal?: string;
    sgteEstado?: number;    

    fdesde?: Date;
    fhasta?: Date;
    kpiTicketsResueltos?:number;
    ticketsN1?: number;
    totalTickets?: number;
}

export class RegistroRequest {
    IdeUsuario?: number;
    IdeEstado?: string;
    CodCat?: string;
    Codigo?: string;
    FechaIni?: Date;
    FechaFin?: Date;
    Canal?: string;
    Page?: number;
    Pages?: number;
}