import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PrefsService } from "../services/prefs.service";

import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  constructor(
    private _snackBar: MatSnackBar,
    public prefsService: PrefsService,
    private _apiService: ApiService,
    private _router: Router
  ) {
    if(this.prefsService.isLogin()) {
      this._router.navigate(["/"])
    }
  }

  login: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [Validators.required, Validators.min(3)]),
  });
  hide = true;
  get emailInput() {
    return this.login.get("email");
  }
  get passwordInput() {
    return this.login.get("password");
  }

  onClickLogin() {
    if (this.emailInput != null && this.passwordInput != null) {
      if (this.emailInput.value && this.passwordInput.value) {
        if (this.emailInput.invalid) {
          this._snackBar.open("Enter a valid email...", "Close", {
            duration: 3000,
          });
          return;
        }
        this.prefsService.setIsLoading(true);
        this._apiService
          .login(this.emailInput.value, this.passwordInput.value)
          .subscribe((data) => {
            if (data.login) {
              this.prefsService.login(data.user);
              this.prefsService.setIsLoading(false);
              this._router.navigate(["/"]);
            } else {
              this._snackBar.open("Invalid email/password...", "Close", {
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
}
