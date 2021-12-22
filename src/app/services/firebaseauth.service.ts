import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  constructor( public auth: AngularFireAuth,public alertController: AlertController) {
    this.getUid();
  }

  login(email: string ,password: string){
   return this.auth.signInWithEmailAndPassword(email,password).catch(error => {
    this.alerta( error);

  });
  }

  logout(){
   return this.auth.signOut();
  }

  registrar(email: string ,password: string){

   return this.auth.createUserWithEmailAndPassword(email, password).catch(error => {
     this.alerta( error);

   });

  }

  async getUid(){
    //para capturar la promesa se debe de crear una constante
   const user = await this.auth.currentUser;
   if(user === null){
     return null;
   } else{
    return user.uid;
   }
  }

  stateauth(){
    return this.auth.authState;
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
}
