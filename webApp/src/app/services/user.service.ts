import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User | null = null

  constructor() { }

  login(email: String) {
    this.user = {email: email}
  }

  logout() {
    this.user = null
  }

  isLogin() {
    return this.user !== null;
  }

  getEmail() {
    return this.user!.email;
  }

}
