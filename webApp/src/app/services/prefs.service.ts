import { Injectable } from "@angular/core";
import { User } from "../interfaces/user";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class PrefsService {
  private langs!: string[];
  private selectedWordle!: any;
  private isLoading: boolean = false;

  constructor(private apiService: ApiService) {
    this.isLoading = true;
    this.apiService.start().subscribe((data) => {
      this.langs = data.allowed_langs;
      if (!localStorage.getItem("lang")) {
        localStorage.setItem("lang", "en");
      }
      localStorage.setItem("maximumWordLength", data.maximum_word_length);
      localStorage.setItem(
        "minimumDailyTimestamp",
        data.minimum_daily_timestamp
      );
      localStorage.setItem("minimumWordLength", data.minimum_word_length);
      this.isLoading = false;
    });
  }

  login(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem("user");
  }

  isLogin() {
    return localStorage.getItem("user") !== null;
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user")!);
  }

  setLang(lang: string) {
    localStorage.setItem("lang", lang);
  }

  setUsername(username: string) {
    if (localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user")!);
      user.username = username;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  setEmail(email: string) {
    if (localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user")!);
      user.email = email;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  getLang() {
    return localStorage.getItem("lang")!;
  }

  getLangs() {
    return this.langs;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setSelectedWordle(dailyWordle: any) {
    this.selectedWordle = dailyWordle;
  }

  getSelectedWordle() {
    return this.selectedWordle;
  }

  getIsLoading() {
    return this.isLoading;
  }

  getMaximumWordLength() {
    return parseInt(localStorage.getItem("maximumWordLength") || "11");
  }

  getMinimumDailyTimestamp() {
    return parseInt(
      localStorage.getItem("minimumDailyTimestamp") || "1683756000000"
    );
  }

  getMinimumWordLength() {
    return parseInt(localStorage.getItem("minimumWordLength") || "4");
  }
}
