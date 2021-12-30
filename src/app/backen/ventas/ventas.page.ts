import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Articulo, Factura, Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';
import { provideRoutes } from '@angular/router';


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
agregarArticulo= false;
editarArticulo= false;
indice= null;
codigo= null;
subtotal= null;
descuento= null;
total=0;
cont = 0;
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
      cant: null,
      precioVenta: null,
      descuento: null,
      total: null

    };

  newfactura: Factura = {
    fecha: moment(new Date()).toString(),
    fechaVencimiento: this.sumarDias(new Date(), 90).toString(),
    cliente: '',
    articulo: [],


    };

nombresArt = [];

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

  comprobarExistencia(){

  // const array = this.newfactura.articulo;

//array.forEach((articulo) => { //Recorro primer arreglo
  //Luego recorro la propiedad descripcion dentro del segundo arreglo
 // this.nombresArt.push(articulo.descripcion);
//});
//nombre.indexOf(articuloNombre)
const index= this.nombresArt.indexOf(this.newArticulo.descripcion);// Preguntar por el indice del articulo




  }
calculoTotalesFactura(){
  this.descuento= null;
   this.subtotal = null;
this.cont =this.cont+1;
 this.newfactura.articulo.forEach((articulo)=>{
    articulo.total= (articulo.precioVenta* articulo.cant);
   this.descuento=this.descuento + articulo.descuento;
   this.subtotal = this.subtotal + articulo.total;
   console.log('este es el sub total ',this.cont ,this.subtotal);

 });
  this.total= -this.descuento + this.subtotal;

console.log(this.total);
}

  agregarFila(){
this.getArticulo();

if(this.indice!==null && this.newArticulo.cant !==0){

  this.newfactura.articulo[this.indice]=this.newArticulo;
}

else{

  if(this.nombresArt.indexOf(this.newArticulo.descripcion)!== -1 && this.newArticulo.cant !==null){

  const index = this.nombresArt.indexOf(this.newArticulo.descripcion);//actuliza el valor dentro del arry

  this.newfactura.articulo[index]=this.newArticulo;
}

else{

  if(this.newArticulo.cant !==null && this.newArticulo.descripcion !==''){
  this.newfactura.articulo.push(this.newArticulo );
    this.nombresArt.push(this.newArticulo.descripcion);}
  else{this.alerta('Debe de elegir al menos un producto');}
}



}




    this.newArticulo =
    { descripcion: '',
      cant: null,
      precioVenta: null,
      descuento: null,
      total: null

    };

this.agregarArticulo= false;
this.editarArticulo= false;
this.indice= null;
this.calculoTotalesFactura();

  }


  mostrarDatos(articulo: Articulo){
    this.agregarArticulo= true;

    this.newArticulo = articulo;//llena los campos con los datos del articulo seleccionado

    this.indice = this.newfactura.articulo.indexOf(articulo);//obtiene el indice del elemento del arry

    this.editarArticulo= true;//para ocultar el boton de eliminar
  }

  eliminarFila(){
    this.newfactura.articulo.splice(this.indice, 1);
    this.nombresArt.splice(this.indice, 1);//como si fuera un index
    this.editarArticulo= false;
    this.agregarArticulo = false;
    this.indice= null;
    this.calculoTotalesFactura();
  }

  nuevo(){
    this.agregarArticulo= true;
  }

  guardarDatos(){
    console.log('guardar datos');
  }
cancelar(){
  this.descuento=null;
  this.subtotal=null;
  this.total= null;
  this.newfactura.articulo=[];
  this.newfactura.cliente='';
  this.newArticulo =
    { descripcion: '',
      cant: null,
      precioVenta: null,
      descuento: null,
      total: null

    };
  this.editarArticulo= false;
    this.agregarArticulo = false;
    this.indice= null;
}

  getproductos() {

    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
       //console.log(res);
       this.productos= res;


     } );
  }

  getArticulo(){


this.firestoreService.getCollectionquery<Producto>(this.path, 'codigo', '==', this.codigo).subscribe(res=>{

this.newArticulo.cant= res[0].unds;
this.newArticulo.descripcion= res[0].nombre;
this.newArticulo.precioVenta= res[0].precio;

});



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
        }
      ]

    });

    await alert.present();
  }



sumarDias(fecha, dias){
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

}
