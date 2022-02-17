import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Chart } from 'chart.js'; //para usarlo debes intstalar npm install chart.js@2.9.4 --save
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { GraficoTransacciones, Messes, MovimientosContables } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss'],
})
export class EstadisticaComponent implements AfterViewInit, OnInit {
  // Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable
  // that we have added to the canvas element in the HTML template.
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;


  barChart: any;
  doughnutChart: any;
  lineChart: any;
  iduser= '';

transaciones: GraficoTransacciones ={
mes: moment(new Date()).format('MMMM'),
capital: 0,
venta: 0,
compra: 0,
gasto: 0,

};

meses: Messes={
enero: 5,
febrero: 15,
marzo: 20,
abril: 25,
mayo: 30,
junio: 35,
julio: 40,
agosto: 45,
septiembre: 50,
octubre: 55,
noviembre: 60,
diciembre: 65,

};


path= null;

  constructor(public firestoreService: FirestoreService,
              public log: FirebaseauthService,
              public alertController: AlertController,
              public navCrt: NavController,
    ) {
     if ( this.log.stateauth())
    {
    this.log.stateauth().subscribe( res=>{

      if (res !== null){
        this.iduser= res.uid;
      this.path='usuario/'+this.iduser+'/movimientosContable';

        this.getEstado();

      }else {
        this.alerta('Necesitas ingresar con tu usuario para usar el modulo de estadisticas');

      }
    });

  }

  }

  // When we try to call our chart to initialize methods in ngOnInit() it shows an error nativeElement of undefined.
  // So, we need to call all chart methods in ngAfterViewInit() where @ViewChild and @ViewChildren will be resolved.
  ngOnInit( ){

  }

  async ngAfterViewInit() {

        this.doughnutChartMethod();
        this. barChartMethod();
        this.lineChartMethod();




  }



 async getEstado(){
  const anio = moment(new Date()).format('YYYY');
  const mes = moment(new Date()).format('MMMM');
  const path1 =
    'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;

  this.firestoreService
    .getCollectionquery<GraficoTransacciones>(path1, 'mes', '==', mes)
    .subscribe((res) => {
     

      if (res.length > 0) {

        this.transaciones = res[0];
      }
     
    this.barChartMethod();
    this. lineChartMethod();
    
   } );

   this.firestoreService.getCollection(path1).subscribe(res=>{
console.log('colecion de totals',res);

   });


   }


seleccionA(id: string){
  this.seleccion();
  this.inactive('pri');
  this.inactive('3');
  this.inactive('4');
  this.inactive('5');
  this.active(id);

}
//para marcar como seleccionado la opcion dentro del menu
async seleccion(){

  this.inactive('1');
  this.inactive('2');






}
active(id: string){
  const active = document.getElementById(id);
  active.classList.value.match('active');

  active.classList.add('active');
  this.getEstado();
}

inactive(id: string){
  const active = document.getElementById(id);
  this.getEstado();
  active.classList.remove('active');
}

async alerta(msgAlerta: string){
  if(this.iduser=== null){
    const alert = await this.alertController.create({
    cssClass: 'normal',
    header: 'Alerta!',
    message: '<strong>'+msgAlerta +'</strong>',
     buttons: [
      {
        text: 'Ok',
        role: 'Pk',
        cssClass: 'secondary',
        handler: (blah) => {

        }
      }, {
        text: 'Ingresar',
        handler: () => {
          this.navCrt.navigateRoot('/login');
        }
      }
    ]
  });
  await alert.present();
}
else{
  const alert = await this.alertController.create({
    cssClass: 'normal',
    header: 'Alerta!',
    message: '<strong>'+msgAlerta +'</strong>',
    buttons: [
      {
        text: 'Ok',
        role: 'Pk',
        cssClass: 'secondary',
        handler: (blah) => {

        }
      }
    ]

  });

  await alert.present();

}
}


 async  barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type
    //of chart we want to use, and the type of data we want;to display.
   this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Capital','Compra','Gasto','Venta'],
        datasets: [{
          label: '',
          data: [this.transaciones.capital,this.transaciones.compra,this.transaciones.gasto, this.transaciones.venta] ,
          backgroundColor: [
            '#E0FFFF',
            'yellow',
            '#F08080',
            '#ADFF2F',

          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            '#FFD700',
            'red',
            '#ADFF2F',
          ],
          borderWidth: 1.5,
          hoverBackgroundColor: [
            'rgba(54, 162, 235, 1)',
            '#FFD700',
            'red',
            'green',
          ]
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
      },
    });




  };

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Recibidos', 'Evaluando', 'Procesando', 'Cerrado'],
        datasets: [{
          label: 'Estatus',
          data: [30,15, 10, 5],
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
            data: Object.values(this.meses) ,
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
