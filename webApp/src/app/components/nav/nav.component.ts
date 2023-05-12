import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { PrefsService } from "src/app/services/prefs.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule],
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent {
  isLogged = false;
  lang = this.prefsService.getLang();

  constructor(public prefsService: PrefsService, private _router: Router) {
    this.isLogged = this.prefsService.isLogin();
  }

  ngOnInit(): void {
    this.isLogged = this.prefsService.isLogin();
  }

  ngOnChanges(): void {
    this.isLogged = this.prefsService.isLogin();
  }

  infinite() {
    this._router.navigate(["/infinite"]);
  }

  login() {
    this._router.navigate(["/login"]);
  }

  goToAccount() {
    this._router.navigate(["/account"]);
  }

  logout() {
    this.prefsService.logout();
    this.isLogged = this.prefsService.isLogin();
    this._router.navigate(["/home"]);
  }

  wordleList() {
    this._router.navigate(["/wordle-list"]);
  }

  scores() {
    this._router.navigate(["/scores"]);
  }

  onLangClick() {
    if (this.prefsService.getLang() === this.prefsService.getLangs()[0]) {
      this.prefsService.setLang(this.prefsService.getLangs()[1]);
    } else {
      this.prefsService.setLang(this.prefsService.getLangs()[0]);
    }
    this.lang = this.prefsService.getLang();
    this._router.navigate(["/home"]);
  }
}
