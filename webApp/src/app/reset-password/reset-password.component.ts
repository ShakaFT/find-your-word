import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { PrefsService } from "../services/prefs.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent {
  constructor(
    private _snackBar: MatSnackBar,
    public prefsService: PrefsService,
    private _apiService: ApiService,
    private _router: Router
  ) {}

  resetPassword: FormGroup = new FormGroup({
    oldPassword: new FormControl("", [Validators.required, Validators.min(3)]),
    newPassword: new FormControl("", [Validators.required, Validators.min(3)]),
    confirmNewPassword: new FormControl("", [
      Validators.required,
      Validators.min(3),
    ]),
  });

  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmNewPassword = true;

  get oldPasswordInput() {
    return this.resetPassword.get("oldPassword");
  }
  get newPasswordInput() {
    return this.resetPassword.get("newPassword");
  }
  get confirmNewPasswordInput() {
    return this.resetPassword.get("confirmNewPassword");
  }

  onClickReset() {
    if (
      this.oldPasswordInput != null &&
      this.newPasswordInput != null &&
      this.confirmNewPasswordInput != null
    ) {
      if (
        this.oldPasswordInput.value &&
        this.newPasswordInput.value &&
        this.confirmNewPasswordInput.value
      ) {
        if (
          this.newPasswordInput.value !== this.confirmNewPasswordInput.value
        ) {
          this._snackBar.open(
            "New password and confirm new password are not the same...",
            "Close",
            {
              duration: 3000,
            }
          );
          return;
        }
        this.prefsService.setIsLoading(true);
        this._apiService
          .resetPassword(
            this.oldPasswordInput.value,
            this.newPasswordInput.value,
            this.prefsService.getUser()!.id
          )
          .subscribe((data) => {
            if (data.success) {
              this._snackBar.open("Password updated !", "Close", {
                duration: 3000,
              });
              this.prefsService.setIsLoading(false);
              this._router.navigate(["/"]);
            } else {
              this._snackBar.open("Wrong password...", "Close", {
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
