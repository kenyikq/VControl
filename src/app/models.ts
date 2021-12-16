

export interface Paciente {
    id: string;
    nombre: string;
  apellidos: string;
  tipoDoc: string;
  docNum: string;
  contacto: string;
  clave: string;
  correo: string;
  fecha: Date;

}

export interface Reporte {
  id: string;
  tipoAbuso: string;
  nombre: string;
  edad: string;
  sexo: string;
  foto: string;
  fecha: any ['shortTime'];
  descripcion: string;
  estatus: string;
  direccion: string;
  caso: number;
  iduser: string;
  ubicacion: {
    lat: number;
    lng: number;
   };
}

export interface Informante {
  id: string;
  nombre: string;
  correo: string;
cel: string;
fecha: Date;

}

export interface Usuario{
  uid: string;
  nombre: string;
  contacto: string;
  email: string;
  password: string;
  fecha: Date;

}

export interface GraficoTipoAbuso{
indigenica: number;
explotacion: number;
sexual: number;
agresion: number;
otro: number;


}

export interface Prueba{
  docnum: string;
  nombre: string;


  }

 export interface Seleccion{
   home: string;
   about: string;
   casos: string;
   reporte: string;
   graficos: string;

 }
