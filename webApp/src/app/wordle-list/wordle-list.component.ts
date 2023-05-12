import { Component } from "@angular/core";
import { PrefsService } from "../services/prefs.service";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-wordle-list",
  templateUrl: "./wordle-list.component.html",
  styleUrls: ["./wordle-list.component.scss"],
})
export class WordleListComponent {
  dailyWordles: any;
  totalWordles: number = 0;

  constructor(
    public prefsService: PrefsService,
    private _router: Router,
    private _apiService: ApiService
  ) {}

  ngOnInit() {
    this._apiService.dailyWordle().subscribe((data) => {
      this.dailyWordles = data.daily_words[this.prefsService.getLang()];
      this.totalWordles = this.dailyWordles.length;
    });
  }
  onWordleClick(dailyWordle: any) {
    this._router.navigate([
      "/home",
      { timestamp: dailyWordle.timestamp, word: dailyWordle.word },
    ]);
  }
}
