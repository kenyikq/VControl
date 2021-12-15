import { Component, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
//import {Plugins} from '@capacitor/core';

//const {SplashScreen, StatusBar} = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent  {
  login = false;
 /* subinfo: any;
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
    login = false;*/




  constructor(public navCtrl: NavController,
   // private firebaseauthService: FirebaseauthService, public firestoreService: FirestoreService, public platform: Platform,

    ) {
       //this.firebaseauthService.stateauth().subscribe( res=>{
        //console.log(res.uid.length);
       // this.getuid();
      //  if(res){this.uid=res.uid;}

     // });
    }

/*

  goAnOtherPage(ruta: string) {
    this.navCtrl.navigateRoot(ruta);
    this.seleccionA('no');
  }
getuid(){
  //this.firebaseauthService.stateauth().subscribe(res =>{
    if(res !== null){

      if(res.uid !==''){
        this.login= true;
      }else {
        this.login= false;
      }
    }
    else{ this.login = false;}
  });
}
*/

seleccionA(id: string){
  this.seleccion();
  this.inactive('pri');
  this.inactive('3');
  this.inactive('4');
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

/*

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

*/


}
