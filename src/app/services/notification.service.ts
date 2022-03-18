import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  PushNotificationToken,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Plugins } from 'protractor/built/plugins';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
   public platform: Platform,
  ) { 
    this.inicializar();
  }

  inicializar(){
 
 if(this.platform.is('capacitor'))   {  PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
       // this.addListeners();
      } else {
        // Show some error
      }
    });
  }else{console.log('no es movil notificacion')}
  }

  addListeners(){
    PushNotifications.addListener('registration',
    (token: Token) => {
      alert('Push registration success, token: ' + token.value);
    }
  );

  // Some issue with our setup and push will not work
  PushNotifications.addListener('registrationError',
    (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    }
  );

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived',
    (notification: PushNotificationSchema) => {
      alert('Push received: ' + JSON.stringify(notification));
    }
  );

  // Method called when tapping on a notification
  PushNotifications.addListener('pushNotificationActionPerformed',
    (notification: ActionPerformed) => {
      alert('Push action performed: ' + JSON.stringify(notification));
    }
  );
  }
}
