import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController, LoadingController, MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

productos: Producto[]= [];
img='';
newFile= '';

newproducto: Producto = {
  id: this.firestoreService.getid(),
  codigo: 1000,
  tipoArticulo :'',
  foto: '',
  nombre: '',
  unds: 0,
  fecha: new Date(),
  costo: 0,
  gasto: 0,
  costoNeto: 0,
  precio: 0,
  precioMin: 0,
  ganancia: 0,
  descripcion: {
    procesador: {tipo: '', gen: ''},
    ram: {tipo: '', cant: ''},
    almacenamiento: {tipo: '', cant: ''},
    pantalla: ''}
  };


isActive = true;
valorneto: number;
loading: any;
idArticulo: 1000;

actulizarProducto= true;

  path = 'producto';


  constructor(public firestoreService: FirestoreService,
              public cd: ChangeDetectorRef,
              public firestorage: FirestorageService,
              public log: FirebaseauthService,
              public loadingController: LoadingController,
              public navCtrl: NavController,
              public toastCtrl: ToastController,
              public alertController: AlertController,

    ) {
      this.getproductos();
    }



  ngOnInit() {


  }
nuevo(){

this.firestoreService.getultimodoc(this.path,'codigo');

  this.newproducto = {
 id: this.firestoreService.getid(),
    codigo: 1000,
    tipoArticulo :'',
    foto: '',
    nombre: '',
    unds: 0,
    fecha: new Date(),
    costo: 0,
    gasto: 0,
    costoNeto: 0,
    precio: 0,
    precioMin: 0,
    ganancia: 0,
    descripcion: {
      procesador: {tipo: '', gen: ''},
      ram: {tipo: '', cant: ''},
      almacenamiento: {tipo: '', cant: ''},
      pantalla: ''}
    };

}

  goAnOtherPage() {
    this.navCtrl.navigateRoot('/home');

  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
  mostrarDatos(producto){
    this.actulizarProducto = false;
    this.newproducto = producto;
  }



  async newImg(event: any){

    if (event.target.files && event.target.files[0]){
      const reader = new FileReader();
      this.newFile = event.target.files[0];;
      reader.onload = ((image) => {
        this.img = image.target.result as string;
        this.newproducto.foto= this.img;

      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async deleteproducto(producto: Producto){

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
            console.log(producto);

            this.firestoreService.deleteDoc(this.path,producto.id);
            this.presentToast('Producto eliminado');
          }
        }
      ]
    });

    await alert.present();
  }

getproductos() {

    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
       console.log(res);
       this.productos= res;

     } );
  }

async  guardarDatos(){
  this.presentLoading();

const name = this.newproducto.nombre;
const file = this.newFile;
const res = await this.firestorage.uploadImg(file, this.path, name);
this.newproducto.foto = res;

    this.firestoreService.createDoc(this.newproducto, this.path, this.newproducto.id).then( ans =>{
      this.loading.dismiss().then( respuesta => {
        this.actulizarProducto = false;
        this.presentToast('Acción ralizada con exito');
        if(this.newproducto.id==='' || null){
          this.navCtrl.navigateRoot('/home');
        }
        else{this.navCtrl.navigateRoot('/productos');}
           });
    });

}


/*

getUserInfo(uid: string){
  const path ='usuario';
this. subinfo = this.firestoreService.getDoc<Usuario>(path,uid).subscribe(res=>{
this.usuario = res;
});
}
*/


async presentToast(msg: string) {
  const toast = await this.toastCtrl.create({
   message: msg,
   duration: 2000,
   position: 'bottom'
 });

toast.present();
}

async presentLoading(){
this.loading = await this.loadingController.create({
 cssClass: 'normal',
 message:'Guardando',
});
await this.loading.present();

}

/*

getuid(){
  this.firebaseauthService.stateauth().subscribe(res =>{
    if(res !== null){
      this.newproducto.iduser= res.uid;

    }

    else{ this.newproducto.iduser= '';}
  });


}*/

}
