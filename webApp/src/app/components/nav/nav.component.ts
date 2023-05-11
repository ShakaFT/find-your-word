import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { LANG } from "src/app/constants";

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule],
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent {
  isLogged = false;
  lang = this._userService.getLang()

  constructor(private _userService: UserService, private _router: Router) {
    this.isLogged = this._userService.isLogin();
  }

  ngOnInit(): void {
    this.isLogged = this._userService.isLogin();
  }

  ngOnChanges(): void {
    this.isLogged = this._userService.isLogin();
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
    this._userService.logout();
    this.isLogged = this._userService.isLogin();
    this._router.navigate(["/home"]);
  }

  wordleList() {
    this._router.navigate(["/wordle-list"]);
  }

  scores() {
    this._router.navigate(["/scores"]);
  }

  onLangClick() {
    if(this._userService.getLang() === LANG[0]) {
      this._userService.setLang(LANG[1])
    } else {
      this._userService.setLang(LANG[0])
    }
    this.lang = this._userService.getLang()
    this._router.navigate(["/home"])
  }
}
