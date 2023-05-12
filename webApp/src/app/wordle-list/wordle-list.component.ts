import { Component } from '@angular/core';
import { PrefsService } from '../services/prefs.service';

@Component({
  selector: 'app-wordle-list',
  templateUrl: './wordle-list.component.html',
  styleUrls: ['./wordle-list.component.scss']
})
export class WordleListComponent {
  constructor(public prefsService: PrefsService) {}
}
