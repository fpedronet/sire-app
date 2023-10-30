import { Byte } from "@angular/compiler/src/util";

export class tracking{

  Usuario_Solicita ?: string;
  Fecha_Solicita ?: Date;
  Numero_RQ ?: string;
  Aprobador1RQ ?: string;
  EstadoAprobacion1RQ ?: string;
  FechaAprobacion1RQ ?: Date;
  Aprobador2RQ ?: string;
  EstadoAprobacion2RQ ?: string;
  FechaAprobacion2RQ ?: Date;
  Comodato ?: string;
  EstadoOCS ?: string;
  Usuario_OC ?: string;
  Fecha_OC ?: Date;
  Numero_OCS ?: string;
  Aprobador1OCS ?: string;
  EstadoAprobacion1OCS ?: string;
  FechaAprobacion1OCS ?: Date;
  Aprobador2OCS ?: string;
  EstadoAprobacion2OCS ?: string;
  FechaAprobacion2OCS ?: Date;
  EstadoOrdenOCS ?: string;
}

export class trackingRequest{
  ideUsuario ?: string;
  filtro ?: string;
  empresa ?: string;
}
