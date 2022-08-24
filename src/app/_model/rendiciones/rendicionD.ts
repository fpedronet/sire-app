export class RendicionD {
    constructor() {
        this.ideRendicionDet = 0;
        this.ideRendicion = 0;
        this.dFecha = new Date();
        var difUTC = (5 * 60) * 60000;
        this.fecha = new Date(this.dFecha.getTime() - difUTC).toISOString();
        this.vFecha = this.fecha?.slice(0,11) + '00:00:00';
        this.vHora = this.fecha === undefined ? '' : this.horaFormateada(this.dFecha);
        this.comodato = 'CMD';
        this.ideSede = 0;
        this.nCodLinea = '';
        this.codConcepto = '';
        this.nTipDocu = '';
        this.documento = '';
        this.codMoneda = '001';
        this.monto = 0;
        this.vMonto = '';
        this.descripcion = '';
        this.rucPrv = '';
        this.proveedor = '';
        this.swt = 1;
        this.url = ''
    }
    horaFormateada(dHora?: Date){
        var vHora: string = '';
        if(dHora !== undefined && dHora !== null)
            vHora = (`${(dHora.getHours()<10?'0':'') + dHora.getHours()}:${(dHora.getMinutes()<10?'0':'') + dHora.getMinutes()}`);
        return vHora;
    }
    ideRendicionDet?: number
    ideRendicion?: number
    fecha?: string
    vFecha?: string
    dFecha?: Date
    vHora?: string
    comodato?: string
    ideSede?: number
    codLinea?: string
    nCodLinea?: string
    codConcepto?: string
    tipDocu?: string
    nTipDocu?: string
    documento?: string
    codMoneda?: string
    monto?: number
    vMonto?: string
    descripcion?: string
    rucPrv?: string
    proveedor?: string
    swt?: number
    emailEmp?: string
    password?: string
    nombreAdjunto?: string
    adjunto?: string
    url?: string
    url_M?: string
    codigo?: string
}

export class GrupoRendicionD {
    constructor() {
        this.detalle = [];
        this.montoTot = 0;
        this.fecha = '';
        this.tieneDocu = false;
        this.tieneProv = false;
    }
    fecha?: string
    montoTot?: number
    detalle?: RendicionD[]
    tieneDocu?: boolean
    tieneProv?: boolean
}