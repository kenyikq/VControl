import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }


  addNote(data: any, path: string) {
    const notesRef = collection(this.firestore, path);
    return addDoc(notesRef, data);
  }

  getNotes(): Observable<any[]> {
    const notesRef = collection(this.firestore, 'producto');
    return collectionData(notesRef, {  idField: 'id' }) as Observable<any[]>;
  }
  getNoteById(id): Observable<any> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<any>;
  }


  deleteNote(data: any) {
    const noteDocRef = doc(this.firestore, `notes/${data.id}`);
    return deleteDoc(noteDocRef);
  }

  updateNote(data: any, path: string) {
    const noteDocRef = doc(this.firestore, path,`/${data.id}`);
    return updateDoc(noteDocRef, { title: data.title, text: data.text });
  }


  /*
  createDoc(data: any, path: string, id: string){


    const collection= this.database.collection(path);
    return collection.doc(id).set(data);
   }

   getDoc<Tipo>(path: string, id: string ){

     const collection= this.database.collection<Tipo>(path);
     return collection.doc(id).valueChanges();
   }

   deleteDoc(path: string, id: string ){

     const collection= this.database.collection(path);
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
       ref => ref.orderBy('caso'));
     return collection.valueChanges();
   }

   getultimoCaso<Tipo>(path: string){
     const collection= this.database.collection<Tipo>(path,
       ref => ref.orderBy('caso').limitToLast(1));
     return collection.valueChanges();
   }

   getCollectionquery<Tipo>(path: string, campo: string, condicion: any, busqueda: string){
     const collection= this.database.collection <Tipo>(path,
       ref => ref.where(campo, condicion, busqueda) );

     return collection.valueChanges();

   }
*/

}
