import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  constructor(private _snackBar: MatSnackBar, private _userService: UserService, private _router: Router) {

  }

  login: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(3)])
  });
  hide = true;
  get emailInput() { return this.login.get('email'); }
  get passwordInput() { return this.login.get('password'); }


  onClickLogin() {
    if (this.emailInput != null && this.passwordInput != null) {
      if (this.emailInput.value && this.passwordInput.value) {
        if (this.emailInput.invalid) {
          this._snackBar.open('Enter a valid email...', 'Close', {
            duration: 3000
          })
          return
        }
        this._userService.login(this.emailInput.value)
        this._router.navigate(["/home"])
      } else {
        this._snackBar.open('Fill all fields...', 'Close', {
          duration: 3000
        })
        return
      }
    }
  }
}
