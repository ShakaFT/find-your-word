import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-infinite-mode',
  templateUrl: './infinite-mode.component.html',
  styleUrls: ['./infinite-mode.component.scss']
})
export class InfiniteModeComponent {

  constructor(private _apiService: ApiService, private _userService: UserService) {}

  nbLetters : number = 5
  wordToFind : string = ""

  async ngOnInit() {
    this.nbLetters = Utils.randomIntFromInterval(5,12)
    this._apiService.random(this._userService.getLang(), this.nbLetters).subscribe(data => {
      this.wordToFind = data.word 
    })
  }
}
