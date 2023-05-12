import { Injectable } from "@angular/core";
import { User } from "../interfaces/user";
import { LANG } from "../constants";

@Injectable({
  providedIn: "root",
})
export class PrefsService {
  private user: User | null = null;
  private lang: string = LANG[0];
  private isLoading: boolean = false;

  constructor() {}

  login(user: User) {
    this.user = user;
  }

  logout() {
    this.user = null;
  }

  isLogin() {
    return this.user !== null;
  }

  getUser() {
    return this.user;
  }

  setLang(lang: string) {
    this.lang = lang;
  }

  setUsername(username: string) {
    if (this.user) {
      this.user.username = username;
    }
  }

  setEmail(email: string) {
    if (this.user) {
      this.user.email = email;
    }
  }

  getLang() {
    return this.lang;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  getIsLoading() {
    return this.isLoading;
  }
}
