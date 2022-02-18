import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { GraficoTransacciones, MovimientosContables, Producto} from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController,LoadingController, NavController,ToastController,} from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';
import { async } from '@firebase/util';
import { take } from 'rxjs/operators';
import { pipe, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  img = '';
  newFile = '';
 valueSelected='todos';
  newproducto: Producto = {
    id: 'P1000',
    codigo: 1000,
    tipoArticulo: '',
    foto: '',
    nombre: '',
    unds: 0,
    fecha: moment(new Date()).toString(),
    mes: moment(new Date()).format('M').toString(),
    costo: 0,
    gasto: 0,
    precio: 0,
    precioMin: 0,
    descripcion: {
      caracteristicas:'',
      procesador: { tipo: '', gen: '' },
      ram: { tipo: '', cant: '' },
      almacenamiento: { tipo: '', cant: '' },
      pantalla: '',
    },
  };

  transaccion: MovimientosContables = {
    codigo: '',
    tipoTransaccion: '',
    descripcion: '',
    fecha: moment(new Date()).toString(),
    mes: moment(new Date()).format('M'),
    anio: moment(new Date()).format('YYYY'),
    dia: moment(new Date()).format('DD'),
    monto: 0,
    idTransaccion:'',
  };

  totales: GraficoTransacciones = {
    mes: moment(this.newproducto.fecha).format('M'),
    capital: 0,
    venta: 0,
    compra: 0,
    gasto: 0,
  };

  isActive = true;
  valorneto: number;
  loading: any;
  idArticulo: 1000;

  actualizarProducto = false;
  crearProducto=false;
  path = null;
  iduser = null;
  subscriber: Subscription;
  

  constructor(
    public db: AngularFirestore,
    public firestoreService: FirestoreService,
    public cd: ChangeDetectorRef,
    public firestorage: FirestorageService,
    public log: FirebaseauthService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertController: AlertController
  ) {
    if (this.log.stateauth()) {
      this.log.stateauth().subscribe((res) => {
        if (res !== null) {
          this.iduser = res.uid;
          this.path = 'usuario/' + this.iduser + '/producto';

          this.limpiarCampos();
          this.getDatos();
          this.caracteristicasArticulos();

        } else {
          this.alerta(
            'Necesitas ingresar con tu usuario para usar el modulo de Productos'
          );
        }
      });
    }
  }

  ngOnInit() {}

  nuevo() {
    this.newproducto = {
      id: 'P1000',
      codigo: 1000,
      tipoArticulo: 'Laptop',
      foto: '',
      nombre: '',
      unds: 1,
      fecha: moment(new Date()).toString(), //para mostrar la fecha anctual al crear nuevo producto
      mes: moment(new Date()).format('M').toString(),
      costo: 0,
      gasto: 0,
      precio: 0,
      precioMin: 0,
      descripcion: {
        caracteristicas:'',
        procesador: { tipo: null, gen: null },
        ram: { tipo: null, cant: null },
        almacenamiento: { tipo: null, cant: null },
        pantalla: null,
      },


    };


    this.firestoreService.getultimodoc<Producto>(this.path).subscribe((res) => {

      if (res !== null) {
        const sum: number = res[0].codigo + 1;
        this.newproducto.codigo = sum;
      }
      this.newproducto.id = 'P' + this.newproducto.codigo;
    });
    this.caracteristicasArticulos();
    
    this.crearProducto=true;
  }

  caracteristicasArticulos(){
  if(this.newproducto.tipoArticulo ==='laptop'){
this.newproducto.descripcion= {
  caracteristicas:'',
  procesador: { tipo: 'Core i5', gen: '4ta' },
  ram: { tipo: 'DDR3', cant: '8gb' },
  almacenamiento: { tipo: 'HHD', cant: '320' },
  pantalla: '14',
};
  }
  }

  limpiarCampos() {
    this.nuevo();
    //this.getDatos();
    this.actualizarProducto = false;
    this.crearProducto=false;
  }

  goAnOtherPage() {
    this.navCtrl.navigateRoot('/home');
  }

  segmentChanged(ev: any){
    this.valueSelected= ev.detail.value;
      this.filtrar();
  }

  filtrar() {


    if(this.valueSelected === 'disponibles'){

   const  subscriber = this.firestoreService.database.collection<Producto>(this.path,
      ref=>ref.where('unds','!=',0))
    .valueChanges().pipe(take(1)).subscribe((res) => {
      
      this.productos = res;
    });}

    if(this.valueSelected=== 'vendidos'){

      const subscriber = this.firestoreService.database.collection<Producto>(this.path,
       ref=>ref.where('unds','==',0))
     .valueChanges().pipe(take(2)).subscribe((res) => {
       
       this.productos = res;
     });}
     if(this.valueSelected=== 'todos') {


const  subscriber = this.firestoreService.database.collection<Producto>(this.path)
      .valueChanges().subscribe((res) => {
        
        this.productos = res;

      });}


  }

  mostrarDatos(producto: Producto) {
    this.actualizarProducto = true;
    this.crearProducto=true;
    this.newproducto = producto;
    
  }

  async newImg(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.newFile = event.target.files[0];
      reader.onload = (image) => {
        this.img = image.target.result as string;
        this.newproducto.foto = this.img;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async deleteProducto(producto: Producto) {

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Confirmacion!',
      message: '<strong>Seguro que desea eliminar el Articulo</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.firestoreService.deleteDoc(this.path, producto.id).then(res=>{
              this.newproducto=producto;
              this.newproducto.fecha=moment(new Date).toString();
              this.newproducto.unds= this.newproducto.unds*(-1);
              this.transaccion.descripcion = this.newproducto.nombre+' eliminado' ;
              this.crearTransaccion();
             }).finally(()=>{this.limpiarCampos();});// toma los datos del prodcucto y los reduce del totalCompra

            this.presentToast('Accion realizada Exitosamente');
          },
        },
      ],
    });

    await alert.present();
  }

  getDatos() {
this.filtrar();
    const anio = moment(this.newproducto.fecha).format('YYYY');
    const mes = moment(this.newproducto.fecha).format('M');
    const path =
      'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;

    this.firestoreService
      .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
      .pipe(take(1))
      .subscribe((res) => {


        if (res.length > 0) {
          this.totales = res[0];

        }

        else{this.totales.compra = (this.newproducto.costo + this.newproducto.gasto) * this.newproducto.unds;}
      });
if(this.actualizarProducto=== false){
  this.firestoreService.database.collection<Producto>(this.path,
    ref=>ref.where('codigo','>',0).orderBy('codigo').limitToLast(1)).valueChanges()
  .pipe(take(1))
  .subscribe((resp) => {
    if (resp.length > 0) {
      this.newproducto.codigo = resp[0].codigo + 1; //asigna el nuevo codigo del producto
      this.newproducto.id = 'P' +this.newproducto.codigo;
      console.log('este es el codigo ', (resp[0].codigo+1), this.newproducto.codigo, this.newproducto.id);
    }

  });

}
     
      this.caracteristicasArticulos();
  }

  async guardarDatos() {

    if (this.validacion()) {
   

       this.crearTransaccion();
      this.guardar()
        .finally(() => {
         this.limpiarCampos();});

    }
    this.getDatos();
    
  }

  async getionTotales(transaccion: number) {

    const anio = moment(this.newproducto.fecha).format('YYYY');
    const mes = moment(this.newproducto.fecha).format('M');
    this.totales.mes= moment(this.newproducto.fecha).format('M');
    const path =
      'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;
      

  await    this.firestoreService
      .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
      .pipe(take(1))
      .subscribe((res) => {

        if (res.length > 0) {
          this.totales = res[0];


          this.totales.compra =
          this.totales.compra + transaccion;
          this.db.collection(path).doc(mes).update({compra: this.totales.compra});
          this.firestoreService.createDoc(this.totales, path, mes);
        }
        else{
          console.log('crear nuevo totales', transaccion);
          this.totales.capital=0;
          this.totales.compra=transaccion;
          this.totales.gasto=0;
          this.totales.venta = 0;

         
              this.firestoreService.createDoc(this.totales, path, mes);}
      });


  }

  async guardar() {

    this.presentLoading();

    const name = this.newproducto.nombre;
    const file = this.newFile;
    const res = await this.firestorage.uploadImg(file, this.path, name);
    this.newproducto.foto = res;

   

    this.firestoreService
      .createDoc(this.newproducto, this.path, this.newproducto.id)
      .then((ans) => {
        this.loading.dismiss().then((respuesta) => {
          this.actualizarProducto = false;
          this.crearProducto=false;
          this.presentToast('Acción ralizada con exito');
          if (this.newproducto.id === '' || null) {
            this.navCtrl.navigateRoot('/home');
          } else {

          }
        });
      });
  }

  validacion() {
    if (
      this.newproducto.nombre === '' ||
      this.newproducto.costo === 0 ||
      this.newproducto.precio === 0 ||
      this.newproducto.precioMin === 0
    ) {
      this.alerta2('Todos los campos son requeridos');
      return false;
    } else {
      return true;
    }
  }

  async crearTransaccion() {
    this.getDatos();
    const path = 'usuario/' + this.iduser + '/movimientosContable';
    let transaccion =0;
    this.transaccion.descripcion = 'Compra de ' + this.newproducto.nombre;

    if(this.actualizarProducto===false){

    }

   if( this.actualizarProducto === true){//si se toma un producto ya creeado
    this.firestoreService.getCollectionquery<Producto>(this.path,'id','==',this.newproducto.id).pipe(take(1)).subscribe(resp=>{
      if(resp[0].unds === 0){//si tiene cero unidades se debe crear una nueva transaccion
        transaccion=(this.newproducto.gasto+this.newproducto.costo)* this.newproducto.unds;
        this.getionTotales(transaccion).then(()=>{
         this.transaccion.monto=transaccion;
         this.transaccion.fecha= moment(new Date).toString();
         this.transaccion.idTransaccion= this.firestoreService.getid();
          this.agregartransaccion();});
          return console.log('if unidades igual a cero');
     }

     else{
      transaccion=((this.newproducto.gasto+this.newproducto.costo)*(this.newproducto.unds)-
      ((resp[0].gasto+resp[0].costo)*resp[0].unds));//reduce las unds creadas para no afectar nueva transaccion
     
      this.getionTotales(transaccion).then(()=>{
       this.agregartransaccion();});
       this.transaccion.monto=transaccion;
       this.transaccion.fecha= moment(new Date).toString();
       this.transaccion.idTransaccion= this.firestoreService.getid();
       console.log(resp[0].unds)
       return console.log('else unidades ');
     }
    });


   }

   else{
     console.log('Este es el else');
    this.transaccion.fecha = this.newproducto.fecha;
    //si no ho aparece una transaccion con el producto
    transaccion=((this.newproducto.gasto+this.newproducto.costo)*(this.newproducto.unds));//reduce las unds creadas para no afectar nueva transaccion
     
    this.getionTotales(transaccion).then(()=>{
     this.agregartransaccion();});
     this.transaccion.monto=transaccion;
     this.transaccion.fecha= moment(new Date).toString();
     this.transaccion.idTransaccion= this.firestoreService.getid();
     
   }
     

     

  }


 async agregartransaccion(id= this.newproducto.id){
    const pathT= 'usuario/'+this.iduser+'/movimientosContable';
   

   this.transaccion.tipoTransaccion = 'Compra de Mercancía';

    this.transaccion.mes = moment(this.transaccion.fecha).format('M');
    this.transaccion.anio = moment(this.transaccion.fecha).format('YYYY');
    this.transaccion.dia = moment(this.transaccion.fecha).format('DD');
    this.transaccion.codigo=id;
      this.firestoreService.createDoc(
      this.transaccion,
      pathT,
      this.transaccion.idTransaccion
    );

  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });

    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando',
    });
    await this.loading.present();
  }

  async alerta2(msgAlerta: string) {
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Alerta!',
      message: '<strong>' + msgAlerta + '</strong>',
      buttons: [
        {
          text: 'Ok',
          role: 'Pk',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
      ],
    });

    await alert.present();
  }

  async alerta(msgAlerta: string) {
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Alerta!',
      message: '<strong>' + msgAlerta + '</strong>',
      buttons: [
        {
          text: 'Ok',
          role: 'Pk',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Ingresar',
          handler: () => {
            this.navCtrl.navigateRoot('/login');
          },
        },
      ],
    });

    await alert.present();
  }
}
