import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore){}
createDoc(data: any, path: string, id: string){

 const collection= this.database.collection(path);
 return collection.doc(id).set(data);
}

getDoc<Tipo>(path: string, id: string ){

  const collection= this.database.collection<Tipo>(path);
  return collection.doc(id).valueChanges();
}

deleteDoc<Tipo>(path: string, id: string ){

  const collection= this.database.collection<Tipo>(path);
  return collection.doc(id).delete();

}

updateDoc(data: any, path: string, id: string ){
  const collection= this.database.collection(path);
  return collection.doc(id).update(data);

}

getid(){
 return this.database.createId();
}

// eslint-disable-next-line @typescript-eslint/naming-convention
getCollection<Tipo>(path: string){
  const collection= this.database.collection <Tipo>(path,
    ref => ref.orderBy('fecha'));
  return collection.valueChanges();
}

getultimodoc<Tipo>(path: string){
  const collection= this.database.collection<Tipo>(path,
    ref => ref.orderBy('fecha').limitToLast(1));
  return collection.valueChanges();
}

getCollectionquery<Tipo>(path: string, campo: string, condicion: any, busqueda: string){
  const collection= this.database.collection <Tipo>(path,
    ref => ref.where(campo, condicion, busqueda) );



  return collection.valueChanges();

}

getCollectionget<Tipo>(path: string, campo: string, condicion: any, busqueda: string){
  const collection= this.database.collection <Tipo>(path,
    ref => ref.where(campo, condicion, busqueda) );



  return collection.valueChanges().pipe(take(1)); //permite capturar la informacicon una sola vez

}

}
