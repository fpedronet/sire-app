export class Combobox {
    constructor() {
        this.valor = '';
        this.descripcion = '';
        this.etiqueta = '';
        this.isChecked = false;
        this.visual = true;
        this.aux1 = '';
        this.aux2 = '';
        this.aux3 = '';
    }
    valor?: string;
    descripcion?: string;
    etiqueta?: string;
    isChecked?: boolean;
    visual?: boolean;
    aux1?: string;
    aux2?: string;
    aux3?: string;
    arrayAux1?: number[];
}