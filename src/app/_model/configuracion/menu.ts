import { Combobox } from "../combobox";
import { EmpresaPorUsuario } from "./usuario";

export class MenuResponse {
    listaMenu?:MenuDto[];
    listaOpcionesMenu?:OpcionMenuDto[];
    listaEmpresa?:EmpresaPorUsuario[];
}

export class MenuDto {
    codModulo?: string;
    desModulo?: string;
    codPantalla?:string;
    pantalla?:string;
    url?:string;
    listaSubMenu?:SubMenuDto[]
}

export class SubMenuDto {
    codModulo?: string;
    desModulo?: string;
    codPantalla?:string;
    pantalla?:string;
    url?:string;
    listaSubMenu?:SubMenuDto[]
}

export class OpcionMenuDto {
    codModulo?: string;
    desModulo?: string;
    codPantalla?:string;
    pantalla?:string;
    url?:string;
}
