import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule],
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent {
  // @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  isLogged = false;

  constructor(private userService: UserService, private router: Router) {
    this.isLogged = this.userService.isLogin();
  }

  ngOnInit(): void {
    this.isLogged = this.userService.isLogin();
  }

  ngOnChanges(): void {
    this.isLogged = this.userService.isLogin();
  }

  login() {
    this.router.navigate(["/login"]);
  }

  goToAccount() {
    this.router.navigate(["/account"]);
  }

  logout() {
    console.log("logout");
    this.userService.logout();
    this.isLogged = this.userService.isLogin();
    this.router.navigate(["/home"]);
  }

  wordleList() {
    this.router.navigate(["/wordle-list"]);
  }

  // openMenu() {
  //   this.trigger.openMenu();
  // }
}
