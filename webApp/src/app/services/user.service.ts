import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User | null = null

  constructor() { }

  login(user: User) {
    this.user = user
  }

  logout() {
    this.user = null
  }

  isLogin() {
    return this.user !== null;
  }

  getUser() {
    return this.user;
  }

}
