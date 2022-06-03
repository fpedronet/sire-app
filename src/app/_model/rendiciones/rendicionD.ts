export class RendicionD {
    constructor() {
        this.ideRendicionDet = 0;
        this.ideRendicion = 0;
        this.fecha = new Date();
        this.vFecha = '';
        this.comodato = '';
        this.ideSede = 0;
        this.codLinea = '';
        this.codConcepto = '';
        this.tipDocu = '';
        this.documento = '';
        this.codMoneda = '';
        this.monto = 0;
        this.vMonto = '';
        this.descripcion = '';
        this.rucPrv = '';
        this.proveedor = '';
    }
    ideRendicionDet?: number
    ideRendicion?: number
    fecha?: Date
    vFecha?: string
    comodato?: string
    ideSede?: number
    codLinea?: string
    codConcepto?: string
    tipDocu?: string
    documento?: string
    codMoneda?: string
    monto?: number
    vMonto?: string
    descripcion?: string
    rucPrv?: string
    proveedor?: string
}