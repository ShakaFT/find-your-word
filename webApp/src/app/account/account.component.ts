import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "../services/user.service";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
  constructor(
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private _apiService: ApiService,
    private _router: Router
  ) {}

  account: FormGroup = new FormGroup({
    email: new FormControl(this._userService.getUser()?.email, [
      Validators.email,
      Validators.required,
    ]),
    username: new FormControl(this._userService.getUser()?.username, [
      Validators.required,
      Validators.min(3),
    ]),
    password: new FormControl("", [Validators.required, Validators.min(3)]),
  });
  hide = true;
  get emailInput() {
    return this.account.get("email");
  }
  get usernameInput() {
    return this.account.get("username");
  }
  get passwordInput() {
    return this.account.get("password");
  }

  onClickModify() {
    if (this.emailInput != null && this.usernameInput != null && this.passwordInput != null) {
      if (this.emailInput.value && this.usernameInput.value) {
        if (this.emailInput.invalid) {
          this._snackBar.open("Enter a valid email...", "Close", {
            duration: 3000,
          });
          return;
        }
        this._apiService
          .updateUserProfile(
            this.emailInput.value,
            this.passwordInput.value,
            this.usernameInput.value,
            this._userService.getUser()!.id
          )
          .subscribe((data) => {
            if (data.success) {
              this._userService.setEmail(this.emailInput?.value)
              this._userService.setUsername(this.usernameInput?.value)

              this._snackBar.open("Account updated !", "Close", {
                duration: 3000,
              });
              this._router.navigate(["/home"]);
            } else {
              this._snackBar.open("Invalid password...", "Close", {
                duration: 3000,
              });
              return;
            }
          });
      } else {
        this._snackBar.open("Fill all fields...", "Close", {
          duration: 3000,
        });
        return;
      }
    }
  }
}
