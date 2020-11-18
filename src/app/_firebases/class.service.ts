import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

import { FirebaseService } from './firebase.service';
import { IClass } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ClassService extends FirebaseService {
  private dbPath = 'classes';
  public collectionRef: CollectionReference = null;

  constructor(public db: AngularFirestore) {
    super(db);
    this.collectionRef = this.getRef(this.dbPath);
  }

  getClass(dataKey: string) {
    return this.get(this.dbPath, dataKey);
  }

  getClasses() {
    return this.getAll(this.dbPath);
  }

  createClass(data: IClass) {
    return this.create(this.dbPath, data);
  }

  updateClass(data: IClass) {
    return this.updateItem(this.dbPath, data.id, data);
  }

  deleteClass(dataKey: string) {
    return this.delete(this.dbPath, dataKey);
  }
}
