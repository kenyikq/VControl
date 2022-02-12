import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  usuario: Usuario = {
  uid: this.firestoreService.getid(),
  nombre: '',
  contacto: '',
  email: '',
  password: '',
  fecha:new Date(),
  };

  loading: any;
  path: '/usuarios';
  uid = '';
subinfo: Subscription;
confirmarPass ='';

ionicForm: FormGroup;
isSubmitted = false;

  constructor(public log: FirebaseauthService,
              public firestoreService: FirestoreService,
              public toastCtrl: ToastController,
              public navCtrl: NavController,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public formBuilder: FormBuilder) {
               this.log.stateauth().subscribe( res=>{

                  if (res !== null){
                    this.uid= res.uid;

                    this.getUserInfo(this.uid);
                  }else {
                    this.uid='';
                    this.limpiarcampos();
                  }
                });
              }


 async ngOnInit() {
  this.ionicForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
   celular: ['', [Validators.required, Validators.pattern('[0-9]{3}[ -][0-9]{3}[ -][0-9]{4}')]],
   passw: ['', [Validators.required, Validators.min(8)]],
  });

    const uid = await this.log.getUid().then(res =>{
      if (this.uid!==null||this.uid!=='')
      {this.seleccionA();};
    }).catch(err=>{console.log('Aun no esta logueado');});



  }
  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.ionicForm.value)
    }
  }

  get errorControl() {// muestra el mensaje al usuario
    return this.ionicForm.controls;
  }
 

  limpiarcampos(){
    this.usuario= {
      uid: '',
      nombre: '',
      contacto: '',
      email: '',
      password: '',
      fecha:new Date(),
      };
  }

  async  guardarDatos(){

    this.presentLoading();
      const path = '/usuario';
     this.firestoreService.createDoc(this.usuario, path, this.usuario.uid).then( ans =>{
        this.loading.dismiss().then( respuesta => {

          this.presentToast('Registro exitoso');
          this.navCtrl.navigateRoot('/home');
        }).catch(err =>{console.log('error de id:',err);});
     });

     
  }

 async registro(){
    const credenciales ={
      email: this.usuario.email,
      password: this.usuario.password,
    };

  await this.log.registrar(credenciales.email,credenciales.password).then(res => {
  }).catch(err =>{ console.log('Error al registrar:', err);

  });
  const uid = await this.log.getUid();
  this.usuario.uid = uid;


  }


  async registrar(){

  this.validacion();
  if(this.validacion())
  {this.registro().then(res => {
    if(this.usuario.uid!==null && this.usuario.uid!=='')
    {this.guardarDatos();}


  }).catch(err=>{console.log('Error de base de datos: '+err.Error);}); }


  }

 async salir(){
    this.log.logout();
    this.subinfo.unsubscribe();
    this.isSubmitted = true;
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

  validacion(){
    if (this.usuario.nombre=== ''|| this.usuario.contacto ==='' || this.usuario.password ===''
    || this.usuario.email===''){
      this.alerta('Todos los campos son queridos');
      this.submitForm();
    return false;
    }

    else
    {
      if(this.usuario.password === this.confirmarPass){

      return true;
      }

      else{ this.alerta('Las contraseñas no coinciden');

    return false;}


  }
  }

  getUserInfo(uid: string){
        const path ='usuario';
   this. subinfo = this.firestoreService.getDoc<Usuario>(path,uid).subscribe(res=>{
      this.usuario = res;
    });
  }

  goAnOtherPage() {
    this.navCtrl.navigateRoot('/home');

    this.seleccionA();
  }

  seleccionA(){

    this.inactive('1');
    this.inactive('pri');
    this.inactive('3');
    this.inactive('4');
    this.inactive('2');
  }
  //para marcar como seleccionado la opcion dentro del menu


  active(id: string){
    const active = document.getElementById(id);
    active.classList.add('active');
  }

  inactive(id: string){
    const active = document.getElementById(id);

    active.classList.remove('active');
  }

}
