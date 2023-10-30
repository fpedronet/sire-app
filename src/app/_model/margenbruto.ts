import { Byte } from "@angular/compiler/src/util";

export class MargenBruto {
   //T_MARGEN_BRUTO_PRODUCTO
 anio ?: number;
 MES ?: number;
 TIPO ?: string;
 SUB_TIPO ?: string;
 TipoCliente ?: string;
 RUC_CLI ?: string;
 Cliente ?: string;
 Distrito ?: string;
 Provincia ?: string;
 Departamento ?: string;
 CDG_VEND ?: string;
 DES_VEND ?: string;
 CDG_VEND_Ped ?: string;
 DES_VEND_Ped ?: string;
 CDG_PROD ?: string;
 DES_PROD ?: string;
 CDG_EQV ?: string;
 CDG_LINP ?: string;
 DES_LIN ?: string;
 TipProd ?: string;
 NUM_PED ?: string;
 CDG_TDOC ?: string;
 NUM_DOCU ?: string;
 CDG_TPG ?: string;
 NUM_GUIA ?: string;
 LICITACION ?: string;
 FECHA ?: Date;
 CANTIDAD ?: number;
 PRE_DFAC ?: number;
 IMP_DFAC ?: number;
 PRE_GUIA ?: number;
 COSTO ?: number;
 UNegocio ?: string;
 NUM_SEC ?: number;
 REF1_Ped ?: string;
 REF2_Ped ?: string;
 UN ?: number;

 //M_CLIENT

 RUC_CLI_M_CLIENT ?: string;
 DES_CLI ?: string;
 DIR_CLI ?: string;
 TEL_CLI ?: string;
 FAX_CLI ?: string;
 EMA_CLI ?: string;
 REP_CLI ?: string;
 CRD_SOL ?: number;
 CRD_DOL ?: number;
 CDG_TCLI ?: string;
 CDG_VEND_M_CLIENT ?: string;
 CDG_UDIS ?: string;
 SWT_CLI ?: number;
 SWT_IMP ?: number;
 CDG_CPAG ?: string;
 REF1 ?: string;
 REF2 ?: string;
 CDG_TDOC_M_CLIENT ?: string;
 CDG_USU ?: string;
 FEC_USU ?: Date;
 HOR_USU ?: string;
 CDG_EAN ?: string;
 CDG_ZNA ?: string;
 SWT_REL ?: number;
 NOMBRE1 ?: string;
 NOMBRE2 ?: string;
 APE_PAT ?: string;
 APE_MAT ?: string;
 CDG_TPER ?: string;
 UBIGEO ?: string;
 SWT_PER ?: number;
 SWT_EXC ?: number;
 CDG_PAI ?: string;
 CDG_LIS ?: string;

 //D_TABLAS
 CDG_TAB ?: string;
 NUM_ITEM ?: string;
 DES_ITEM ?: string;
 ABR_ITEM ?: string;
 SWT_ITEM ?: number;
 TIP_ITEM ?: string;
 VAL_ITEM ?: number;
 REF1_D_TABLAS ?: string;
 SWT_REF1 ?: number;
 REF2_D_TABLAS ?: string;
 SWT_REF2 ?: number;
 REF3_D_TABLAS ?: string;
 SWT_REF3 ?: number;
 REF4_D_TABLAS ?: string;
 SWT_REF4 ?: number;
 REF5_D_TABLAS ?: string;
 SWT_REF5 ?: number;
 SWT_DET ?: string;
 POR_MMIN ?: number;
 SWT_GUIA ?: number;
 SWT_SERV ?: number;
 TIP_EXIS ?: string;
 CDG_SUNAT ?: string;
 DES_SUNAT ?: string;
 CDG_USU_D_TABLAS ?: string;
 FEC_USU_D_TABLAS ?: Date;
 HOR_USU_D_TABLAS ?: string;
 POR_PER ?: number;
 SWT_ACTF ?: number;
}

export class MargenBrutoRequest {
  OPCION ?: string;
  FECHA_DESDE ?: Date;
  FECHA_HASTA ?: Date;
  BONIFICACION ?: number;
  DEMOSTRACION ?: number;
  MUESTRA ?: number;
  DETERIORADO ?: number;
  UndNegocio ?: number;
  TipProd ?: number;
}
