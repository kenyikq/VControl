import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

/*async  guardarDatos(){
  this.presentLoading();
    const path = '/reporte';
const name = this.newReporte.nombre;
const file = this.newFile;
const res = await this.firestorage.uploadImg(file, path, name);
this.newReporte.foto = res;

    this.firestoreService.createDoc(this.newReporte, this.path, this.newReporte.id).then( ans =>{
      this.loading.dismiss().then( respuesta => {
        this.presentToast('Reporte enviado');
        if(this.newReporte.id==='' || null){
          this.navCtrl.navigateRoot('/home');
        }
        else{this.navCtrl.navigateRoot('/casos');}
           });
    });

}
goAnOtherPage() {
  this.navCtrl.navigateRoot('/home');
}


getUserInfo(uid: string){
  const path ='usuario';
this. subinfo = this.firestoreService.getDoc<Usuario>(path,uid).subscribe(res=>{
this.usuario = res;
});
}



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

async newImg(event: any){

if (event.target.files && event.target.files[0]){
  const reader = new FileReader();
  this.newFile = event.target.files[0];;
  reader.onload = ((image) => {
    this.img = image.target.result as string;


  });
  reader.readAsDataURL(event.target.files[0]);
}



}

getuid(){
  this.firebaseauthService.stateauth().subscribe(res =>{
    if(res !== null){
      this.newReporte.iduser= res.uid;

    }

    else{ this.newReporte.iduser= '';}
  });


}*/

}