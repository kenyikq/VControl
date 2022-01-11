import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Articulo, Cliente, Factura, Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { async } from '@firebase/util';
import { Subscription } from 'rxjs';


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


    };

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

//console.log(this.total);
}

  agregarFila(){
this.getArticulo();

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

 async guardarDatos(){


if(this.newCliente.nombre.length> 2 && this.newCliente.telefono.length> 6 ){
  await this.gestionarCliente().then(
      res=> {this.guardarFactura();
      });

   }
   else{
     this.alerta('Favor llenar los datos del cliente correctamente');
   }

   this.reducirInventario();
   this.goAnOtherPage('home');
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
}

  getdatos() {
    const path='usuario/'+this.iduser+'/clientes';



    this.firestoreService.getCollection<Cliente>(path).subscribe( res => {
      this.clientes=res;

    } );

    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
       this.productos= res;
     } );


  }


  getArticulo(){


this.firestoreService.getCollectionquery<Producto>(this.path, 'codigo', '==', this.codigo).subscribe(res=>{

this.newArticulo.cant= res[0].unds;
this.newArticulo.descripcion= res[0].nombre;
this.newArticulo.precioVenta= res[0].precio;
this.newArticulo.codigo= res[0].codigo;

});



  }


  getCliente(){
    const path='usuario/'+this.iduser+'/clientes';

    this.firestoreService.getCollectionquery<Cliente>(path, 'codigo', '==', this.codclient).subscribe(res=>{

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

  if(telefonos.includes(this.newCliente.codigo) === false)//si el cliente no existe
 {
  await this.firestoreService.getultimodoc<Cliente>(path).subscribe(resp=>{
    if(resp){
    this.newCliente.codigo=  resp[0].codigo + 1; //asigna el nuevo codigo del cliente
    } });

    this.firestoreService.createDoc(this.newCliente, path, this.newCliente.codigo.toString()).then(res=>{

    }).catch(err=>{
      console.log('Error al crear cliente ',err);
    });

 } ;

 this.newfactura.cliente=this.newCliente.nombre;

}



async  guardarFactura(){

  const path='usuario/'+this.iduser+'/clientes/'+this.newCliente.codigo+'/factura';
  this.presentLoading();
 this.newfactura.cliente=this.newCliente.nombre;
  this.firestoreService.createDoc(this.newfactura, path, this.newfactura.codigo.toString()).then( ans =>{
      this.loading.dismiss().then( respuesta => {
        this.presentToast('Acción ralizada con exito');
        this.goAnOtherPage('/home');
       });
    }).catch(err=>{this.alerta('Error: '+err);});

}

codigofactura(){
  const path='usuario/'+this.iduser+'/clientes/'+this.newCliente.codigo+'/factura';

    this.firestoreService.getultimodoc<Factura>(path).subscribe(resp=>{
      if(resp){
       this.newfactura.codigo = resp[0].codigo + 1;
       console.log(this.newfactura.codigo);
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

       this.firestoreService.getCollectionget<Producto>(pathprod, 'id','==','P'+articulo.codigo).subscribe
       (res=>{
           stockActual= res[0].unds-articulo.cant;
           this.cont=this.cont +1;
           console.log('producto',res);
if(stockActual >= 0){
  this.db.collection(pathprod).doc('P'+articulo.codigo.toString()).update({unds: stockActual});

}
  else{ this.alerta('No cuenta con inventario suficiente');}

          if(this.newfactura.articulo.length === this.cont)
          {
            console.log('ultimo if');
          return;}
          });
        }
        });
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
}
