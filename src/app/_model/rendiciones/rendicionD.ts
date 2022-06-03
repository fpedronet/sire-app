export class RendicionD {
    constructor() {
        this.ideRendicionDet = 0;
        this.ideRendicion = 0;
        this.fecha = new Date();
        this.vFecha = '';
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
    }
    ideRendicionDet?: number
    ideRendicion?: number
    fecha?: Date
    vFecha?: string
    comodato?: string
    ideSede?: number
    nCodLinea?: string
    codConcepto?: string
    nTipDocu?: string
    documento?: string
    codMoneda?: string
    monto?: number
    vMonto?: string
    descripcion?: string
    rucPrv?: string
    proveedor?: string
    swt?: number
}