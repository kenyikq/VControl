import { Component, OnInit } from '@angular/core';
import { GraficoTransacciones, MovimientosContables } from 'src/app/models';
import * as moment from 'moment';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-movimientos-contables',
  templateUrl: './movimientos-contables.component.html',
  styleUrls: ['./movimientos-contables.component.scss'],
})
export class MovimientosContablesComponent implements OnInit {
  agregarMovimiento: false;
  movimientos=[];
  agregarTransaccion= false;
  transacciones: MovimientosContables[]= [];
  valueSelected= 'Todo';

  transaccion: MovimientosContables={
    codigo: '',
    tipoTransaccion:'',
    descripcion:'',
    fecha: moment(new Date()).toString(),
    anio: moment(new Date()).format('YYYY'),
    mes: moment(new Date()).format('M'),
    dia: moment(new Date()).format('DD'),
    monto: 0,
    idTransaccion: 'Mov'

  };
  iduser='';
  path=null;
  actualizarTransaccion = false;
  cont=0;

  totales: GraficoTransacciones = {
    mes: moment(this.transaccion.fecha).format('M'),
    capital: 0,
    venta: 0,
    compra: 0,
    gasto: 0,
  };
capital=0;
filas=30;

  constructor(
    public db: AngularFirestore,
    public firestoreService: FirestoreService,
    public log: FirebaseauthService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertController: AlertController,
  ) {

    if ( this.log.stateauth())
    {
    this.log.stateauth().subscribe( res=>{

      if (res !== null){
        this.iduser= res.uid;
      this.path='usuario/'+this.iduser+'/movimientosContable';
      this.getDatos();
      this.getTransacciones();
      this.capitalDisponible();

   }else {
        this.alerta('Necesitas ingresar con tu usuario para usar el modulo de trasacciones');

      }
    });

  }
   }

  ngOnInit() {}

  crearnuevaTransaccion(){
    this.nuevo();
    this.agregarTransaccion= true;
    this.transaccion.fecha= moment(new Date()).toString();
    this.getTransacciones();

  }

  nuevo(){

    this.agregarTransaccion= false;
    this.actualizarTransaccion = false;
    this.transaccion={
      codigo: '',
      tipoTransaccion:'',
      descripcion:'',
      fecha: moment(new Date()).toString(),
      anio: moment(new Date()).format('YYYY'),
    dia: moment(new Date()).format('DD'),
      mes: moment(new Date()).format('M'),
      monto: 0,
      idTransaccion: 'mov',


};
this.cont=0;
this.getTransacciones(this.filas);

  }
  getDatos() {
    const anio = moment(this.transaccion.fecha).format('YYYY');
    const mes = moment(this.transaccion.fecha).format('M');
    const path =
      'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;

    this.firestoreService
      .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
      .pipe(take(1))
      .subscribe((res) => {


        if (res.length > 0) {
          this.totales = res[0];
        }
      });

     
  }

  segmentChanged(ev: any){
    
    this.valueSelected= ev.detail.value;
    this.getTransacciones(this.filas);
    


  }

getTransacciones(filas=this.filas) {
  this.cont=0;

if(this.valueSelected === 'Todo'){

  this.firestoreService.getCollection<MovimientosContables>(this.path).pipe().subscribe( res => {

    //console.log(res);
  this.transacciones= res.sort((a,b)=> Date.parse(a.fecha)- Date.parse(b.fecha));
  this.transacciones= this.transacciones.slice(this.transacciones.length-filas);
this.transacciones= this.transacciones.sort((a,b)=> Date.parse(b.fecha)- Date.parse(a.fecha));
 // let aNuevo = aNumeros.slice(aNumeros.length-5);
 this.cont=0;

} );

}

else{this.firestoreService.getCollectionquery<MovimientosContables>(this.path,'tipoTransaccion','==',this.valueSelected).
subscribe(resp=>{this.cont=0;
  this.transacciones=resp.sort((a,b)=> Date.parse(a.fecha)- Date.parse(b.fecha));
  this.transacciones= this.transacciones.slice(this.transacciones.length - filas);
  this.transacciones= this.transacciones.sort((a,b)=> Date.parse(b.fecha)- Date.parse(a.fecha));

});
  
  
}
  

   const anio = moment(this.transaccion.fecha).format('YYYY');
   const mes = moment(this.transaccion.fecha).format('M');
   const path =
     'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;

   this.firestoreService
     .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
     .pipe(take(1))
     .subscribe((res) => {


       if (res.length > 0) {
         this.totales = res[0];
       }
     });
}

mostrarDatos(transaction: MovimientosContables){
  this.agregarTransaccion = true;
  this.actualizarTransaccion=true;
  this.transaccion = transaction;

}
  agregarFila(){
    if(this.validacion()){
      this.guardar();
      this.agregarTransaccion= false;

    }
    };




  async eliminarFila(transaccion: MovimientosContables){

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Confirmacion!',
      message: '<strong>Resuro que desea eliminar el Articulo</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {


            this.transaccion=transaccion;

            
            this.firestoreService.deleteDoc(this.path,transaccion.idTransaccion).then(()=>{
             this.transaccion.tipoTransaccion=transaccion.tipoTransaccion;
              this.getionTotales(transaccion.monto*(-1));
        } );
            this.presentToast('Transaccion eliminada');

            this.nuevo();
          }
        }
      ]
    });

    await alert.present();
  }


async  guardar(){
  this.getDatos();
  const path= 'usuario/'+this.iduser+'/movimientosContable';

this.transaccion.anio= moment(this.transaccion.fecha).format('YYYY');
this.transaccion.dia= moment(this.transaccion.fecha).format('DD');
this.transaccion.mes= moment(this.transaccion.fecha).format('M');

if (this.actualizarTransaccion=== false){

this.transaccion.idTransaccion=this.firestoreService.getid();

this.firestoreService.createDoc(this.transaccion ,path, this.transaccion.idTransaccion);
this.getionTotales(this.transaccion.monto);



}

else{

   await this.firestoreService.getCollectionquery<MovimientosContables>(path,'idTransaccion','==',this.transaccion.idTransaccion).
  pipe(take(1)).subscribe(res=>{
    this.getionTotales(this.transaccion.monto - res[0].monto);
    this.firestoreService.createDoc(this.transaccion ,path, this.transaccion.idTransaccion);


  });




}



this.agregarTransaccion=false;


}


validacion(){
 if (this.transaccion.descripcion=== ''|| this.transaccion.monto ===0 || this.transaccion.tipoTransaccion === ''
 ){



   this.alerta('Todos los campos son queridos');
 return false;
 }

 else
 {

  return true;

}
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
            this.navCtrl.navigateRoot('/login');
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
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
     message: msg,
     duration: 2000,
     position: 'bottom'
   });

  toast.present();
  }

  fila(){
    const i =this.transacciones.length;

    do {
      if(this.cont>this.transacciones.length){
        this.cont=0;
      }
      this.cont=this.cont+1;
    return this.cont;
  }
  while (this.cont < this.filas);

  }

async capitalDisponible(){
  const path =      'usuario/' + this.iduser + '/movimientosContable';
await this.firestoreService.database.collection<MovimientosContables>(path).valueChanges().
subscribe(res=>{this.capital=0;

  res.forEach((transaccion)=>{
if (transaccion.tipoTransaccion=== 'Capital'){
this.capital=this.capital+transaccion.monto;

}//Primer if

else if (transaccion.tipoTransaccion=== 'Compra de Mercancía'){
  this.capital=this.capital-transaccion.monto;
  
  }//segundo if

  else if (transaccion.tipoTransaccion=== 'Ventas'){
    this.capital=this.capital+transaccion.monto;
    
    }//tercer if

    else if (transaccion.tipoTransaccion=== 'Gasto'){
      this.capital=this.capital-transaccion.monto;
      
      }//tercer if
  

  });//foreach
  




});//termina el subscribe



}

  async getionTotales(transaccion: number) {

    const anio =moment(this.transaccion.fecha).format('YYYY') ;
    const mes = moment(this.transaccion.fecha).format('M') ;;
    this.totales.mes=mes;

    const path =
      'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;


      await    this.firestoreService
      .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
      .pipe(take(1))
      .subscribe((res) => {


       if (res.length > 0) {
          this.totales = res[0];
 

          if(this.transaccion.tipoTransaccion==='Ventas')
          {
            this.totales.venta =
          this.totales.venta + transaccion;
          this.db.collection(path).doc(mes).update({venta: this.totales.venta});

          }

          else if(this.transaccion.tipoTransaccion==='Compra de Mercancía'){
            this.totales.compra =
            this.totales.compra + transaccion;
            this.db.collection(path).doc(mes).update({compra: this.totales.compra});
          }

          else if(this.transaccion.tipoTransaccion==='Gasto'){
            this.totales.gasto =
            this.totales.gasto + transaccion;
            this.db.collection(path).doc(mes).update({gasto: this.totales.gasto});
          }

          else if(this.transaccion.tipoTransaccion==='Capital'){
            this.totales.capital =
            this.totales.capital + transaccion;
            this.db.collection(path).doc(mes).update({capital: this.totales.capital});
          }

          else{console.log('no encontor igualdad');}

        }






        else{

          if(this.transaccion.tipoTransaccion==='Ventas')
          {
           this.totales.capital=0;
          this.totales.compra=0;
          this.totales.gasto=0;
          
            this.totales.venta = transaccion;
          this.firestoreService.createDoc(this.totales, path, mes);

          }

          else if(this.transaccion.tipoTransaccion==='Compra de Mercancía'){
            this.totales.capital=0;
          this.totales.compra=transaccion;
          this.totales.gasto=0;
          this.totales.venta = 0;
           
            this.firestoreService.createDoc(this.totales, path, mes);
          }

          else if(this.transaccion.tipoTransaccion==='Gasto'){
            this.totales.capital=0;
          this.totales.compra=0;
            this.totales.venta = 0;
            this.totales.gasto =  transaccion;
            this.firestoreService.createDoc(this.totales, path, mes);
          }

          else{
           this.totales.compra=0;
          this.totales.gasto=0;
          this.totales.venta = 0;
            this.totales.capital = transaccion;
            this.firestoreService.createDoc(this.totales, path, mes);
          }

}
      });


  }
}
