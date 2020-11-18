import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  protected getRef(collectionName: string): CollectionReference {
    return this.db.collection(collectionName).ref;
  }

  protected get(collectionName: string, dataKey: string) {
    return this.db.collection(collectionName).doc(dataKey).snapshotChanges();
  }

  protected getAll(collectionName: string) {
    return this.db.collection(collectionName).snapshotChanges();
  }

  protected create<T>(collectionName: string, data: T) {
    return this.db.collection(collectionName).add(data);
  }

  protected update<T>(collectionName: string, dataKey: string, data: T) {
    return this.db.collection(collectionName).doc(dataKey).set(data);
  }

  protected updateItem<T>(collectionName: string, dataKey: string, data: T) {
    return this.db.collection(collectionName).doc(dataKey).update(data);
  }

  protected delete(collectionName: string, dataKey: string) {
    return this.db.collection(collectionName).doc(dataKey).delete();
  }
}
