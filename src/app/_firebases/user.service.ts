import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

import { FirebaseService } from './firebase.service';
import { IUser } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FirebaseService {
  private dbPath = 'users';
  private collectionRef: CollectionReference = null;

  constructor(public db: AngularFirestore) {
    super(db);
    this.collectionRef = this.getRef(this.dbPath);
  }

  getUser(dataKey: string) {
    return this.get(this.dbPath, dataKey);
  }

  getUsers() {
    return this.getAll(this.dbPath);
  }

  createUser(data: IUser) {
    return this.create(this.dbPath, data);
  }

  updateListUser(data) {
    return this.update(this.dbPath, data.id, data);
  }

  updateUser(data) {
    return this.updateItem(this.dbPath, data.id, data);
  }

  deleteUser(dataKey: string) {
    return this.delete(this.dbPath, dataKey);
  }

  authenticate(username: string, password: string) {
    let query = this.collectionRef
      .where('username', '==', username)
      .where('password', '==', password)
      .limit(1)
      .get();

    return new Promise<IUser>((resolve, reject) => {
      query.then((snapshot) => {
        let user: IUser = null;
        if (!snapshot.empty) {
          snapshot.forEach(q => {
            let doc = q.data();
            user = {
              id: q.id,
              username: doc.username,
              firstName: doc.firstName,
              lastName: doc.lastName,
              email: doc.email,
              role: doc.role,
              classes: doc.classes,
              token: 'fake-jwt-token'
            };
            if (doc.useShortName) {
              user.useShortName = doc.useShortName;
            }
            if (doc.language) {
              user.language = doc.language;
            }
          });
        }

        resolve(user);
      }).catch(err => reject(err));
    });
  }
}
