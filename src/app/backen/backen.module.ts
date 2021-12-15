import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosPage } from './productos/productos.page';
import { IonicModule } from '@ionic/angular';// para que se reconozcan los elementos ionic
import { RouterModule } from '@angular/router';

//EL modulo se crea en la carpeta par aqu evarios componentes puedan hacere uso del mismo
// luego se declara en el appmodulo general


@NgModule({
  declarations: [ProductosPage],// se declaran los componentes para hacer uso de las importaciones
  imports: [
    CommonModule, IonicModule, RouterModule
  ]
})
export class BackenModule { }
