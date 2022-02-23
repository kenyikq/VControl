
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Producto } from '../models';
import { FirestoreService } from '../services/firestore.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

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
  descripcion: {
    caracteristicas:'',
    procesador: { tipo: '', gen: '' },
    ram: { tipo: '', cant: '' },
    almacenamiento: { tipo: '', cant: '' },
    pantalla: '',
  },
};


  constructor(
    public db: AngularFirestore,
    public firestoreService: FirestoreService,
  ) {this.getDatos();}

  getDatos(){
    this.subscriber = this.firestoreService.database.collection<Producto>(this.path,
      ref=>ref.where('unds','!=',0))
    .valueChanges().pipe(take(1)).subscribe((res) => {
      
      this.productos = res;
      console.log(res);
  });}

  mostrarDatos(producto: Producto) {
    this.mirarProducto = true;
    console.log(producto);
    this.newproducto = producto;
    
  }
  
  

}
