import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PrefsService } from "../services/prefs.service";
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
    public prefsService: PrefsService,
    private _apiService: ApiService,
    private _router: Router
  ) {
    if (!this.prefsService.isLogin()) {
      this._router.navigate(["/"]);
    }
  }

  account: FormGroup = new FormGroup({
    email: new FormControl(this.prefsService.getUser()?.email, [
      Validators.email,
      Validators.required,
    ]),
    username: new FormControl(this.prefsService.getUser()?.username, [
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
    if (
      this.emailInput != null &&
      this.usernameInput != null &&
      this.passwordInput != null
    ) {
      if (this.emailInput.value && this.usernameInput.value) {
        if (this.emailInput.invalid) {
          this._snackBar.open("Enter a valid email...", "Close", {
            duration: 3000,
          });
          return;
        }
        this.prefsService.setIsLoading(true);
        this._apiService
          .updateUserProfile(
            this.emailInput.value,
            this.passwordInput.value,
            this.usernameInput.value,
            this.prefsService.getUser()!.id
          )
          .subscribe((data) => {
            if (data.success) {
              if (data.username_exists) {
                this._snackBar.open("Username already taken...", "Close", {
                  duration: 3000,
                });
                this.prefsService.setIsLoading(false);
                return;
              }

              if (data.email_exists) {
                this._snackBar.open("Email already taken...", "Close", {
                  duration: 3000,
                });
                this.prefsService.setIsLoading(false);
                return;
              }

              this.prefsService.setEmail(this.emailInput?.value);
              this.prefsService.setUsername(this.usernameInput?.value);

              this._snackBar.open("Account updated !", "Close", {
                duration: 3000,
              });
              this.prefsService.setIsLoading(false);
              this._router.navigate(["/"]);
            } else {
              this._snackBar.open("Invalid password...", "Close", {
                duration: 3000,
              });
              this.prefsService.setIsLoading(false);
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

  onClickReset() {
    this._router.navigate(["/reset-password"]);
  }

  onClickDelete() {
    this._router.navigate(["/delete-account"]);
  }
}
