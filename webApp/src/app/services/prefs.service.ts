import { Injectable } from "@angular/core";
import { User } from "../interfaces/user";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class PrefsService {
  private user: User | null = null;
  private lang: string = "en";
  private maximumWordLength!: number;
  private minimumDailyTimestamp!: number;
  private minimumWordLength!: number;
  private langs!: string[];
  private isLoading: boolean = false;

  constructor(private apiService: ApiService) {
    this.isLoading = true;
    this.apiService.start().subscribe((data) => {
      this.langs = data.allowed_langs;
      this.lang = this.langs[0];
      this.maximumWordLength = data.maximum_word_length;
      this.minimumDailyTimestamp = data.minimum_daily_timestamp;
      this.minimumWordLength = data.minimum_word_length;
      this.isLoading = false;
    });
  }

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

  getLangs() {
    return this.langs;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  getIsLoading() {
    return this.isLoading;
  }

  getMaximumWordLength() {
    return this.maximumWordLength;
  }

  getMinimumDailyTimestamph() {
    return this.minimumDailyTimestamp;
  }

  getMinimumWordLength() {
    return this.minimumWordLength;
  }
}
