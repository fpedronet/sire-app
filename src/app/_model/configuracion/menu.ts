import { Combobox } from "../combobox";

export class MenuResponse {
    listaMenu?:MenuDto[];
    listaOpcionesMenu?:OpcionMenuDto[];
    listaBanco?:Combobox[];
}

export class MenuDto {
    ideAcceso?: string;
    codModulo?: string;
    modulo?: string;
    codPantalla?:string;
    pantalla?:string;
    Permiso?:string;
    url?:string;
    listaSubMenu?:SubMenuDto[]
}

export class SubMenuDto {
    ideAcceso?: string;
    codModulo?: string;
    modulo?: string;
    codPantalla?:string;
    pantalla?:string;
    Permiso?:string;
    url?:string;
}

export class OpcionMenuDto {
    ideAcceso?: string;
    codModulo?: string;
    modulo?: string;
    codPantalla?:string;
    pantalla?:string;
    Permiso?:string;
    url?:string;
}
