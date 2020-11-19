import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUser } from '../_models';
import { UserService } from '../_firebases/user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;
  public language:boolean = false;
  public useShortName: boolean = false;

  constructor(
    private http: HttpClient,
    private userService: UserService) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const self = this;
    return this.userService.authenticate(username, password).then(user => {
      // login successful if there's a jwt token in the response

      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user.useShortName) {
          self.useShortName = user.useShortName;
        }
        if (user.language) {
          self.language = user.language;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.removeItem('idCatechism');
        this.currentUserSubject.next(user);
      }

      return user;
    })
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('idCatechism');
    this.currentUserSubject.next(null);
  }
}