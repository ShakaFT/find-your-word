import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { InfiniteModeComponent } from './infinite-mode/infinite-mode.component';
import { WordleListComponent } from './wordle-list/wordle-list.component';
import { ScoresComponent } from './scores/scores.component';
import { AccountComponent } from './account/account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'infinite', component: InfiniteModeComponent
  },
  {
    path: 'wordle-list', component: WordleListComponent
  },
  {
    path: 'scores', component: ScoresComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'account', component: AccountComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  },
  {
    path: 'delete-account', component: DeleteAccountComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
