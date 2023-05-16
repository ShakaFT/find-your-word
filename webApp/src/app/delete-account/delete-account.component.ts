import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PrefsService } from "../services/prefs.service";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-delete-account",
  templateUrl: "./delete-account.component.html",
  styleUrls: ["./delete-account.component.scss"],
})
export class DeleteAccountComponent {
  constructor(
    private _snackBar: MatSnackBar,
    public prefsService: PrefsService,
    private _apiService: ApiService,
    private _router: Router
  ) {
    if(!this.prefsService.isLogin()) {
      this._router.navigate(["/"])
    }
  }

  deleteAccount: FormGroup = new FormGroup({
    password: new FormControl("", [Validators.required, Validators.min(3)]),
  });

  hidePassword = true;

  get passwordInput() {
    return this.deleteAccount.get("password");
  }

  onClickDelete() {
    if (this.passwordInput != null) {
      if (this.passwordInput.value) {
        this.prefsService.setIsLoading(true);
        this._apiService
          .deleteAccount(
            this.passwordInput.value,
            this.prefsService.getUser()!.id
          )
          .subscribe((data) => {
            if (data.success) {
              this._snackBar.open("Account deleted !", "Close", {
                duration: 3000,
              });
              this.prefsService.setIsLoading(false);
              this.prefsService.logout();
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
