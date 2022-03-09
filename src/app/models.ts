

 export interface Producto{
   id: string;
   codigo: number;
   tipoArticulo: string;
   foto: string;
   nombre: string;
   unds: number;
   fecha: string;
   mes: string;
   costo: number;
   gasto: number;
   precio: number;
   precioMin: number;
   condicion:string;
   descripcion: {
     caracteristicas: string;
    procesador: {tipo: string; gen: string};
    ram: {cant: string; tipo: string};
    almacenamiento: {cant: string; tipo: string};
    pantalla: string;
   };

 }

 export interface Usuario{
  uid: string;
  nombre: string;
  contacto: string;
  email: string;
  password: string;
  fecha: Date;

}

export interface Factura{
fechacreacion: string;
codigo: number;
fecha: string;
fechaVencimiento: string;
cliente: string;
articulo: Array<Articulo>;
total: number;

}

export interface Articulo{
  codigo: number;
  tipoArticulo:string;
  descripcion: string;
  cant: number;
  precioVenta: number;
  descuento: number;
  total: number;
}

export interface Cliente{
  codigo: number;
  nombre: string;
  telefono: string;
  fecha: string;
}

export interface MovimientosContables{
  codigo: string;
  tipoTransaccion: string;
  descripcion: string;
  fecha: string;
  anio: string;
  dia: string;
  mes: string;
  monto: number;
  idTransaccion: string;

}

export interface GraficoTransacciones{
mes: string;
capital: number;
venta: number;
compra: number;
gasto: number;

}

export interface Messes{
january: number;
february: number;
march: number;
april: number;
may: number;
june: number;
july: number;
august: number;
september: number;
october: number;
november: number;
december: number;

}
