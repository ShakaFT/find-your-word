import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KEYBOARD } from 'src/app/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'wordle-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wordle-board.component.html',
  styleUrls: ['./wordle-board.component.scss']
})
export class WordleBoardComponent {

  public keyboard = KEYBOARD

  public currentRow: number = 0
  public nbLetters: number = 5
  public nbTries: number = 5
  public wordToFind: string = "HELLO"

  public gameMatrix: Array<Array<string>> = []

  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.refresh()
  }

  public onClickKeyboard(key: string) {
    if (key === "REMOVE") {
      this._removeLastLetter()
      return
    }
    if (key === "ENTER") {
      this._checkWord()
      return
    }
    this._addLetter(key)
  }

  public refresh() {
    // Refresh currentRow
    this.currentRow = 0

    // Refresh keyboard background color
    this.keyboard.forEach((row) => {
      row.forEach((letter) => {
        document.getElementById(letter)?.style.removeProperty("background-color")
      })
    })

    // Refresh matrix
    this.gameMatrix = []
    for (let y = 0; y < this.nbTries; y++) {
      this.gameMatrix.push([])
      for (let x = 0; x < this.nbLetters; x++) {
        this.gameMatrix[y].push("")
      }
    }

    // Refresh word
    // this.api.getWord(this.lang, this.nbLetters).subscribe(data => {
    //   this.wordToFind = data.word.toUpperCase()
    //   console.log(this.wordToFind)
    // })
  }

  private _addLetter(letter: string) {
    let lastBox = this._getLastBox()
    if (lastBox === this.nbLetters - 1) return
    this.gameMatrix[this.currentRow][lastBox + 1] = letter
  }

  private _checkLetterPosition(word: string) {
    let attribution: Array<boolean> = []

    word.split('').forEach((letter, currentIndex) => {
      attribution.push(letter == this.wordToFind[currentIndex])
    })

    word.split('').forEach((letter, currentIndex) => {
      let id = `boxRow${this.currentRow}Col${currentIndex}`

      if (letter == this.wordToFind[currentIndex]) {
        this._setBackgroundColor(id, "green") // box
        this._setBackgroundColor(letter, "green") // keyboard
        return
      }

      for (let findIndex = 0; findIndex < this.wordToFind.length; findIndex++) {
        if (letter == this.wordToFind[findIndex] && !attribution[findIndex]) {
          if (document.getElementById(letter)?.style.backgroundColor != "green") {
            this._setBackgroundColor(letter, "orange") // keyboard
          }
          this._setBackgroundColor(id, "orange") // box
          return
        }
      }

      this._setBackgroundColor(letter, "black")
    });
  }

  private _checkWord() {

    if (this._getLastBox() !== this.nbLetters - 1) {
      this._snackBar.open('The word is too short...', 'Close', {
        duration: 3000
      })
      return
    }

    let currentWord: string = this._getWord()


    // this.api.wordExists(this.lang, currentWord).subscribe(data => {
    //   if (!data.exists) {
    //     this._makeToast("Le mot n'existe pas...")
    //     return
    //   }

    this._checkLetterPosition(currentWord)

    if (currentWord == this.wordToFind) {
      this._dialog.open(ModalComponent, 
        { data: 
          { title: "You win !!!",
            content: `The word was ${this.wordToFind}` 
          },
          disableClose: true 
        })
      return
    }

    if (this.currentRow == this.nbTries - 1) {
      this._dialog.open(ModalComponent,
        { data: 
          { title: "You lose ...",
            content: `The word was ${this.wordToFind}` 
          },
          disableClose: true 
        })
      return
    }

    this.currentRow++
    // })
  }

  private _getLastBox() {
    let row = this.gameMatrix[this.currentRow];
    for (let i = 0; i < row.length; i++) {
      if (!row[i]) return i - 1
    }
    return row.length - 1
  }

  private _getWord(): string {
    return this.gameMatrix[this.currentRow].join("")
  }

  private _removeLastLetter() {
    this.gameMatrix[this.currentRow][this._getLastBox()] = ""
  }

  private _setBackgroundColor(id: string, color: string) {
    this.renderer.setStyle(document.getElementById(id), "background-color", color)
  }
}
