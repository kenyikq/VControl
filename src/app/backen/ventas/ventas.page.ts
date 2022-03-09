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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  ionicForm: FormGroup;
  isSubmitted = false;
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
subtotal= 0;
descuento= 0;
total=0;
cont = 0;
loading: any;
codigo = null;
codclient=null;
subscribir: Subscription;
filas= 30;
disable= false;


producto: Producto = {
  id: this.firestoreService.getid(),
  codigo: 1000,
  tipoArticulo :'',
  foto: '',
  nombre: '',
  unds: 0,
  fecha: moment(new Date()).toString(),
  mes: moment(new Date()).format('M'),
  costo: 0,
  gasto: 0,
  precio: 0,
  precioMin: 0,
  condicion:'Usado como Nuevo',
  descripcion: {
    caracteristicas:'',
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
    fecha: moment(new Date()).toString(),
  };

  newArticulo: Articulo =
    { codigo: 0,
      tipoArticulo:'',
      descripcion: '',
      cant: 0,
      precioVenta: 0,
      descuento: 0,
      total: 0

    };

  newfactura: Factura = {
    fechacreacion: moment(new Date()).toString(),
    codigo: 0, //funcionara como id
    fecha: moment(new Date()).toString(),
    fechaVencimiento: this.sumarDias(new Date(), 90).toString(),
    cliente: this.newCliente.nombre,
    articulo: [],
    total: 0,


    };

    totales: GraficoTransacciones = {
      mes: moment(this.newfactura.fecha).format('M'),
      capital: 0,
      venta: 0,
      compra: 0,
      gasto: 0,
    };


     transaccion: MovimientosContables={
    codigo: '',
    tipoTransaccion:'',
    descripcion:'',
    fecha: moment(new Date()).toString(),
    mes: moment(new Date()).format('M'),
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
              public formBuilder: FormBuilder
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
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
     // email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
     celular: ['', [Validators.required, Validators.pattern('[0-9]{3}[ -][0-9]{3}[ -][0-9]{4}')]]
    });

  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
     // console.log(this.ionicForm.value);
      return true;
    }
  }

  get errorControl() {
    return this.ionicForm.controls;
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
      tipoArticulo:'',
      descripcion: '',
      cant: 0,
      precioVenta: null,
      descuento: 0,
      total: 0

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
  //console.log('aqui la respuesta ',this.submitForm());
  if(this.submitForm()){
  await this.gestionarCliente().then(
      res=> {this.guardarFactura().then(()=>{
        this.reducirInventario().then(resp=>{this.goAnOtherPage('home');
      }).catch(err=>{this.alerta('Error al guardar datos : '+err)});
    });
      
      });
      this.disable=false;
   }
   else{
     this.alerta('Favor llenar los datos del cliente correctamente');
   }


  }


cancelar(){
  this.descuento=0;
  this.subtotal=0;
  this.total= 0;
  this.newfactura.articulo=[];
  this.newfactura.cliente='';
  this.newArticulo =
    { codigo: 0,
     tipoArticulo:'',
      descripcion: '',
      cant: 0,
      precioVenta: 0,
      descuento: 0,
      total: 0

    };
    this.disable=false;
    this.newCliente =
    {
      //id: this.firestoreService.getid(),
      codigo: 1000,
      nombre:'',
      telefono:'',
      fecha: moment(new Date()).toString(),
    };

    this.newCliente =
    {
      //id: this.firestoreService.getid(),
      codigo: 1000,
      nombre:'',
      telefono:'',
      fecha: moment(new Date()).toString(),
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
      fecha: moment(new Date()).toString(),
      mes: moment(new Date()).format('M'),
      costo: 0,
      gasto: 0,
      precio: 0,
      precioMin: 0,
      condicion: 'Usado Como Nuevo',
      descripcion: {
        caracteristicas:'',
        procesador: {tipo: '', gen: ''},
        ram: {tipo: '', cant: ''},
        almacenamiento: {tipo: '', cant: ''},
        pantalla: ''}
      };
     this.newfactura.codigo= 0;

      this.productos=[];
      this.isSubmitted = false;
    this.getdatos();

}

  getdatos(filas= 1000) {
  this.getCliente();

    const path='usuario/'+this.iduser+'/clientes';



    this.firestoreService.getCollection<Cliente>(path,filas).subscribe( res => {
      this.clientes=res;

    } );

   const collection = this.firestoreService.database.collection<Producto>(this.path, ref=>ref.where('unds','>',0))
   .valueChanges().pipe(take(1)).subscribe(res => {
       this.productos= res;
   } );


     const anio = moment(this.newfactura.fecha).format('YYYY');
     const mes = moment(this.newfactura.fecha).format('M');
     const path1 =  'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;
 
     this.firestoreService
       .getCollectionquery<GraficoTransacciones>(path1, 'mes', '==', mes)
       .pipe(take(1))
       .subscribe((res) => {
           if (res.length > 0) {
           this.totales = res[0];
         }
         else{this.totales.venta=this.newfactura.total;}
       });


  }


  getArticulo(prod: Producto){

this.newArticulo.cant= prod.unds;
this.newArticulo.descripcion= prod.nombre;
this.newArticulo.precioVenta= prod.precio;
this.newArticulo.codigo= prod.codigo;
this.newArticulo.tipoArticulo= prod.tipoArticulo;



  }


  getCliente(){
    const path='usuario/'+this.iduser+'/clientes';

    this.firestoreService.getCollectionquery<Cliente>(path, 'codigo', '==', this.codclient).subscribe(res=>{

    this.newCliente.nombre= res[0].nombre;
    this.newCliente.telefono= res[0].telefono;
    this.newCliente.codigo= res[0].codigo;
this.disable=true;
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

actulizarVencimiento(){
 this.newfactura.fechaVencimiento= this.sumarDias(this.newfactura.fecha, 90).toString();
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

 const collection = this.firestoreService.database.collection<Producto>(path, ref=>ref.where('telefono','==',this.newCliente.telefono))
 .valueChanges().pipe(take(1)).subscribe(res => {
    if(res.length === 0){//si el cliente no existe
      this.firestoreService.getultimodoc<Cliente>(path).subscribe(resp=>{
        if(resp.length>0){
        this.newCliente.codigo=  resp[0].codigo + 1; //asigna el nuevo codigo del cliente

      this.firestoreService.createDoc(this.newCliente, path, 'C'+this.newCliente.codigo.toString()).then(respu=>{
        this.codigofactura();
      }).catch(err=>{ console.log('Error al crear cliente ',err); });
      }
      else{this.newCliente.codigo=1000;
      this.firestoreService.createDoc(this.newCliente, path, 'C'+this.newCliente.codigo.toString()).then(re=>{
        this.codigofactura();
      }).catch(err=>{ console.log('Error al crear cliente ',err); }); } });


    }

    else{//si el cliente existe

      this.firestoreService.createDoc(this.newCliente, path, 'C'+this.newCliente.codigo.toString()).then(respues=>{
        this.codigofactura();
      }).catch(err=>{ console.log('Error al crear cliente ',err); });
    }
 } );

 this.newfactura.cliente=this.newCliente.nombre;

}

comprobarTelefono(){
  const path= 'usuario/'+this.iduser+'/clientes';
  const collection = this.firestoreService.database.collection<Producto>(path, ref=>ref.where('telefono','==',this.newCliente.telefono))
  .valueChanges().pipe(take(1)).subscribe(res => {
    if(res.length>0){console.log('EL telefono se encuentra registrado');}
    else{console.log('EL telefono no se encuentra registrado');}
  });
}


async  guardarFactura(){

  const path='usuario/'+this.iduser+'/clientes/C'+this.newCliente.codigo+'/factura';
  this.presentLoading();
 this.newfactura.cliente=this.newCliente.nombre;

  this.firestoreService.createDoc(this.newfactura, path, 'F'+this.newfactura.codigo.toString()).then( ans =>{
      this.loading.dismiss().then( respuesta => {

        this.crearTransaccion().catch(err=>{this.alerta('Error al Crear Transaccion: '+err);});
        this.presentToast('Acción ralizada con exito');

       });
    }).catch(err=>{this.alerta('Error: '+err);this.loading.dismiss();});
    this.goAnOtherPage('/home');

}

codigofactura(){
  const path='usuario/'+this.iduser+'/clientes/C'+this.newCliente.codigo+'/factura';

    this.firestoreService.getultimodoc<Factura>(path,'codigo').subscribe(resp=>{
      if(resp.length>0){

       this.newfactura.codigo = resp[0].codigo + 1;
       
          }
       else{
       this.newfactura.codigo =0;}

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
  
  this.getdatos();
  const anio = moment(this.newfactura.fecha).format('YYYY');
  const mes = moment(this.newfactura.fecha).format('M');
  this.totales.mes= moment(this.newfactura.fecha).format('M');
  const path =
    'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;



await    this.firestoreService
    .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
    .pipe(take(1))
    .subscribe((res) => {

      if (res.length > 0) {
        this.totales = res[0];
     

        this.totales.venta =
    this.totales.venta + transaccion;
    this.db.collection(path).doc(mes).update({venta: this.totales.venta});

      }

      else{this.totales.capital=0;
        this.totales.compra=0;
        this.totales.gasto=0;
        this.totales.venta = transaccion;
            this.firestoreService.createDoc(this.totales, path, mes);}
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



     async crearTransaccion() {

      const path = 'usuario/' + this.iduser + '/movimientosContable';
      let transaccion =0;


            transaccion=this.newfactura.total;
              this.agregartransaccion().then(()=>{this.getionTotales(transaccion);});

    }

  async  agregartransaccion(){
      const pathT= 'usuario/'+this.iduser+'/movimientosContable';
      let codigo=0;

 
      this.transaccion.descripcion='Venta de mercancia';
      this.transaccion.tipoTransaccion='Ventas';
      this.transaccion.fecha= this.newfactura.fecha;
      this.transaccion.mes= moment( this.newfactura.fecha).format('M');
      this.transaccion.anio= moment(this.transaccion.fecha).format('YYYY');
      this.transaccion.dia= moment(this.transaccion.fecha).format('DD');
      this.transaccion.monto= this.newfactura.total;
      this.transaccion.codigo=  'C'+this.newCliente.codigo+'TF'+this.newfactura.codigo;
      this.transaccion.idTransaccion= this.firestoreService.getid();

        this.firestoreService.createDoc(
        this.transaccion,
        pathT,
        this.transaccion.idTransaccion
      );

  

  }

}
