import { Byte } from "@angular/compiler/src/util";

export class Usuario{
    ideUsuario?: string;
    usuario? : string;
    contrasenia? : string;
    contraseniaSharepoint? : string;
    id? : string;
    key? : string;
}

export class TokenUsuario{
    ideUsuario? : number;
    nombreConocido? : string;
    dniEmp? : string;
    idePuesto? : string;
    emailEmp? : string;
    telefonoTrabajo? : string;
    codigoEmpresa?: string;
    strFoto?: string;
    access_token? : string;
    typeResponse? : number;
    mensaje? : string;
}

export class EmpresaPorUsuario{
    codigo? : string;
    documento? : string;
    nombreEmpresa? : string;
    razonSocial? : string;
    otro1? : string;
    tipoEmpresa?: string;
    foto? : Byte[];
    logo? : string;
    longitud? : string;
    latitud? : string;
    otro2? : string;
    fecha1? : string;
    otro3? : string;
    fecha3? : string;
}