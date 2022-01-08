

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
   descripcion: {
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
codigo: number;
fecha: string;
fechaVencimiento: string;
cliente: string;
articulo: Array<Articulo>;

}

export interface Articulo{
  codigo: number;
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
