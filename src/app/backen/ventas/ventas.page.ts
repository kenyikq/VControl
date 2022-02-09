import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Articulo, Cliente, Factura, GraficoTransacciones, MovimientosContables, Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { async } from '@firebase/util';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  articulos: Factura[]= [];

clientes: Cliente[]= [];
productos: Producto[]= [];
img='';
newFile= '';
isActive = true;
path = null;
iduser=null;
agregarArticulo= false;
editarArticulo= false;
indice= null;
subtotal= null;
descuento= null;
total=0;
cont = 0;
loading: any;
codigo = null;
codclient=null;
subscribir: Subscription;

totales: GraficoTransacciones = {
  mes: moment(new Date()).format('MMMM'),
  capital: 0,
  venta: 0,
  compra: 0,
  gasto: 0,
};

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

  newCliente: Cliente =
  {
    //id: this.firestoreService.getid(),
    codigo: 1000,
    nombre:'',
    telefono:'',
    fecha: moment(new Date()).format('DD-MM-YYYY'),
  };

  newArticulo: Articulo =
    { codigo: 0,
      descripcion: '',
      cant: null,
      precioVenta: null,
      descuento: null,
      total: null

    };

  newfactura: Factura = {
    codigo: 0, //funcionara como id
    fecha: moment(new Date()).toString(),
    fechaVencimiento: this.sumarDias(new Date(), 90).toString(),
    cliente: this.newCliente.nombre,
    articulo: [],
    total: 0,


    };

     transaccion: MovimientosContables={
    codigo: 0,
    tipoTransaccion:'',
    descripcion:'',
    fecha: moment(new Date()).format('DD-MM-YYYY'),
    mes: moment(new Date()).format('MMMM'),
    anio: moment(new Date()).format('YYYY'),
    dia: moment(new Date()).format('DD'),
    monto: 0,
    idTransaccion: '',

  };
  contador=0;


nombresArt = [];

  constructor(public db: AngularFirestore,
              public firestoreService: FirestoreService,
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
        this.path='usuario/'+this.iduser+'/producto';

      this.getdatos();// obtiene todos los articulos y todos lo clientes y los almacenas en sus respect variables

      }else {
        this.alerta('Necesitas ingresar con tu usuario para usar el modulo de Facturación');

      }
    });

  }


  }

  ngOnInit() {


  }

  comprobarExistencia(){

   const array = this.newfactura.articulo;

array.forEach((articulo) => { //Recorro primer arreglo
  //Luego recorro la propiedad descripcion dentro del segundo arreglo
 this.nombresArt.push(articulo.descripcion);
});
//nombre.indexOf(articuloNombre)
const index= this.nombresArt.indexOf(this.newArticulo.descripcion);// Preguntar por el indice del articulo




  }
calculoTotalesFactura(){
  this.descuento= null;
   this.subtotal = null;
 this.newfactura.articulo.forEach((articulo)=>{
    articulo.total= (articulo.precioVenta* articulo.cant);
   this.descuento=this.descuento + articulo.descuento;
   this.subtotal = this.subtotal + articulo.total;

 });
  this.total= -this.descuento + this.subtotal;
  this.newfactura.total = this.total;


}

  agregarFila(){


if(this.indice!==null && this.newArticulo.cant !==0){

  this.newfactura.articulo[this.indice]=this.newArticulo;

}

else{

  if(this.nombresArt.indexOf(this.newArticulo.descripcion)!== -1 && this.newArticulo.cant !==null){//

  const index = this.nombresArt.indexOf(this.newArticulo.descripcion);//encuentra el valor dentro del arry

  this.newfactura.articulo[index]=this.newArticulo;//actuliza el valor dentro del arry

}

else{

  if(this.newArticulo.cant !==null && this.newArticulo.descripcion !==''){
  this.newfactura.articulo.push(this.newArticulo );
    this.nombresArt.push(this.newArticulo.descripcion);
    }
  else{this.alerta('Debe de elegir al menos un producto');}
}



}




    this.newArticulo =
    { codigo: 0,
      descripcion: '',
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

 async guardarDatos(){ //Guarda los datos de la factura y reduce inventario

if(this.newCliente.nombre.length> 2 && this.newCliente.telefono.length> 6 ){
  await this.gestionarCliente().then(
      res=> {this.guardarFactura();
     // this.reducirInventario().then(resp=>{this.goAnOtherPage('home');});
      });

   }
   else{
     this.alerta('Favor llenar los datos del cliente correctamente');
   }


  }


cancelar(){
  this.descuento=null;
  this.subtotal=null;
  this.total= null;
  this.newfactura.articulo=[];
  this.newfactura.cliente='';
  this.newArticulo =
    { codigo: 0,
      descripcion: '',
      cant: null,
      precioVenta: null,
      descuento: null,
      total: null

    };

    this.newCliente =
    {
      //id: this.firestoreService.getid(),
      codigo: 1000,
      nombre:'',
      telefono:'',
      fecha: moment(new Date()).format('DD-MM-YYYY'),
    };

    this.newCliente =
    {
      //id: this.firestoreService.getid(),
      codigo: 1000,
      nombre:'',
      telefono:'',
      fecha: moment(new Date()).format('DD-MM-YYYY'),
    };

  this.editarArticulo= false;
    this.agregarArticulo = false;
    this.indice= null;

   this.producto = {
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
     this.newfactura.codigo= 0;

      this.productos=[];
    this.getdatos();

}

  getdatos() {
  this.getCliente();
    const path='usuario/'+this.iduser+'/clientes';



    this.firestoreService.getCollection<Cliente>(path).subscribe( res => {
      this.clientes=res;

    } );

   const collection = this.firestoreService.database.collection<Producto>(this.path, ref=>ref.where('unds','>',0))
   .valueChanges().pipe(take(1)).subscribe(res => {
       this.productos= res;
   } );


     const anio = moment(new Date()).format('YYYY');
     const mes = moment(new Date()).format('MMMM');
     const path1 =
       'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;

     this.firestoreService
       .getCollectionquery<GraficoTransacciones>(path1, 'mes', '==', mes)
       .pipe(take(1))
       .subscribe((res) => {
           if (res.length > 0) {
           this.totales = res[0];
         }
       });


  }


  getArticulo(prod: Producto){

this.newArticulo.cant= prod.unds;
this.newArticulo.descripcion= prod.nombre;
this.newArticulo.precioVenta= prod.precio;
this.newArticulo.codigo= prod.codigo;


  }


  getCliente(){
    const path='usuario/'+this.iduser+'/clientes';

    this.firestoreService.getCollectionquery<Cliente>(path, 'codigo', '==', this.codclient).subscribe(res=>{
console.log('cliente ',res);
    this.newCliente.nombre= res[0].nombre;
    this.newCliente.telefono= res[0].telefono;
    this.newCliente.codigo= res[0].codigo;

    this.codigofactura();


    });

    this.codclient=null;
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

async presentToast(msg: string) {
  const toast = await this.toastCtrl.create({
   message: msg,
   duration: 2000,
   position: 'bottom'
 });

toast.present();
}

async gestionarCliente(){
  const path= 'usuario/'+this.iduser+'/clientes';

const telefonos = [];

  this.clientes.forEach((cliente)=>{
    telefonos.push(cliente.telefono);

 });

  if(telefonos.includes(this.newCliente.telefono) === false)//si el cliente no existe
 {console.log(telefonos.includes(this.newCliente.telefono));
  await this.firestoreService.getultimodoc<Cliente>(path).subscribe(resp=>{
    if(resp){
    this.newCliente.codigo=  resp[0].codigo + 1; //asigna el nuevo codigo del cliente
    } });

    this.firestoreService.createDoc(this.newCliente, path, 'C'+this.newCliente.codigo.toString()).then(res=>{
      this.codigofactura();
    }).catch(err=>{
      console.log('Error al crear cliente ',err);
    });

 } ;

 this.newfactura.cliente=this.newCliente.nombre;

}



async  guardarFactura(){

  const path='usuario/'+this.iduser+'/clientes/C'+this.newCliente.codigo+'/factura';
  this.presentLoading();
 this.newfactura.cliente=this.newCliente.nombre;
  this.firestoreService.createDoc(this.newfactura, path, 'F'+this.newfactura.codigo.toString()).then( ans =>{
      this.loading.dismiss().then( respuesta => {

        this.crearTransaccion();
        this.presentToast('Acción ralizada con exito');

       });
    }).catch(err=>{this.alerta('Error: '+err);});
    this.goAnOtherPage('/home');

}

codigofactura(){
  const path='usuario/'+this.iduser+'/clientes/C'+this.newCliente.codigo+'/factura';

    this.firestoreService.getultimodoc<Factura>(path).subscribe(resp=>{
      if(resp.length>0){
        console.log('este es el codigo',resp);
       this.newfactura.codigo = resp[0].codigo + 1;
          }
       else{console.log('no encotro nada');}

     });

}
async reducirInventario(){
 const pathprod ='usuario/'+this.iduser+'/producto';
 let stockActual = 0;

this.cont= 0;
        this.newfactura.articulo.forEach((articulo)=>{

          if(this.cont <= this.newfactura.articulo.length  ){
            const collection = this.firestoreService.database.collection<Producto>(pathprod, ref=>ref.where('id','==','P'+articulo.codigo))
            .valueChanges().pipe(take(1)).subscribe(res => {

           stockActual= res[0].unds-articulo.cant;
           this.cont=this.cont +1;

if(stockActual >= 0){
  this.db.collection(pathprod).doc('P'+articulo.codigo.toString()).update({unds: stockActual});

}
  else{ this.alerta('No cuenta con inventario suficiente');}

          if(this.newfactura.articulo.length === this.cont)
          {
          return;}
          });
        }
        });


}



async getionTotales(transaccion: number) {
  const anio = moment(new Date()).format('YYYY');
  const mes = moment(new Date()).format('MMMM');
  const path =
    'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;
  this.totales.venta =
    this.totales.venta + transaccion;

  this.firestoreService.createDoc(this.totales, path, mes);
}

async presentLoading(){
  this.loading = await this.loadingController.create({
   cssClass: 'normal',
   message:'Guardando',
  });
  await this.loading.present();
  }

  goAnOtherPage(pagina: string) {
    this.navCtrl.navigateRoot(pagina);}



     async crearTransaccion() {

      const path = 'usuario/' + this.iduser + '/movimientosContable';
      let transaccion =0;

      await this.firestoreService.getCollectionquery<MovimientosContables>
      (path,'idTransaccion','==',this.iduser+'TF'+this.newfactura.codigo).
      pipe(take(1)).subscribe(res=>{

        if(res.length === 0){

              transaccion=this.newfactura.total;
              this.agregartransaccion();
              this.getionTotales(transaccion);


        }

        else{

          transaccion= this.newfactura.total - res[0].monto;
          this.getionTotales(transaccion).then(()=>{this.agregartransaccion();});

        }


      });

    }

  async  agregartransaccion(){
      const pathT= 'usuario/'+this.iduser+'/movimientosContable';
      let codigo=0;

  await this.firestoreService.getultimodoc<MovimientosContables>(pathT).pipe(take(1)).subscribe(res=>{

    if (res.length>0){
    codigo= res[0].codigo +1;
    }
    else{ codigo = 1;}
  });

    this.transaccion.descripcion='venta de mercancia';
      this.transaccion.tipoTransaccion='Venta';
      this.transaccion.fecha= this.newfactura.fecha;
      this.transaccion.mes= moment( this.newfactura.fecha).format('MMMM');
      this.transaccion.anio= moment(this.transaccion.fecha).format('YYYY');
      this.transaccion.dia= moment(this.transaccion.fecha).format('DD');
      this.transaccion.monto= this.newfactura.total;
      this.transaccion.codigo= codigo;
      console.log('este es el codigo: ',codigo);
      this.transaccion.idTransaccion= this.iduser+'TF'+codigo;


    this.firestoreService.createDoc(
        this.transaccion,
        pathT,
        this.transaccion.idTransaccion
      );

  }



}


