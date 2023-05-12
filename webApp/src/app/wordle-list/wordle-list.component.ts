import { Component } from '@angular/core';
import { PrefsService } from '../services/prefs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wordle-list',
  templateUrl: './wordle-list.component.html',
  styleUrls: ['./wordle-list.component.scss']
})
export class WordleListComponent {
  constructor(public prefsService: PrefsService, private _router: Router) {}

  onWordleClick() {
    this._router.navigate(["/home", {"timestamp": 1683756000000}])
  }
}
