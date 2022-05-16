import { Combobox } from "./combobox";

export class Distrito {
    constructor(){
        this.dpto = new Combobox();
        this.prov = new Combobox();
        this.dist = new Combobox();
    }
    dpto?: Combobox;
    prov?: Combobox;
    dist?: Combobox;
}