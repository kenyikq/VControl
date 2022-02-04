import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Cliente, } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[]= [];


  newCliente: Cliente = {
    codigo: 1000,
    nombre: '',
    telefono: '',
    fecha: moment(new Date()).format('DD-MM-YYYY'),
   // mes: moment(new Date()).format('MMMM').toString(),
     };

  isActive = true;

  loading: any;


  actualizarCliente= false;

    path = null;
    iduser=null;

    constructor(public firestoreService: FirestoreService,
                public cd: ChangeDetectorRef,
                public firestorage: FirestorageService,
                public log: FirebaseauthService,
                public loadingController: LoadingController,
                public navCtrl: NavController,
                public toastCtrl: ToastController,
                public alertController: AlertController,

      ) {

        if ( this.log.stateauth())
        {
        this.log.stateauth().subscribe( res=>{

          if (res !== null){
            this.iduser= res.uid;
          this.path='usuario/'+this.iduser+'/clientes';

          this.getClientes();

          }else {
            this.alerta('Necesitas ingresar con tu usuario para usar el modulo de Clientes');

          }
        });

      }


      }

      ngOnInit() {


    }
  nuevo(){

     this.newCliente = {
      codigo: 1000,
      nombre: '',
      telefono: '',
      fecha: moment(new Date()).format('DD-MM-YYYY'),
     // mes: moment(new Date()).format('MMMM').toString(),
       };
      this.firestoreService.getultimodoc<Cliente>(this.path).subscribe(res=>{
        if (res !==null)
        {
          const sum: number =res[0].codigo + 1;
          this.newCliente.codigo= sum;}

          ;});

  this.actualizarCliente= true;


  }

    goAnOtherPage() {
      this.navCtrl.navigateRoot('/home');

    }
    segmentChanged(ev: any) {
      console.log('Segment changed', ev);
    }
    mostrarDatos(cliente: Cliente){
      this.actualizarCliente = true;
      this.newCliente = cliente;
    }



    async deleteCliente(cliente: Cliente) //elimina un cliente
    {

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
              this.firestoreService.deleteDoc(this.path,cliente.codigo.toString());
              this.presentToast('Cliente eliminado');
            }
          }
        ]
      });

      await alert.present();
    }

  getClientes() //obtiene todos los clientes y los almacena en una variable
  {

      this.firestoreService.getCollection<Cliente>(this.path).subscribe( res => {
         //console.log(res);
         this.clientes = res;

       } );
    }

    guardarDatos()//ejecuta la operacion de guardar despues de validar
    {
      this.validacion();
    if(this.validacion())
    {
      this.guardar();
    }
    }

  async  guardar()//guarda los datos en la base de datos
  {
    this.presentLoading();

  await this.firestoreService.getultimodoc<Cliente>(this.path).subscribe(resp=>{
    if(resp){
    this.newCliente.codigo=  resp[0].codigo + 1; //asigna el nuevo codigo del cliente
    }
  });

      this.firestoreService.createDoc(this.newCliente, this.path, 'C'+this.newCliente.codigo.toString()).then( ans =>{
        this.loading.dismiss().then( respuesta => {
          this.actualizarCliente = false;
          this.presentToast('Acción ralizada con exito');

          if(this.newCliente.codigo===1000 || null){
            this.navCtrl.navigateRoot('/home');
          }
          else{this.navCtrl.navigateRoot('/Clientes');}
             });
      });

  }


  validacion()//balida que los campos este llenos
  {
    if (this.newCliente.nombre=== ''|| this.newCliente.telefono===''){



      this.alerta2('Todos los campos son queridos');
    return false;
    }

    else
    {


      return true;


  }
  }


  async presentToast(msg: string) //Experiencia de usuarion, presenta mensaje del reultado de la operacion
  {
    const toast = await this.toastCtrl.create({
     message: msg,
     duration: 2000,
     position: 'bottom'
   });

  toast.present();
  }

  async presentLoading() //presenta el loadin guardando
  {
  this.loading = await this.loadingController.create({
   cssClass: 'normal',
   message:'Guardando',
  });
  await this.loading.present();

  }



    async alerta2(msgAlerta: string)//Alerta general para presentar mensaje al usuario
    {
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


  async alerta(msgAlerta: string)//Mensaje de alerta con la opcion de ingresar con usuario
  {
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
        }, {
          text: 'Ingresar',
          handler: () => {
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]

    });

    await alert.present();
  }

  }

