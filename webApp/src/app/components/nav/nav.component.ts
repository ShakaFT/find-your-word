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

  login() {
    this.router.navigate(["/login"]);
    console.log("login");
  }

  // openMenu() {
  //   this.trigger.openMenu();
  // }
}
