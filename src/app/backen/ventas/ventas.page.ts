import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Articulo, Factura, Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  articulos: Factura[]= [];

productos: Producto[]= [];
img='';
newFile= '';
isActive = true;
path = null;
iduser=null;

producto: Producto = {
  id: this.firestoreService.getid(),
  codigo: 1000,
  tipoArticulo :'',
  foto: '',
  nombre: '',
  unds: 0,
  fecha: moment(new Date()).format('DD-MM-YYYY'),
  mes: moment(new Date()).format('MMMM'),
  costo: 0,
  gasto: 0,
  precio: 0,
  precioMin: 0,
  descripcion: {
    procesador: {tipo: '', gen: ''},
    ram: {tipo: '', cant: ''},
    almacenamiento: {tipo: '', cant: ''},
    pantalla: ''}
  };

  newArticulo: Articulo =
    { descripcion: 'prueba',
      cant: 1,
      precioVenta: 0,
      descuento: 0,
      total: 0

    };

  newfactura: Factura = {
    fecha: moment(new Date()).toString(),
    fechaVencimiento: this.sumarDias(new Date(), 90).toString(),
    cliente: '',
    articulo: [],


    };

arr = [];

  constructor(public firestoreService: FirestoreService,
              public firestorage: FirestorageService,
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
        this.path=this.iduser+'.producto';

      this.getproductos();

      }else {
        this.alerta('Necesitas ingresar con tu usuario para usar el modulo de Facturación');

      }
    });

  }


  }

  ngOnInit() {


  }
  agregarFila(){

const art =this.newfactura.articulo;
const arr = [];


if(this.newArticulo.descripcion !=='' && this.newArticulo.cant !==0){
  this.newfactura.articulo.push(this.newArticulo );
  console.log(this.newfactura.articulo);
}



    this.newArticulo =
    { descripcion: '',
      cant: 1,
      precioVenta: 0,
      descuento: 0,
      total: 0

    };



  }

  nuevo(){
    console.log('nuevo');
  }

  guardarDatos(){
    console.log('guardar datos');
  }
  getproductos() {

    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
       //console.log(res);
       this.productos= res;


     } );
  }

  async alerta(msgAlerta: string){
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

  calcular(){

 const d = new Date();
console.log('este es el resultado:',this.sumarDias(d, 90));
}

sumarDias(fecha, dias){
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

}
