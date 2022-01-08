import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimientos-contables',
  templateUrl: './movimientos-contables.component.html',
  styleUrls: ['./movimientos-contables.component.scss'],
})
export class MovimientosContablesComponent implements OnInit {
  agregarMovimiento: false;
  movimientos=[];

  constructor() { }

  ngOnInit() {}

  nuevo(){
    console.log('nuev movimiento');

  }
  mostrarDatos(){
    console.log('mostrar datos');
  }
}
