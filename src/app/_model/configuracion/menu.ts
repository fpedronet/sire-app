import { EmpresaPorUsuario } from "./usuario";

export class MenuResponse {
    contraseniaSharepoint?: string;
    listaMenu?:MenuDto[];
    listaConfigMenu?:ConfiguracionMenu[];
    listaEmpresa?:EmpresaPorUsuario[];
}

export class MenuDto {
    ideUsuario? : string;
    codModulo?: string;
    desModulo?: string;
    codPantalla?:string;
    desPantallaWeb?:string;
    desSubMenuWeb?:string;
    desFuncionWeb?:string;
    ideEmpresa?:string;
    perfil?:string;
    url?:string;
    listaSubMenu1?:SubMenu1Dto[]
}

export class SubMenu1Dto {
    ideUsuario? : string;
    codModulo?: string;
    desModulo?: string;
    codPantalla?:string;
    desPantallaWeb?:string;
    desSubMenuWeb?:string;
    desFuncionWeb?:string;
    ideEmpresa?:string;
    perfil?:string;
    url?:string;
    listaSubMenu2?:SubMenu2Dto[]
}

export class SubMenu2Dto {
    ideUsuario? : string;
    codModulo?: string;
    desModulo?: string;
    codPantalla?:string;
    desPantallaWeb?:string;
    desSubMenuWeb?:string;
    desFuncionWeb?:string;
    ideEmpresa?:string;
    perfil?:string;
    url?:string;
}

export class ConfiguracionMenu {
    ideUsuario? : string;
    codModulo?: string;
    desModulo?: string;
    codPantalla?:string;
    desPantallaWeb?:string;
    desSubMenuWeb?:string;
    desFuncionWeb?:string;
    ideEmpresa?:string;
    perfil?:string;
    url?:string;
}
