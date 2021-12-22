

 export interface Producto{
   id: string;
   codigo: number;
   tipoArticulo: string;
   foto: string;
   nombre: string;
   unds: number;
   fecha: Date;
   costo: number;
   gasto: number;
   costoNeto: number;
   precio: number;
   precioMin: number;
   ganancia: number;
   descripcion: {
    procesador: {tipo: string; gen: string};
    ram: {cant: string; tipo: string};
    almacenamiento: {cant: string; tipo: string};
    pantalla: string;
   };

 }
