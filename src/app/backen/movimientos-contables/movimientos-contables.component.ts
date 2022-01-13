import { Component, OnInit } from '@angular/core';
import { MovimientosContables } from 'src/app/models';
import * as moment from 'moment';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { take } from 'rxjs/operators';

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
    codigo: 0,
    tipoTransaccion:'',
    descripcion:'',
    fecha: moment(new Date()).format('DD-MM-YYYY'),
    mes: moment(new Date()).format('MMMM'),
    monto: 0

  };
  iduser='';
  path=null;
  actualizarTransaccion = false;


  constructor(
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

      this.getTransacciones();

      }else {
        this.alerta('Necesitas ingresar con tu usuario para usar el modulo de trasacciones');

      }
    });

  }
   }

  ngOnInit() {}

  crearnuevaTransaccion(){
    this.agregarTransaccion= true;
    this.actualizarTransaccion = false;
  }

  nuevo(){

    this.agregarTransaccion= false;
    this.actualizarTransaccion = false;
    this.transaccion={
      codigo: 0,
      tipoTransaccion:'',
      descripcion:'',
      fecha: moment(new Date()).format('MM-DD-YYYY'),
      mes: moment(new Date()).format('MMMM'),
      monto: 0

};
console.log('estes es nuevo');
  }

getTransacciones() {

  this.firestoreService.getCollection<MovimientosContables>(this.path).subscribe( res => {
     //console.log(res);
     this.transacciones= res;

   } );
}

mostrarDatos(transaction: MovimientosContables){
  this.agregarTransaccion = true;
  this.actualizarTransaccion=false;
  this.transaccion = transaction;
  console.log('Esta es la transaccion ',transaction);
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
            this.firestoreService.deleteDoc(this.path,transaccion.codigo.toString());
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
let codigo=0;

if (this.actualizarTransaccion=== false){

await this.firestoreService.getultimodoc<MovimientosContables>(path).pipe(take(1)).subscribe(res=>{
  console.log(res);
  if (res.length>0){
  codigo= res[0].codigo +1;
  }
  else{ codigo = 1;}

this.transaccion.codigo=codigo;


this.firestoreService.createDoc(this.transaccion ,path, codigo.toString());

 });
}

else{
  this.transaccion.codigo=codigo;

  console.log('Esta es la transaccion else ',this.transaccion);
this.firestoreService.createDoc(this.transaccion ,path, codigo.toString());

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
}
