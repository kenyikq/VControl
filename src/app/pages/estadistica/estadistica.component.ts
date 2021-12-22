
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss'],
})
export class EstadisticaComponent /*implements AfterViewInit, OnInit*/ {
  // Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable
  // that we have added to the canvas element in the HTML template.
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
}

 /* barChart: any;
  doughnutChart: any;
  lineChart: any;

  tipoAbuso: GraficoTipoAbuso = {
    indigenica: 0,
    explotacion: 0,
    sexual: 0,
    agresion: 0,
    otro: 0,
  };

 seguimiento: GraficoSeguimiento = {
    recibido: 0,
    evaluando: 0,
    enProceso: 0,
    cerrado: 0,};
  path='/reporte';





  constructor(public firestoreService: FirestoreService) { }

  // When we try to call our chart to initialize methods in ngOnInit() it shows an error nativeElement of undefined.
  // So, we need to call all chart methods in ngAfterViewInit() where @ViewChild and @ViewChildren will be resolved.
  ngOnInit( ){

  }
  async ngAfterViewInit() {
await this.getcasos();
    this.getSeguimiento();
    this.doughnutChartMethod();
   // this.lineChartMethod();




  }


 async getcasos(){

 await this.firestoreService.getCollectionquery<Reporte>(this.path, 'tipoAbuso', '==', 'Indigencia').subscribe( ind => {
   this.tipoAbuso.indigenica = ind.push();



  } );
  await this.firestoreService.getCollectionquery<Reporte>(this.path, 'tipoAbuso', '==', 'Explotación Infantil').subscribe( exp => {
    this.tipoAbuso.explotacion = exp.push();


   } );

   await this.firestoreService.getCollectionquery<Reporte>(this.path, 'tipoAbuso', '==', 'Agresión Física').subscribe( exp => {
    this.tipoAbuso.agresion = exp.push();

   } );

   await this.firestoreService.getCollectionquery<Reporte>(this.path, 'tipoAbuso', '==', 'Otro').subscribe( exp => {
    this.tipoAbuso.otro = exp.length;

   } );

   await this.firestoreService.getCollectionquery<Reporte>(this.path, 'tipoAbuso', '==', 'Abuso Sexual').subscribe( exp => {
    this.tipoAbuso.sexual = exp.length;
    this.barChartMethod();
   } );


}
inactive(id: string){
  const active = document.getElementById(id);

  active.classList.remove('active');
}

seleccionA(){
  this.inactive('1');
  this.inactive('pri');
  this.inactive('3');
  this.inactive('4');
  this.inactive('2');
}

getSeguimiento(){
  this.firestoreService.getCollectionquery<Reporte>(this.path, 'estatus', '==', 'Recibido').subscribe( res => {
    this.seguimiento.recibido = res.length;

   } );
   this.firestoreService.getCollectionquery<Reporte>(this.path, 'estatus', '==', 'Evaluando').subscribe( res => {
    this.seguimiento.evaluando = res.length;

   } );
   this.firestoreService.getCollectionquery<Reporte>(this.path, 'estatus', '==', 'En proceso').subscribe( res => {
    this.seguimiento.enProceso = res.length;


   } );
   this.firestoreService.getCollectionquery<Reporte>(this.path, 'estatus', '==', 'Cerrado').subscribe( res => {
    this.seguimiento.cerrado = res.length;
    this.doughnutChartMethod();
   } );
}



 async  barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type
    //of chart we want to use, and the type of data we want;to display.
   this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Agresión', 'Indigencia', 'Explotacion', 'Abuso Sexual', 'Otro'],
        datasets: [{
          label: 'Casos',
          data: [this.tipoAbuso.agresion,this.tipoAbuso.indigenica, this.tipoAbuso.explotacion,
             this.tipoAbuso.sexual, this.tipoAbuso.otro,],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });




  }

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Recibidos', 'Evaluando', 'Procesando', 'Cerrado'],
        datasets: [{
          label: 'Estatus',
          data: [this.seguimiento.recibido, this.seguimiento.evaluando, this.seguimiento.enProceso, this.seguimiento.cerrado],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderWidth: 2,
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]

        }]
      }
    });
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
        datasets: [
          {
            label: 'Sell per week',
            fill: false,
            lineTension: 0.3,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [this.seguimiento.recibido, this.seguimiento.evaluando, this.seguimiento.enProceso, this.seguimiento.cerrado],
            spanGaps: false,
          }
        ]
      }
    });
  }
}


/*
html de grafico de linea
<ion-card>
        <ion-card-header style="text-align: center; font-weight: bold;">
          Line Chart
        </ion-card-header>
        <ion-card-content>
          <canvas #lineCanvas style="position: relative; height:20vh; width:40vw"></canvas>
        </ion-card-content>
      </ion-card> */
