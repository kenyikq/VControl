import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Chart } from 'chart.js'; //para usarlo debes intstalar npm install chart.js@2.9.4 --save
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { GraficoTransacciones, Factura, MovimientosContables } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { threadId } from 'worker_threads';

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
  valueSelected:any;
  anio: any;

transaciones: GraficoTransacciones ={
mes: moment(new Date()).format('MMMM'),
capital: 0,
venta: 0,
compra: 0,
gasto: 0,

};

meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
mes=[];
venta=[];
tituloMes='';


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
     this.valueSelected= moment(new Date()).format('M');
     this.anio  = moment(new Date()).format('YYYY');
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

  
  const mes = moment(new Date()).format('M');
  const path1 =
    'usuario/' + this.iduser + '/movimientosContable/totales/' + this.anio;

    await  this.firestoreService.database.collection<GraficoTransacciones>('usuario/' + this.iduser + '/movimientosContable/totales/'+this.anio ,
    ref => ref.orderBy('mes')).valueChanges().subscribe(res=>{
this.mes=[];
this.venta=[];
res.forEach((mes) => { //Recorro primer arreglo
  this.mes.push(this.meses[parseInt(mes.mes)-1]);
 this.venta.push(mes.venta);
  
});


   });

   await  this.firestoreService.database.collection<Factura>('usuario/'+this.iduser+'/clientes' ,
   ref => ref.orderBy('mes')).valueChanges().subscribe(res=>{
console.log('colecion de clientes',res);
/*res.forEach((factura) => { //Recorro primer arreglo
factura.articulo.forEach((articulo)=>{
  console.log(articulo.tipoArticulo);
  console.log(articulo.total);
});
  console.log(factura.articulo);
 
});*/


  });

  

  this.firestoreService
    .getCollectionquery<GraficoTransacciones>(path1, 'mes', '==', this.valueSelected)
    .subscribe((res) => {
     

      if (res.length > 0) {

        this.transaciones = res[0];
      }
    this.tituloMes=  this.meses[parseInt(this.valueSelected)-1];
    this.barChartMethod();
    this. lineChartMethod();
    
   } );

 

   }

   segmentChanged(ev: any, ev2 : any){

    
    console.log(typeof ev2);

    if(typeof ev2 === 'string'){
      this.anio= ev2;
      this.valueSelected= ev.detail.value;
    }
    else{this.anio= ev2.detail.value;
    this.mes=ev;
    }
   
    console.log(this.valueSelected, ', ',this.anio);
    this.transaciones ={
      mes: moment(new Date()).format('MMMM'),
      capital: 0,
      venta: 0,
      compra: 0,
      gasto: 0,
      
      };
    this.getEstado();
     
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
        labels: this.mes,
        datasets: [
          {
            label: 'Total Ventas',
            fill: true,
            lineTension: 0.3,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 1.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 3,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: this.venta, // Object.values(this.venta) ,
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
