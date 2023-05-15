import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { PrefsService } from "../services/prefs.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent {
  constructor(
    private _snackBar: MatSnackBar,
    public prefsService: PrefsService,
    private _apiService: ApiService,
    private _router: Router
  ) {}

  signup: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [Validators.required, Validators.min(3)]),
    confirmPassword: new FormControl("", [
      Validators.required,
      Validators.min(3),
    ]),
  });

  hidePassword = true;
  hideConfirmPassword = true;

  get usernameInput() {
    return this.signup.get("username");
  }
  get emailInput() {
    return this.signup.get("email");
  }
  get passwordInput() {
    return this.signup.get("password");
  }
  get confirmPasswordInput() {
    return this.signup.get("confirmPassword");
  }

  onClickSignup() {
    if (
      this.emailInput != null &&
      this.passwordInput != null &&
      this.confirmPasswordInput != null &&
      this.usernameInput != null
    ) {
      if (
        this.emailInput.value &&
        this.passwordInput.value &&
        this.confirmPasswordInput.value &&
        this.usernameInput.value
      ) {
        if (this.emailInput.invalid) {
          this._snackBar.open("Enter a valid email...", "Close", {
            duration: 3000,
          });
          return;
        } else if (
          this.passwordInput.value !== this.confirmPasswordInput.value
        ) {
          this._snackBar.open(
            "Password and confirm password are not the same...",
            "Close",
            {
              duration: 3000,
            }
          );
          return;
        }
        this.prefsService.setIsLoading(true);
        this._apiService
          .signup(
            this.emailInput.value,
            this.passwordInput.value,
            this.usernameInput.value
          )
          .subscribe((data) => {
            if (data.email_exists) {
              this._snackBar.open("Email already taken...", "Close", {
                duration: 3000,
              });
              this.prefsService.setIsLoading(false);
              return;
            } else if (data.username_exists) {
              this._snackBar.open("Username already taken...", "Close", {
                duration: 3000,
              });
              this.prefsService.setIsLoading(false);
              return;
            }
            this.prefsService.login({
              username: this.usernameInput!.value,
              email: this.emailInput!.value,
              id: data["user_id"],
            });
            this.prefsService.setIsLoading(false);
            this._router.navigate(["/"]);
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
