import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MargenBruto, MargenBrutoRequest } from 'src/app/_model/margenbruto';
import { merge, startWith, switchMap, of as observableOf, catchError, map } from 'rxjs';
import { MargenbrutoService } from 'src/app/_service/margenbruto.service';
import { getDefaultSettings } from 'http2';
import { debug } from 'console';

@Component({
  selector: 'app-lmargenbruto',
  templateUrl: './lmargenbruto.component.html',
  styleUrls: ['./lmargenbruto.component.css']
})
export class LmargenbrutoComponent implements OnInit {

  dataSource: MargenBruto[] = [];
  request = new MargenBrutoRequest();
  selection = new SelectionModel<MargenBruto>(true, []);
  displayedColumns: string[] = ['ANIO','MES','TIPO','SUB_TIPO','SUB_TIPO','TipoCliente','Cliente','Distrito','Provincia','Departamento','CDG_VEND','DES_VEND','CDG_VEND_Ped','CDG_PROD',
                                'DES_PROD','CDG_EQV','CDG_LINP','DES_LIN','TipProd','NUM_PED','CDG_TPG','NUM_GUIA','LICITACION','FECHA','CANTIDAD','PRE_DFAC','IMP_DFAC','PRE_GUIA','COSTO',
                                'UNegocio','NUM_SEC','NUM_SEC','REF1_Ped','REF2_Ped','UN',
                                'RUC_CLI_M_CLIENT','DES_CLI','DIR_CLI','TEL_CLI','FAX_CLI','EMA_CLI','REP_CLI','CRD_SOL','CRD_DOL','CDG_TCLI','CDG_VEND_M_CLIENT','CDG_UDIS','SWT_CLI','SWT_IMP',
                                'CDG_CPAG','SWT_CLI','REF1','REF2','CDG_TDOC_M_CLIENT','CDG_USU','FEC_USU','HOR_USU','CDG_EAN','CDG_ZNA','SWT_REL','NOMBRE1','NOMBRE2','APE_PAT','APE_MAT',
                                'CDG_TPER','UBIGEO','SWT_PER','SWT_EXC','CDG_PAI','CDG_LIS',
                                'CDG_TAB','NUM_ITEM','DES_ITEM','ABR_ITEM','SWT_ITEM','TIP_ITEM','VAL_ITEM','REF1_D_TABLAS','SWT_REF1','REF2_D_TABLAS','SWT_REF2','REF3_D_TABLAS','SWT_REF3',
                                'REF4_D_TABLAS','SWT_REF4','REF5_D_TABLAS','SWT_REF5','SWT_DET','POR_MMIN','SWT_GUIA','SWT_SERV','TIP_EXIS','CDG_SUNAT','DES_SUNAT','CDG_USU_D_TABLAS','FEC_USU_D_TABLAS',
                                'HOR_USU_D_TABLAS','POR_PER','SWT_ACTF'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private MargenBrutoService : MargenbrutoService,
    public customPaginator: MatPaginatorIntl    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    debugger;
    this.MargenBrutoService = new MargenbrutoService(this.http);
    debugger;

     merge()
     .pipe(
      startWith({}),
      switchMap(() => {
        this.loading = true;
        return this.MargenBrutoService!.listar(
          "MOSTRAR DETALLE",
          undefined,
          undefined,
          1,
          1,
          1,
          0,
          0
        ).pipe(catchError(() => observableOf(null)));
      }),
      map(res => {

        this.loading = false;
        this.existRegistro = res === null;

        this.selection = new SelectionModel<MargenBruto>(true, []);

        if (res === null) {
          return [];
        }
        this.countRegistro = 0;

        console.log("PRUEBA LOG");
        console.log(res.items);
        return res.items;

      }),
    ).subscribe(data => (this.dataSource = data));

  }

}
