import { Component } from "@angular/core";
import { PrefsService } from "../services/prefs.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-wordle-list",
  templateUrl: "./wordle-list.component.html",
  styleUrls: ["./wordle-list.component.scss"],
})
export class WordleListComponent {
  dailyWordles: Map<string, number>[] = [];
  todayTimestamp!: number;
  minimumTimestamp!: number;

  constructor(public prefsService: PrefsService, private _router: Router) {}

  ngOnInit() {
    const now = new Date();
    this.todayTimestamp = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    this.minimumTimestamp = this.prefsService.getMinimumDailyTimestamp();

    let count: number = 1;

    for (
      let index = this.todayTimestamp;
      index >= this.minimumTimestamp;
      index -= 86400000
    ) {
      count++;
    }

    for (
      let index = this.todayTimestamp;
      index >= this.minimumTimestamp;
      index -= 86400000
    ) {
      count--;
      this.dailyWordles.push(
        new Map<string, number>([
          ["number", count],
          ["timestamp", index],
        ])
      );
    }
  }
  onWordleClick(dailyWordle: Map<string, number>) {
    this._router.navigate([
      "/home",
      { timestamp: dailyWordle.get("timestamp") },
    ]);
  }
}
