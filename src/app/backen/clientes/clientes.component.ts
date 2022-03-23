import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Cliente, Factura, } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];


  @Input() newCliente: Cliente = {
    codigo: 1000,
    nombre: '',
    telefono: '',
    fecha: moment(new Date()).toString(),
    // mes: moment(new Date()).format('MMMM').toString(),
  };

  isActive = true;
historico=false;
  loading: any;
  crearcliente = false;
  facturas: Factura[]=[];


  actualizarCliente = false;

  path = null;
  iduser = null;
  @Input() modal = false;

  constructor(public firestoreService: FirestoreService,
    public cd: ChangeDetectorRef,
    public firestorage: FirestorageService,
    public log: FirebaseauthService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public modalCtr: ModalController

  ) {

    if (this.log.stateauth()) {
      this.log.stateauth().subscribe(res => {

        if (res !== null) {
          this.iduser = res.uid;
          this.path = 'usuario/' + this.iduser + '/clientes';

          this.getClientes();

        } else {
          this.alerta('Necesitas ingresar con tu usuario para usar el modulo de Clientes');

        }
      });

    }


  }


  ngOnInit() {


  }
  nuevo() {

    this.newCliente = {
      codigo: 1000,
      nombre: '',
      telefono: '',
      fecha: moment(new Date()).toString(),
      // mes: moment(new Date()).format('MMMM').toString(),
    };
    this.firestoreService.getultimodoc<Cliente>(this.path).subscribe(res => {
      if (res !== null) {
        const sum: number = res[0].codigo + 1;
        this.newCliente.codigo = sum;
      }

      ;
    });
    this.crearcliente = true;
    this.actualizarCliente = true;


  }

  goAnOtherPage() {
    this.navCtrl.navigateRoot('/home');

  }
  segmentChanged(ev: any) {

  }
  mostrarDatos(cliente: Cliente) {
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
            this.firestoreService.deleteDoc(this.path, cliente.codigo.toString());
            this.presentToast('Cliente eliminado');
          }
        }
      ]
    });

    await alert.present();
  }

  getClientes() //obtiene todos los clientes y los almacena en una variable
  {

    this.firestoreService.getCollection<Cliente>(this.path).subscribe(res => {
      //console.log(res);
      this.clientes = res.sort((a, b) => { return a.codigo - b.codigo; })
    });
  }

  guardarDatos()//ejecuta la operacion de guardar despues de validar
  {
    this.validacion();
    if (this.validacion()) {
      this.guardar().then(res => {
        if (this.modal === true) {
          this.modalCtr.dismiss({ clienteFactura: this.newCliente });
          this.modal=false;
        }

      });
    }
  }

  async guardar()//guarda los datos en la base de datos
  {
    this.presentLoading();
    console.log(this.actualizarCliente);
    if (this.crearcliente === true) {
      await this.firestoreService.database.collection<Cliente>(this.path, ref => ref.orderBy('codigo').limitToLast(1))
        .valueChanges().pipe(take(1))

        .subscribe(resp => {
          if (resp.length > 0) {
            this.newCliente.codigo = resp[0].codigo + 1;
            this.guardarClinte();
          }
          else {
            this.newCliente.codigo = 1000;
            this.guardarClinte();
          }
        });
      this.crearcliente = false;
    }
    else {


      this.guardarClinte();

    }


  }

  guardarClinte() {

    this.firestoreService.createDoc(this.newCliente, this.path, 'C' + this.newCliente.codigo.toString()).then(ans => {
      this.loading.dismiss().then(respuesta => {
        this.actualizarCliente = false;
        this.presentToast('Cliente creado exitosamente');
        if (this.modal === false) {
          if (this.newCliente.codigo === 1000 || null) {
            this.navCtrl.navigateRoot('/home');
          }
          else { this.navCtrl.navigateRoot('/clientes'); }
        }

        else{
          this.parametrosModal(this.newCliente);
        }

      });

    });

  }
  
  historicoClientes(cliente){
    const path='usuario/'+this.iduser+'/clientes/C'+cliente.codigo+'/factura';
    this.firestoreService.database.collection<Factura>(path)//, ref=>ref.where(campo,condicion,busqueda)
    .valueChanges().subscribe(res=>{
      this.facturas=res;
    });
    this.newCliente= cliente;
    
    console.log('facturas de Clientes:', this.facturas);

  }


  validacion()//balida que los campos este llenos
  {
    if (this.newCliente.nombre === '' || this.newCliente.telefono === '') {



      this.alerta2('Todos los campos son queridos');
      return false;
    }

    else {


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
      message: 'Guardando',
    });
    await this.loading.present();

  }



  async alerta2(msgAlerta: string)//Alerta general para presentar mensaje al usuario
  {
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Alerta!',
      message: '<strong>' + msgAlerta + '</strong>',
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
      message: '<strong>' + msgAlerta + '</strong>',
      buttons: [
        {
          text: 'Ok',
          role: 'Pk',
          cssClass: 'secondary',
          handler: (blah) => {
            this.navCtrl.navigateRoot('/home');
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

  parametrosModal(cliente: Cliente) {
    this.modalCtr.dismiss({

      //id: this.firestoreService.getid(),
      codigo: cliente.codigo,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      fecha: cliente.fecha,

    });
    
  }

  seleccionCliente(cliente) {//selecciona el cliente en la lista 
    console.log('eses es el modal: ',this.modal);
    if (this.modal === false) {
     
     this.historico=true;
     this.historicoClientes(cliente);
      
    }
    else{
      this.parametrosModal(cliente);
     
    }
  } 

}

