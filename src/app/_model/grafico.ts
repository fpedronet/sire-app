export class Grafico {
    ideGrafico?: number;
    titulo?: string;
    etiqueta?: string;
    icono?: string;
    subEtiquetas?: string;
    cantidades?: string;
    listaCantidad?: number[] = [];
}

export class Serie{
    name?: string;
    data?: number[] = [];
}

//Para las tablas de doble entrada
export class GraficoStock {
    constructor(){
        this.arrayLabel = [];
        this.arraySeries = [];
        this.total = 0;
        this.visible = false;
    }
    subTitle?: string;
    arrayLabel?: string[];
    arraySeries?: number[];
    total?: number;
    max?: number;
    visible?: boolean;
}