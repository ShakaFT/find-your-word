import { Component } from "@angular/core";
import { ApiService } from "../services/api.service";
import { PrefsService } from "../services/prefs.service";
import { Utils } from "../utils";

@Component({
  selector: "app-infinite-mode",
  templateUrl: "./infinite-mode.component.html",
  styleUrls: ["./infinite-mode.component.scss"],
})
export class InfiniteModeComponent {
  constructor(
    private _apiService: ApiService,
    public prefsService: PrefsService
  ) {}

  nbLetters: number = 5;
  wordToFind: string = "";

  async ngOnInit() {
    this.nbLetters = Utils.randomIntFromInterval(4, 11);
    this.prefsService.setIsLoading(true);
    this._apiService
      .random(this.prefsService.getLang(), this.nbLetters)
      .subscribe((data) => {
        this.wordToFind = data.word;
        console.log(this.wordToFind);
        this.prefsService.setIsLoading(false);
      });
  }
}
