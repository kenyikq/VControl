import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductosPage } from './productos/productos.page';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ProductosPage
  ],
  imports: [
    CommonModule, IonicModule,FormsModule, RouterModule
  ]
})
export class BackenModule { }
