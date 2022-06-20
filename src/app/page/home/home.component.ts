import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GraficoService } from 'src/app/_service/grafico.service';
import { GraficoStock, Serie } from 'src/app/_model/grafico';
import { NotifierService } from '../component/notifier/notifier.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { SpinnerService } from '../component/spinner/spinner.service';

export type ChartOptions = {
  series: any;
  labels: any;
  chart: any;
  responsive: any;
  dataLabels: any;
  plotOptions: any;
  yaxis: any;
  xaxis: any;
  fill: any;
  tooltip: any;
  stroke: any;
  legend: any;
};

@Component({
  selector: 'app-inicio',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public reportegrafico1!: Partial<ChartOptions>;
  public reportegrafico2!: Partial<ChartOptions>;
  public reportegrafico3!: Partial<ChartOptions>;
  public reportegrafico4!: Partial<ChartOptions>;
  public reportesgrafico5!: Partial<ChartOptions>[];

  constructor(
    private usuarioService: UsuarioService,
    private spinner: SpinnerService,
    private graficoService : GraficoService,
    private notifier: NotifierService,
  ) { }
  
  usuario?: string = ''
  imgeinicio: string =environment.UrlImage + "home-bg-img.png";

  cantGraficos: number = 6;

  arrayCardClasses: string[] = ['gradient-orange tile p-2', 'gradient-red tile p-2', 'gradient-green tile p-2', 'gradient-brown tile p-2'];

  arrayListSerie: Serie[] = [];
  arrayEtiqueta: Serie = {};

  arrayLabel1: string[] = [];
  arraySeries1?: number[] = [];
  title1?: string;

  arrayLabel2: string[] = [];
  arraySeries2?: number[] = [];
  title2?: string;

  arrayLabel3: string[] = [];
  arraySeries3?: number[] = [];
  title3?: string;

  arrayLabel4: string[] = [];
  arraySeries4?: number[] = [];
  title4?: string;

  arrayLabel5: string[] = [];
  arraySeries5?: number[][] = [];
  title5?: string;

  //Barras circulares
  modelGrafico5: GraficoStock[] = [];
  arrayGrafico5_tot: number[] = [];

  arrayLabel6: string[] = [];
  arrayIcons6: string[] = [];
  arraySeries6?: number[] = [];
  title6?: string;

  tipoReporte?: number = 0;
  registro1?: boolean = false;
  registro2?: boolean = false;
  registro3?: boolean = false;
  registro4?: boolean = false;
  registro5?: boolean = false;
  registro5_1?: boolean = false;
  registro5_2?: boolean = false;
  registro5_3?: boolean = false;
  registro6?: boolean = false;

  $fechaInicio?: Date;
  $fechaFin?: Date;

  $fechaMin?: Date;
  $fechaMax?: Date;

  tiposSangre?: string[] = [];
  //cboTipoStock?: TipoStock[] = [];

  msgVacio?: string;

  ngOnInit(): void {

    this.usuario = this.usuarioService.sessionUsuario()?.nombreConocido;

    // this.chart1();
    // this.chart2();
    // this.chart3();
    // this.chart4();

    // this.msgVacio = '';

    // let $fecha = new Date();

    // this.$fechaInicio = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    // //this.$fechaInicio = new Date($fecha.getFullYear()-2,$fecha.getMonth(), 1 );
    // this.$fechaFin = new Date();

    // this.$fechaMax = $fecha;

    //Añade tipos de gráficos
    /*this.cboTipoStock?.push(new TipoStock(5,'Stock Disponible',''));
    this.cboTipoStock?.push(new TipoStock(6,'Stock por Habilitar',''));
    this.cboTipoStock?.push(new TipoStock(7,'Stock Reservado',''));
    this.cboTipoStock?.push(new TipoStock(8,'Stock en Cuarentena',''));
    this.cboTipoStock?.push(new TipoStock(9,'Stock Vencido',''));*/

    //this.curTipoStock = 5;

    // for (let i = 1; i <= this.cantGraficos; i++) {
    //   this.listargrafico(i);
    // }
  }

  listargrafico(idgrafico: number){

    this.msgVacio = 'Cargando datos para mostrar...';

    let session = this.usuarioService.sessionUsuario();

    this.usuario = session.nombre;

    //this.spinner.showLoading();

    this.graficoService.listar(session.codigobanco,this.$fechaInicio!,this.$fechaFin!,idgrafico).subscribe(data =>{
      //debugger;
      switch(idgrafico){
        case 1:
          this.arrayLabel1 = [];
          this.arraySeries1 = [];
          break;
        case 2:
          this.arrayLabel2 = [];
          this.arraySeries2 = [];
          break;
        case 3:
          this.arrayLabel3 = [];
          this.arraySeries3 = [];
          this.arrayListSerie = [] = [];
          this.arrayEtiqueta = {} = {};
          break;
        case 4:
          this.arrayLabel4 = [];
          this.arraySeries4 = [];
          break;
        case 5:
          this.registro5_1 = false;
          this.registro5_2 = false;
          this.registro5_3 = false;
          this.arrayLabel5 = [];
          this.arraySeries5 = [];
          this.modelGrafico5 = [];
          this.reportesgrafico5 = [];
          this.tiposSangre = [];
          break;
        case 6:
          this.arrayLabel6 = [];
          this.arraySeries6 = [];
          this.arrayIcons6 = [];
          break;
      }
      let count1 = 0;
      let count2 = 0;
      let count3 = 0;
      let count4 = 0;
      let count5 = 0;
      let count6 = 0;
      let graf3sub1: number[] =  [];
      let graf3sub2: number[] =[];
      let graf3sub3: number[] =[];
 
      let $grafico1 = data.filter(y=>y.ideGrafico==1);
      let $grafico2 = data.filter(y=>y.ideGrafico==2);
      let $grafico3 = data.filter(y=>y.ideGrafico==3);
      let $grafico4 = data.filter(y=>y.ideGrafico==4);
      let $grafico5 = data.filter(y=>y.ideGrafico==5);
      let $grafico6 = data.filter(y=>y.ideGrafico==6);        

        //debugger;

        /* GRAFICO 1 */
        if($grafico1.length > 0){
          this.title1 = $grafico1.filter(y=>y.titulo)[0].titulo;
          $grafico1.forEach(x=>{

            this.arrayLabel1.push(x.etiqueta!);
            let split = x.cantidades?.split('|');

            split!.forEach(y=>{
              count1 = parseInt(y) + count1;
              this.arraySeries1?.push(parseInt(y))
            });

          });
        }        

        /* GRAFICO 2 */
        if($grafico2.length > 0){
          this.title2 = $grafico2.filter(y=>y.titulo)[0].titulo;
          $grafico2.forEach(x=>{

              this.arrayLabel2.push(x.etiqueta!);
              let split = x.cantidades?.split('|');

              split!.forEach(y=>{
                count2 = parseInt(y) + count2;
                this.arraySeries2?.push(parseInt(y))
              });

          });
        }        

        /* GRAFICO 3 */
        if($grafico3.length > 0){
          this.title3 = $grafico3.filter(y=>y.titulo)[0].titulo;
          let subEtiqueta = $grafico3.filter(y=>y.subEtiquetas)[0]?.subEtiquetas;

          if(subEtiqueta!=undefined && subEtiqueta!=""){
            let splitEtiqueta = subEtiqueta?.split('|');
            
            splitEtiqueta?.forEach(x=>{
              this.arrayEtiqueta = new Serie();
              this.arrayEtiqueta.name= x;
              this.arrayEtiqueta.data= [];

              this.arrayListSerie.push(this.arrayEtiqueta);
            });         
          }

          $grafico3.forEach(x=>{
            this.arrayLabel3.push(x.etiqueta!);   

            let splitData1 = x.cantidades?.split('|')[0];
            let splitData2 = x.cantidades?.split('|')[1];
            let splitData3 = x.cantidades?.split('|')[2];       

            graf3sub1.push(parseInt(splitData1!));
            graf3sub2.push(parseInt(splitData2!));
            graf3sub3.push(parseInt(splitData3!));

            count3 = parseInt(splitData1!) + parseInt(splitData2!) + parseInt(splitData3!) + count3;
          });

          
          let counts =1;
          this.arrayListSerie.forEach(x=>{
            if(counts==1){
              x.data=graf3sub1;
            }else if(counts==2){
              x.data=graf3sub2;
            }else if(counts==3){
              x.data=graf3sub3;
            }
            counts++;
          });
        }

        /* GRAFICO 4 */
        if($grafico4.length > 0){
          this.title4 = $grafico4.filter(y=>y.titulo)[0].titulo;
          $grafico4.forEach(x=>{

            this.arrayLabel4.push(x.etiqueta!);
            let split = x.cantidades?.split('|');

            split!.forEach(y=>{
              count4 = parseInt(y) + count4;
              this.arraySeries4?.push(parseInt(y))
            });

          });
        }
        //debugger;

        /* GRAFICO 5 */
        if($grafico5.length > 0){
          this.title5 = $grafico5.filter(y=>y.titulo)[0].titulo;
          let etiqsangre = $grafico5.filter(y=>y.subEtiquetas)[0]?.subEtiquetas;

          if(etiqsangre!=undefined && etiqsangre!=""){
            this.tiposSangre = etiqsangre!.split('|');
            let vacio = this.tiposSangre.indexOf(' ');
            if(vacio >= 0)
              this.tiposSangre[vacio] = 'Ning.';
          }

          $grafico5.forEach(x=>{

            //Tabla de doble entrada
            this.arrayLabel5.push(x.etiqueta!);

            let tableRowStr = x.cantidades?.split('|');
            let tableRow: number[] = [];
            tableRowStr?.forEach(el => {
              tableRow.push(parseInt(el))
            });

            //Limita las cantidades según los tipos de sangre existentes
            tableRow = tableRow.slice(0,this.tiposSangre?.length);

            this.arraySeries5?.push(tableRow!);
  
            count5 = count5 + tableRow!.reduce((a, b) => a + (b || 0), 0);
          });

          //Barras circulares
          let arraySeries5_x: number[][] = [];

          arraySeries5_x = this.arraySeries5!;
          /*
          let indexGR = this.arrayLabel5?.indexOf('GR');
          if(indexGR >= 0){
            arraySeries5_x.push(this.arraySeries5[indexGR]);
          }
          let indexCR = this.arrayLabel5?.indexOf('CR');
          if(indexCR >= 0){
            arraySeries5_x.push(this.arraySeries5[indexCR]);
          }
          let indexPQ = this.arrayLabel5?.indexOf('PQ');
          if(indexPQ >= 0){
            arraySeries5_x.push(this.arraySeries5[indexPQ]);
          }*/

          this.arrayGrafico5_tot = [];
          for (let j = 0; j < this.tiposSangre!.length; j++) {
            let totPorSangre = 0;
            for (let i = 0; i < arraySeries5_x.length; i++) {
              totPorSangre = totPorSangre + arraySeries5_x[i][j];
            }
            this.arrayGrafico5_tot.push(totPorSangre);
          }
          //debugger;

          //Busca primer mayor
          this.creaSubgrafico5(this.tiposSangre!, arraySeries5_x, 1);
          //Busca segundo mayor
          this.creaSubgrafico5(this.tiposSangre!, arraySeries5_x, 2);
          //Busca otros
          this.creaSubgrafico5(this.tiposSangre!, arraySeries5_x, 3);
        }

        /* GRAFICO 6 */
        if($grafico6.length > 0){
          this.title6 = $grafico6.filter(y=>y.titulo)[0].titulo;
          $grafico6.forEach(x=>{

            this.arrayLabel6.push(x.etiqueta!);
            this.arrayIcons6.push(x.icono!);
            this.arraySeries6?.push(parseInt(x.cantidades!));

          });
        }        
        
         /* VALIDADO REGISTRO PARA MOSTRAR EL GRAFICO */
        switch (idgrafico){
          case 1:
            this.registro1 = (count1>0)? true: false;
            this.chart1();
            break;
          case 2:
            this.registro2 = (count2>0)? true: false;
            this.chart2();
            break;
          case 3:
            this.registro3 = (count3>0)? true: false;
            this.chart3();
            break;
          case 4:
            this.registro4 = (count4>0)? true: false;
            this.chart4();
            break;
          case 6:
            this.registro6 = (count6>0)? true: false;
        }
        
      this.msgVacio = 'No se han encontrado datos para mostrar';
      //this.spinner.hideLoading();

    });   
  }

  creaSubgrafico5(tiposSangre: string[], arraySeries5_x: number[][], order: number){
    var graf: GraficoStock = new GraficoStock();
    var mayor = Math.max(...this.arrayGrafico5_tot);
    if(this.arrayGrafico5_tot.length > 0 && mayor>0){            
      graf.arrayLabel = this.arrayLabel5;
      let j = this.arrayGrafico5_tot.indexOf(mayor)
      if(order == 3){
        graf.subTitle = 'Otros';
        //Junta todos los valores en uno solo
        for (let i = 0; i < arraySeries5_x.length; i++) {
          for (let k = 0; k < this.arrayGrafico5_tot.length; k++) {
            if(j !== k)
              arraySeries5_x[i][j] = arraySeries5_x[i][j] + arraySeries5_x[i][k];
          }
        }
      }
      else{
        graf.subTitle = tiposSangre[j];
      }      
      //Asigna valores y los borra
      for (let i = 0; i < arraySeries5_x.length; i++) {
        graf.arraySeries!.push(arraySeries5_x[i][j]);
        arraySeries5_x[i][j] = 0; //Borra
      }
      this.arrayGrafico5_tot[j] = -1;
      graf.total = graf.arraySeries!.reduce((a, b) => a + (b || 0), 0);
      graf.max = Math.max(...graf.arraySeries!);
      graf.visible = graf.total > 0;

      this.modelGrafico5.push(graf);

      if(graf.visible){
        if(order == 1)
        this.registro5_1 = true;
        if(order == 2)
          this.registro5_2 = true;
        if(order == 3)
          this.registro5_3 = true;
      }      
    }
    this.chart5(graf);
  }

  onDateChange(){
    
    if(this.$fechaInicio==null || this.$fechaFin==null){
      this.notifier.showNotification(environment.ALERT,'Mensaje','Las fechas son obligatorio');
    }

    for (let i = 1; i <= this.cantGraficos; i++) {
      this.listargrafico(i);
    }
  }

  chart1(){
    this.reportegrafico1 = {
      series: this.arraySeries1,
      chart: {
        width: 380,
        type: "pie"
      },
      labels: this.arrayLabel1,
      responsive: [
        {
          breakpoint: 450,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  chart2(){
    this.reportegrafico2 = {
      series: this.arraySeries2,
      chart: {
        width: 430,
        type: "pie"
      },
      labels: this.arrayLabel2,
      responsive: [
        {
          breakpoint: 450,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  chart3(){
    this.reportegrafico3 = {
      series: this.arrayListSerie,
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "100%",
          barHeight: '100%',
        }
      },
      dataLabels: {
        enabled: true,       
        position: 'top',
        style: {
          fontSize: '10px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold'
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.arrayLabel3
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val=String) {
            return val;
          }
        }
      }
    };
  }

  chart4(){
    this.reportegrafico4 = {
      series: this.arraySeries4,
      chart: {
        width: 430,
        type: "pie"
      },
      labels: this.arrayLabel4,
      responsive: [
        {
          breakpoint: 450,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  chart5(graf: GraficoStock){
    //debugger;    

    var reportegrafico5!: Partial<ChartOptions>;

    if(graf.visible){
      //Ajustes iniciales
    var arrayAux: number[] = [];
    graf.arraySeries!.forEach(val => {
      arrayAux.push(val*100/graf.max!);
    });
    reportegrafico5 = {
      series: arrayAux,
      chart: {
        height: 360,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              fontSize: '16px',
            },
            value: {
              fontSize: '16px',
              formatter: function (val: string) {
                return Math.round(parseFloat(val)*graf.max!/100);              
              }
            },
            total: {
              show: true,
              label: graf.subTitle,
              formatter: function () {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return graf.total!;
              }
            }
          }
        }
      },
      //colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
      labels: graf.arrayLabel,
      legend: {
        show: true,
        floating: true,
        fontSize: '12px',
        position: 'left',
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true,
        },
        // markers: {
        //   size: 0
        // },
        formatter: function(seriesName: string, opts: { w: { globals: { series: { [x: string]: string; }; }; }; seriesIndex: string | number; }) {
          return seriesName + ":  " + Math.round(parseFloat(opts.w.globals.series[opts.seriesIndex])*graf.max!/100);
        },
        itemMargin: {
          vertical: 3
        }
      },
      responsive: [{
        breakpoint: 450,
        options: {
          // chart: {
          //   width: 270
          // },
          legend: {
            position: 'bottom',
            offsetX: 0,
            offsetY: 0
          }
        }
      }]
      };
    }    
    this.reportesgrafico5!.push(reportegrafico5);
  }

  valorMaximo(num1: number, num2: number){
    return num1>num2?num1:num2;
  }

  reiniciaFechas(){
    let $fecha = new Date();

    this.$fechaInicio = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    //this.$fechaInicio = new Date($fecha.getFullYear()-2,$fecha.getMonth(), 1 );
    this.$fechaFin = new Date();

    for (let i = 1; i <= this.cantGraficos; i++) {
      this.listargrafico(i);
    }
  }
}
