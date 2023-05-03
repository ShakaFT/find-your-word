import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KEYBOARD } from '../constants';

@Component({
  selector: 'keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
  public keyboard = KEYBOARD

}
