
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Producto } from '../models';
import { FirestoreService } from '../services/firestore.service';
import * as moment from 'moment';
import { Browser } from '@capacitor/browser';
import { constants } from 'buffer';
import { HttpClient } from '@angular/common/http';
import { FirebaseauthService } from '../services/firebaseauth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  datos: Producto[]=[];
  productos: Producto[] = [];
  subscriber: Subscription;
  path='/usuario/PgpRK7YIO3YF2tQaXYybIAR97nK2/producto';
  option = {slidesPerView: 1,
  centeredSlide: true,
  loop: true,
  spaceBetween: 10,
  autoplay: true,
  
}
mirarProducto=false;
productosCarrusell=[];
filtroLetra='';

newproducto: Producto = {
  id: 'P1000',
  codigo: 1000,
  tipoArticulo: '',
  foto: '',
  nombre: '',
  unds: 0,
  fecha: moment(new Date()).toString(),
  mes: moment(new Date()).format('M').toString(),
  costo: 0,
  gasto: 0,
  precio: 0,
  precioMin: 0,
  condicion:'Usado como nuevo',
  link:'',
  descripcion: {
    caracteristicas:'',
    procesador: { tipo: '', gen: '' },
    ram: { tipo: '', cant: '' },
    almacenamiento: { tipo: '', cant: '' },
    pantalla: '',
  },
};

tituloProducto="Listado de Productos";
categoria="Todo";
mostrarMenu=false;
ubicacion= "https://www.google.com/maps/place/19%C2%B009'14.8%22N+70%C2%B028'52.9%22W/@19.1541111,-70.4813611,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0xcb5abf3438e623e9!8m2!3d19.1541115!4d-70.4813634?hl=es";

films: Observable<any>;


  constructor(
    public db: AngularFirestore,
    public firestoreService: FirestoreService,
     public httpClient: HttpClient,
     public log: FirebaseauthService,
  ) {this.getDatos() ;

    if ( this.log.stateauth())
    {
    this.log.stateauth().subscribe( res=>{

      if (res !== null){
        this.mostrarMenu= true;

      }
      else{this.mostrarMenu= false;}
    });

  }
    
  /* this.films= this.httpClient.get('https://swapi.dev/api/films/1/');
   this.films
   .subscribe(data => {
     console.log('my data: ', data);
   }); */
 
  }

  ngAfterViewInit(): void {
    
  }
  

  getDatos(): boolean{
    this.subscriber = this.firestoreService.database.collection<Producto>(this.path,
      ref=>ref.where('unds','!=',0))
    .valueChanges().subscribe((res) => {
      this.datos=res;
      this.productos = this.datos;
      this.productosCarrusell=res;
      this.filterItems(this.categoria);

      
  });
  return true;}

  mostrarDatos(producto: Producto) {
    this.mirarProducto = true;
    console.log(producto);
    this.newproducto = producto;
    
  }

  /*conet(){
    this.http.get('http://ionic.io', {}, {})
  .then(data => {

    console.log(data.status);
    console.log(data.data); // data received by server
    console.log(data.headers);

  })
  .catch(error => {

    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);

  });
  }*/

     async abrirlink(link=this.newproducto.link) {
         await Browser.open({ url:link, });
     }

 async  msjWhatsapp(){

 
   const phone='18295695701';
   const mensaje='Hola, estoy interesado en el siguiente articulo:%0A'+
   '%0A*'+this.newproducto.nombre+'*%0A'+
   '*Codigo:* P'+this.newproducto.codigo+'%0A'+
   '*Precio:* '+this.newproducto.precio+'%0A'+
   '*Link:*'+this.newproducto.link+
   '%0A Sigue disponible?'
   ;
    //await Browser.open({ url: 'https://api.whatsapp.com/send?phone='+phone+'?text=Me%20interesa%20in%20el%20auto%20que%20vende', });
    //mirarProducto = false
    console.log('abrir el link');
    await Browser.open({ url: ' https://wa.me/'+phone+'?text='+mensaje, });
  }

 filterItems(filtro) {
      if(filtro==='Todo') 
    {this.productos=this.datos;}

    else{
     
      let arr = [ [],[] ]; 
    for (let i = 0; i < this.productos.length; i++) 
    { this.productos[i].tipoArticulo === filtro ? arr[0].push(this.productos[i]) : arr[1].push(this.productos[i]) }; 
    this.productos=arr[0];
    }
  }

  filterItemsLetra(query) {
  


 
    if(this.filtroLetra===''|| this.filtroLetra===null){
      this.tituloProducto="Listado de Productos"
      this.productos=this.datos;
      
    }
    else{
      this.tituloProducto="Resultados de la Búsqueda"
      this.productos=this.datos;
      this.productos=  this.productos.filter((el)=> {
       
       return el.nombre.toLowerCase().indexOf(query.toLowerCase()) > -1;
       
  });}
   
  console.log(this.productos.length);
    
  }   
    

//Fuente: https://www.iteramos.com/pregunta/107658/filtrar-un-array-en-base-a-los-diferentes-valores-del-objeto
  //return this.productos.filter(function(el) {
    //  return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
//  })
//}


  
  

}
