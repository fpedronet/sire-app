import { Foto } from "../foto";

export class Persona {
    idePersona?: number;
    tipDocu?: string;
    numDocu?: string;
    docAdic1?: string;
    docAdic2?: string;
    apPaterno?: string;
    apMaterno?: string;
    primerNombre?: string;
    segundoNombre?: string;
    nombreMostrar?: string;
    fecNacimiento?: Date;
    edadManual?: number;
    fecEdadManual?: Date;
    edad?: number;
    edadMeses?: string;
    sexo?: string;
    estadoCivil?: string;
    nacionalidad?: string;
    lugarNacimiento?: string;
    procedencia?: string;
    direccion?: string;
    codDistrito?: string;
    codProvincia?: string;
    codDepartamento?: string;
    codPais?: string;
    codGradoInstruccion?: string;
    codOcupacion?: number;
    telefono?: string;
    celular?: string;
    correo1?: string;
    correo2?: string;
    lugarTrabajo?: string;
    observaciones?: string;
    talla?: number;
    peso?: number;
    ideGrupo?: number;
    swt?: number;
    esPaciente?: number;
    codDiagnostico?: string;
    ocupacion?: string;
    hemoglobina?: number;
    hematrocito?: number;
    mostrarFirma?: string;
    fecRegistro?: Date;
    foto?: Foto;
    strFoto?: string;
}

export class PersonaPoclab{
    nIdePersona?: number;
    vDocumento?: string;
    vApePaterno?: string;
    vApeMaterno?: string;
    vPrimerNombre?: string;
    vSegundoNombre?: string;
    vSexo?: string;
    dteNacimiento?: Date;
    vCodPais?: string;
    vCodRegion?: string;
    vCodProvincia?: string;
    vCodDistrito?: string;
    vEmail?: string;
    vTelefono1?: string;

    toPersona(){
        var p = new Persona();
        p.idePersona = this.nIdePersona;
        p.apPaterno = this.vApePaterno;
        p.apMaterno = this.vApeMaterno;
        p.primerNombre = this.vPrimerNombre;
        p.segundoNombre = this.vSegundoNombre;
        p.sexo = this.vSexo;
        p.fecNacimiento = this.dteNacimiento;
        p.codPais = this.vCodPais;
        p.codDepartamento = this.vCodRegion;
        p.codProvincia = this.vCodProvincia;
        p.codDistrito = this.vCodDistrito;
        p.correo1 = this.vEmail;
        p.telefono = this.vTelefono1;
        return p;
    }
}