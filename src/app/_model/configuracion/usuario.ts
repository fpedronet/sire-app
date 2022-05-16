export class Usuario{
    idHospital?: string;
    usuario? : string;
    contrasenia? : string;
    key? : string;
}

export class CadenaConexionDto{
    idHospital?: string;
    nombre? : string;
}

export class TokenUsuario{
    swt?: number;
    mensaje? : string;
    ideUsuario? : number;
    idePersona? : number;
    documento? : string;
    nombres? : string;
    access_token? : string;
    codigoBanco? : string;
    typeResponse? : number;
}