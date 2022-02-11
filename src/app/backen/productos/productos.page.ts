import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { GraficoTransacciones, MovimientosContables, Producto} from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController,LoadingController, NavController,ToastController,} from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';
import { async } from '@firebase/util';
import { take } from 'rxjs/operators';
import { pipe } from 'rxjs';

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
    fecha: moment(new Date()).format('DD-MM-YYYY'),
    mes: moment(new Date()).format('MMMM').toString(),
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
    codigo: 0,
    tipoTransaccion: '',
    descripcion: '',
    fecha: moment(new Date()).format('DD-MM-YYYY'),
    mes: moment(new Date()).format('MMMM'),
    anio: moment(new Date()).format('YYYY'),
    dia: moment(new Date()).format('DD'),
    monto: 0,
    idTransaccion:'',
  };

  totales: GraficoTransacciones = {
    mes: moment(new Date()).format('MMMM'),
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

  path = null;
  iduser = null;

  constructor(
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
      mes: moment(new Date()).format('MMMM').toString(),
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

    this.actualizarProducto = true;
  }

  caracteristicasArticulos(){
  if(this.newproducto.tipoArticulo==='laptop'){
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
  }

  goAnOtherPage() {
    this.navCtrl.navigateRoot('/home');
  }

  segmentChanged(ev: any){
    this.valueSelected= ev.detail.value;
    this.filtrar();
  }

  filtrar() {


console.log(this.valueSelected);
    if(this.valueSelected=== 'disponibles'){

     const collection = this.firestoreService.database.collection<Producto>(this.path,
      ref=>ref.where('unds','>=',1))
    .valueChanges().subscribe((res) => {
      //console.log(res);
      this.productos = res;
    });}

    if(this.valueSelected=== 'vendidos'){

      const collection = this.firestoreService.database.collection<Producto>(this.path,
       ref=>ref.where('unds','==',0))
     .valueChanges().subscribe((res) => {
       //console.log(res);
       this.productos = res;
     });}
     else{
console.log(this.valueSelected);
      const collection = this.firestoreService.database.collection<Producto>(this.path)
      .valueChanges().subscribe((res) => {
        //console.log(res);
        this.productos = res;
      });}

  }

  mostrarDatos(producto: Producto) {
    this.actualizarProducto = true;
    this.newproducto = producto;
    this.transaccion.codigo=producto.codigo;
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

  async deleteproducto(producto: Producto) {

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
              this.firestoreService.deleteDoc('usuario/' + this.iduser + '/movimientosContable',producto.id);//elimina la transaccion
              const diferencia = (producto.gasto + producto.costo)* (-1);//convierte el monto en negativo para afectar totales
              this.getionTotales(diferencia);
              this.firestoreService.deleteDoc('usuario/' + this.iduser + '/movimientosContable','T'+producto.id);//elimina la transaccion
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
    const mes = moment(this.newproducto.fecha).format('MMMM');
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
      this.caracteristicasArticulos();
  }

  guardarDatos() {
   

    if (this.validacion()) {
       this.crearTransaccion();
      this.guardar()
        .finally(() => {
         this.limpiarCampos();});

    }
  }

  async getionTotales(transaccion: number) {
  
    const anio = moment(this.newproducto.fecha).format('YYYY');
    const mes = moment(this.newproducto.fecha).format('MMMM');
    const path =
      'usuario/' + this.iduser + '/movimientosContable/totales/' + anio;

  await    this.firestoreService
      .getCollectionquery<GraficoTransacciones>(path, 'mes', '==', mes)
      .pipe(take(1))
      .subscribe((res) => {

        if (res.length > 0) {
          this.totales = res[0];
          console.log('resultado del query',this.totales);
         
          this.totales.compra =
          this.totales.compra + transaccion;
          this.firestoreService.createDoc(this.totales, path, mes);
        }
      });

   
  }

  async guardar() {
 
    this.presentLoading();

    const name = this.newproducto.nombre;
    const file = this.newFile;
    const res = await this.firestorage.uploadImg(file, this.path, name);
    this.newproducto.foto = res;

    await this.firestoreService
      .getultimodoc<Producto>(this.path)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.length > 0) {
          this.newproducto.codigo = resp[0].codigo + 1; //asigna el nuevo codigo del producto
          this.newproducto.id = 'P' + this.newproducto.codigo;
        }

      });

    this.firestoreService
      .createDoc(this.newproducto, this.path, this.newproducto.id)
      .then((ans) => {
        this.loading.dismiss().then((respuesta) => {
          this.actualizarProducto = false;
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
      this.alerta2('Todos los campos son queridos');
      return false;
    } else {
      return true;
    }
  }

  async crearTransaccion() {
    const path = 'usuario/' + this.iduser + '/movimientosContable';
    let transaccion =0;


    await this.firestoreService.getCollectionquery<MovimientosContables>(path,'idTransaccion','==','T'+this.newproducto.id).
    pipe(take(1)).subscribe(res=>{

      if(res.length === 0){

            transaccion=(this.newproducto.costo+this.newproducto.gasto)* this.newproducto.unds;
            this.agregartransaccion();
            this.getionTotales(transaccion);


      }

      else{

        transaccion=((this.newproducto.gasto+this.newproducto.costo)*this.newproducto.unds)-(res[0].monto);
        this.getionTotales(transaccion).then(()=>{this.agregartransaccion();});

      }


    });





  }


 async agregartransaccion(){
    const pathT= 'usuario/'+this.iduser+'/movimientosContable';
    let codigo=0;

await this.firestoreService.getultimodoc<MovimientosContables>(pathT).pipe(take(1)).subscribe(res=>{

  if (res.length>0){
  codigo= res[0].codigo +1;
  }
  else{ codigo = 1;}
});

    this.transaccion.descripcion = 'Compra de ' + this.newproducto.nombre;
    this.transaccion.tipoTransaccion = 'Compra de Mercancía';
    this.transaccion.fecha = this.newproducto.fecha;
    this.transaccion.mes = moment(this.newproducto.fecha).format('MMMM');
    this.transaccion.anio = moment(this.newproducto.fecha).format('YYYY');
    this.transaccion.dia = moment(this.newproducto.fecha).format('DD');
    console.log('este es ecodigo de transaccion', codigo);
    this.transaccion.codigo=codigo;
    this.transaccion.idTransaccion='T'+this.newproducto.id;
    this.transaccion.monto =
     ( this.newproducto.costo + this.newproducto.gasto)*this.newproducto.unds;

    this.firestoreService.createDoc(
      this.transaccion,
      pathT,
      'T'+this.newproducto.id
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
