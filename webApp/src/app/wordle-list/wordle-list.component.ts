import { Component } from "@angular/core";
import { PrefsService } from "../services/prefs.service";
import { ActivatedRoute, Router } from "@angular/router";
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
    private _apiService: ApiService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._apiService.dailyWordle().subscribe((data) => {
      this.dailyWordles = data.daily_words[this.prefsService.getLang()];
      this.totalWordles = this.dailyWordles.length;
      this.prefsService.setSelectedWordle(null)
    });
  }
  onWordleClick(dailyWordle: any) {
    this.prefsService.setSelectedWordle(dailyWordle);
    this._router.navigate(["/"], {
      queryParams: {
        timestamp: dailyWordle.timestamp,
        word: dailyWordle.word,
      },
    });
  }
}
