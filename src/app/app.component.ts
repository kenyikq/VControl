import { Component, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Usuario } from './models';
import { FirebaseauthService } from './services/firebaseauth.service';
import { FirestoreService } from './services/firestore.service';
import { NotificationService } from './services/notification.service';


//const {SplashScreen, StatusBar} = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent  {
  login = false;
  subinfo: any;
  usuario: Usuario = {
    uid: '',
    nombre: '',
    contacto: '',
    email: '',
    password: '',
    fecha:new Date(),
    };
    loading: any;
    path: '/usuarios';
    uid = '';
    activo=true;





  constructor(public navCtrl: NavController,
    private firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public platform: Platform,
    private notification: NotificationService,

    ) {
       this.firebaseauthService.stateauth().subscribe( res=>{
       this.getuid();
        if(res){this.uid=res.uid;}

      });
    }



  goAnOtherPage(ruta: string) {
    this.navCtrl.navigateRoot(ruta);
    this.seleccionA('no');
  }
getuid(){
  this.firebaseauthService.stateauth().subscribe(res =>{
    if(res !== null){

      if(res.uid !==''){
        this.login= true;
        this.activo=false;
      }else {
        this.login= false;
        this.activo=true;
      }
    }
    else{ this.login = false;this.activo=false;}
  });
}


seleccionA(id: string){
  this.seleccion();
  this.inactive('pri');
  this.inactive('3');
  this.inactive('4');
  this.inactive('5');
  this.active(id);
}
//para marcar como seleccionado la opcion dentro del menu
async seleccion(){

  this.inactive('1');
  this.inactive('2');






}

active(id: string){
  const active = document.getElementById(id);

  active.classList.add('active');
}

inactive(id: string){
  const active = document.getElementById(id);

  active.classList.remove('active');
}



  getUserInfo(uid: string){
    const path ='usuario';
   this. subinfo = this.firestoreService.getDoc<Usuario>(path,uid).subscribe(res=>{
      this.usuario = res;
    });
  }

  salir(){
    this.firebaseauthService.logout();
    this.goAnOtherPage('/home');
  }




}
