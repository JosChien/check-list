import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

import { FirebaseService } from './firebase.service';
import { environment } from 'src/environments/environment';
import { IChecklist } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService extends FirebaseService {
  private dbPath = environment.DatabaseTableNames.Checklists;
  private collectionRef: CollectionReference = null;

  constructor(public db: AngularFirestore) {
    super(db);
    this.collectionRef = this.getRef(this.dbPath);
  }

  getChecklist(dataKey: string) {
    return this.get(this.dbPath, dataKey);
  }

  getChecklists() {
    return this.getAll(this.dbPath);
  }

  createChecklist(data: IChecklist) {
    return this.create(this.dbPath, data);
  }

  updateChecklist(data: IChecklist) {
    return this.update(this.dbPath, data.id, data);
  }

  updateChecklistItem(data) {
    return this.updateItem(this.dbPath, data.id, data);
  }

  deleteChecklist(dataKey: string) {
    return this.delete(this.dbPath, dataKey);
  }

  getChecklistByDate(date: string) {
    return this.collectionRef.where("date", "==", date);
  }
}