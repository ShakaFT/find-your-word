import { Component } from "@angular/core";
import { PrefsService } from "../services/prefs.service";

@Component({
  selector: "app-scores",
  templateUrl: "./scores.component.html",
  styleUrls: ["./scores.component.scss"],
})
export class ScoresComponent {
  constructor(public prefsService: PrefsService) {}
}
