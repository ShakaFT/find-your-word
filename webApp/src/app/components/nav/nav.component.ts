import { Component, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { PrefsService } from "src/app/services/prefs.service";
import { Router, NavigationExtras } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule],
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent {
  isLogged = false;
  lang = this.prefsService.getLang();
  @Input() timestamp!: number;

  constructor(
    public prefsService: PrefsService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.isLogged = this.prefsService.isLogin();
  }

  ngOnInit(): void {
    this.isLogged = this.prefsService.isLogin();
  }

  ngOnChanges(): void {
    this.isLogged = this.prefsService.isLogin();
  }

  infinite() {
    this._router.navigate(["/infinite"]);
  }

  login() {
    this._router.navigate(["/login"]);
  }

  goToAccount() {
    this._router.navigate(["/account"]);
  }

  logout() {
    this.prefsService.logout();
    this.isLogged = this.prefsService.isLogin();
    this._router.navigate(["/home"]);
  }

  wordleList() {
    this._router.navigate(["/wordle-list"]);
  }

  scores() {
    if (this.isLogged) {
      console.log(this.timestamp)
      this._router.navigate(["/scores", {timestamp: this.timestamp}]
        // queryParams: {timestamp: this.timestamp },
      );
    } else {
      this._router.navigate(["/login"]);
      this._snackBar.open("Log you first...", "Close", {
        duration: 3000,
      });
    }
  }

  refreshPage(): void {
    const currentUrl = this._router.url;
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: 'preserve',
      preserveFragment: true
    };
  
    this._router.navigateByUrl('/', navigationExtras)
      .then(() => this._router.navigateByUrl(currentUrl, navigationExtras));
  }

  onLangClick() {
    if (this.prefsService.getLang() === this.prefsService.getLangs()[0]) {
      this.prefsService.setLang(this.prefsService.getLangs()[1]);
    } else {
      this.prefsService.setLang(this.prefsService.getLangs()[0]);
    }
    this.lang = this.prefsService.getLang();
    this.refreshPage();
  }
}
