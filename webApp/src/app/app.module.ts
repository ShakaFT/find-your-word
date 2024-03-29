import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeComponent } from "./home/home.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ModalComponent } from "./components/modal/modal.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from "./signup/signup.component";
import { NavComponent } from "./components/nav/nav.component";
import { PrefsService } from "./services/prefs.service";
import { HttpClientModule } from "@angular/common/http";
import { InfiniteModeComponent } from "./infinite-mode/infinite-mode.component";
import { WordleListComponent } from "./wordle-list/wordle-list.component";
import { MatMenuModule } from "@angular/material/menu";
import { ScoresComponent } from "./scores/scores.component";
import { AccountComponent } from "./account/account.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from "@angular/material/list";
import { DeleteAccountComponent } from './delete-account/delete-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    InfiniteModeComponent,
    WordleListComponent,
    ScoresComponent,
    AccountComponent,
    ResetPasswordComponent,
    DeleteAccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    ModalComponent,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    NavComponent,
    MatButtonModule,
    HttpClientModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatListModule,
  ],
  providers: [PrefsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
