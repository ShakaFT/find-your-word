import { Component } from "@angular/core";
import { PrefsService } from "../services/prefs.service";
import { ActivatedRoute } from "@angular/router";
import { Score } from "../interfaces/score";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-scores",
  templateUrl: "./scores.component.html",
  styleUrls: ["./scores.component.scss"],
})
export class ScoresComponent {
  constructor(
    public prefsService: PrefsService,
    private _apiService: ApiService,
    private _route: ActivatedRoute
  ) {}

  wordleTimestamp: number = 0;
  scores: Score[] = [];
  personnalScore?: Score;

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.wordleTimestamp = params["timestamp"];
      this.setScores();
    });
  }

  setScores() {
    this._apiService
      .getScore(this.prefsService.getUser()!.username, this.wordleTimestamp)
      .subscribe((data) => {
        this.scores = data.best_score;
        this.personnalScore = data.personal_score;
      });
  }
}
