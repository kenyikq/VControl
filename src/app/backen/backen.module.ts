import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductosPage } from './productos/productos.page';
import { RouterModule } from '@angular/router';
import { VentasPage } from './ventas/Ventas.page';
import { MovimientosContablesComponent } from './movimientos-contables/movimientos-contables.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ReplacePipe } from 'src/app/pipe-personalizado/pipe-personalizado.component';

@NgModule({
  declarations: [
    ReplacePipe,
    ProductosPage,
    VentasPage,
    MovimientosContablesComponent,
    ClientesComponent ,
  ],
  imports: [
    CommonModule, IonicModule, FormsModule, RouterModule
  ]
})
export class BackenModule { }
