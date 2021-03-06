import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './backen/clientes/clientes.component';
import { MovimientosContablesComponent } from './backen/movimientos-contables/movimientos-contables.component';
import { ProductosPage } from './backen/productos/productos.page';
import { VentasPage } from './backen/ventas/Ventas.page';
import { HomePage } from './home/home.page';
import { EstadisticaComponent } from './pages/estadistica/estadistica.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';

const routes: Routes = [
  { path: 'home', component: HomePage},
  { path: '',  redirectTo: 'home',    pathMatch: 'full'},
  { path: 'productos', component: ProductosPage},
  { path: 'registro', component: RegistroComponent},
  { path: 'login', component: LoginComponent},
  { path: 'estadistica', component: EstadisticaComponent},
  { path: 'ventas', component: VentasPage},
  { path: 'moviemientos', component: MovimientosContablesComponent},
  { path: 'clientes', component: ClientesComponent}
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
