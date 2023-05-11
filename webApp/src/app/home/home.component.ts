import { Component } from '@angular/core';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  wordToFind: string = "CHELA"
  nbLetters: number = 5

  //TODO add the system to get the daily word and if the word is already found by user go to infinite mode
}
