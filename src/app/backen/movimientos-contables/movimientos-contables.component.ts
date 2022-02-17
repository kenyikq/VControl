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

  transaccion: MovimientosContables={
    codigo: '',
    tipoTransaccion:'',
    descripcion:'',
    fecha: moment(new Date()).toString(),
    anio: moment(new Date()).format('YYYY'),
    mes: moment(new Date()).format('MMMM'),
    dia: moment(new Date()).format('DD'),
    monto: 0,
    idTransaccion: 'Mov'

  };
  iduser='';
  path=null;
  actualizarTransaccion = false;
  cont=0;

  totales: GraficoTransacciones = {
    mes: moment(this.transaccion.fecha).format('MMMM'),
    capital: 0,
    venta: 0,
    compra: 0,
    gasto: 0,
  };

filas=15;

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
      this.getTransacciones(this.filas);
      this.getDatos();

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
      mes: moment(new Date()).format('MMMM'),
      monto: 0,
      idTransaccion: 'mov',


};
this.cont=0;
this.getTransacciones(this.filas);

  }
  getDatos() {
    const anio = moment(this.transaccion.fecha).format('YYYY');
    const mes = moment(this.transaccion.fecha).format('MMMM');
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

getTransacciones(filas=this.filas) {
  this.cont=0;

  this.firestoreService.getCollection<MovimientosContables>(this.path,filas).pipe().subscribe( res => {
     //console.log(res);
     this.cont=0;
     this.transacciones= res;

   } );

   const anio = moment(this.transaccion.fecha).format('YYYY');
   const mes = moment(this.transaccion.fecha).format('MMMM');
   const path =
     'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;

   this.firestoreService
     .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
     .pipe(take(1))
     .subscribe((res) => {
       console.log('Get movimientos: ', res);

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
            this.getionTotales(this.transaccion.monto*(-1));
            this.firestoreService.deleteDoc(this.path,transaccion.codigo).then(()=>{

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
  const path= 'usuario/'+this.iduser+'/movimientosContable';

this.transaccion.anio= moment(this.transaccion.fecha).format('YYYY');
this.transaccion.dia= moment(this.transaccion.fecha).format('DD');
this.transaccion.mes= moment(this.transaccion.fecha).format('MMMM');

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
  while (this.cont < i);

  }



  async getionTotales(transaccion: number) {
    this.getDatos();
    const anio = this.transaccion.anio;
    const mes = this.transaccion.mes;
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

          else{
            this.totales.capital =
            this.totales.capital + transaccion;
            this.db.collection(path).doc(mes).update({capital: this.totales.capital});
          }



        }






        else{

          if(this.transaccion.tipoTransaccion==='Ventas')
          {
            this.totales.venta = transaccion;
          this.firestoreService.createDoc(this.totales, path, mes);

          }

          else if(this.transaccion.tipoTransaccion==='Compra de Mercancía'){
            this.totales.compra =transaccion;
            this.firestoreService.createDoc(this.totales, path, mes);
          }

          else if(this.transaccion.tipoTransaccion==='Gasto'){
            this.totales.gasto =  transaccion;
            this.firestoreService.createDoc(this.totales, path, mes);
          }

          else{
            this.totales.capital = transaccion;
            this.firestoreService.createDoc(this.totales, path, mes);
          }

}
      });


  }
}
