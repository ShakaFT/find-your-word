import { Component, ElementRef, HostListener, Renderer2 } from "@angular/core";
import { ApiService } from "../services/api.service";
import { PrefsService } from "../services/prefs.service";
import { Utils } from "../utils";
import { QWERTY_KEYBOARD, AZERTY_KEYBOARD } from "../constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalComponent } from "../components/modal/modal.component";
import * as confetti from "canvas-confetti";

@Component({
  selector: "app-infinite-mode",
  templateUrl: "./infinite-mode.component.html",
  styleUrls: ["./infinite-mode.component.scss"],
})
export class InfiniteModeComponent {
  constructor(
    private _apiService: ApiService,
    public prefsService: PrefsService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private renderer: Renderer2,
    private _elementRef: ElementRef,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this._route.params.subscribe((_) => {
      this.prefsService.setSelectedWordle(null);
      this.refresh();
    });
  }

  public frKeyboard = AZERTY_KEYBOARD;

  public enKeyboard = QWERTY_KEYBOARD;

  public keyboard = this.frKeyboard;

  public currentRow: number = 0;

  public nbLetters: number = 5;

  public nbTries: number = 5;

  public wordToFind: string = "";

  public gameMatrix: Array<Array<string>> = [];

  public clicked: boolean = false;

  public onClickKeyboard(key: string) {
    if (key === "REMOVE") {
      this._removeLastLetter();
      return;
    }
    if (key === "ENTER") {
      this._checkWord();
      return;
    }
    this._addLetter(key);
  }

  // register keyboard event listener
  @HostListener("window:keydown", ["$event"])
  public onKeydown(event: KeyboardEvent) {
    if (this.prefsService.getIsLoading()) return;
    if (event.key === "Backspace") {
      this._removeLastLetter();
      return;
    }
    if (event.key === "Enter") {
      this._checkWord();
      return;
    }
    if (this.isLetter(event.key)) {
      this._addLetter(event.key.toUpperCase());
    }
  }

  public isLetter(key: string) {
    return key.length === 1 && /[a-z]/i.test(key);
  }

  public refresh() {
    // Refresh currentRow
    this.currentRow = 0;

    // select keyboard
    this.keyboard =
      this.prefsService.getLang() === "fr" ? this.frKeyboard : this.enKeyboard;

    // Refresh keyboard background color
    this.keyboard.forEach((row) => {
      row.forEach((letter) => {
        document
          .getElementById(letter)
          ?.style.removeProperty("background-color");
      });
    });

    // Get Word
    this.nbLetters = Utils.randomIntFromInterval(
      this.prefsService.getMinimumWordLength(),
      this.prefsService.getMaximumWordLength()
    );
    this.prefsService.setIsLoading(true);
    this._apiService
      .random(this.prefsService.getLang(), this.nbLetters)
      .subscribe((data) => {
        this.wordToFind = data.word;
        console.log(this.wordToFind);
        this.prefsService.setIsLoading(false);
      });

    // Refresh matrix
    this.gameMatrix = [];
    for (let y = 0; y < this.nbTries; y++) {
      this.gameMatrix.push([]);
      for (let x = 0; x < this.nbLetters; x++) {
        this.gameMatrix[y].push("");
      }
    }
  }

  private _addLetter(letter: string) {
    let lastBox = this._getLastBox();
    if (lastBox === this.nbLetters - 1) return;
    this.gameMatrix[this.currentRow][lastBox + 1] = letter;
  }

  private _checkLetterPosition(word: string) {
    let attribution: Array<boolean> = [];

    word.split("").forEach((letter, currentIndex) => {
      attribution.push(letter == this.wordToFind[currentIndex]);
    });

    word.split("").forEach((letter, currentIndex) => {
      let id = `boxRow${this.currentRow}Col${currentIndex}`;

      if (letter == this.wordToFind[currentIndex]) {
        this._setBackgroundColor(id, "green"); // box
        this._setBackgroundColor(letter, "green"); // keyboard
        return;
      }

      let found = false;
      for (let findIndex = 0; findIndex < this.wordToFind.length; findIndex++) {
        if (letter == this.wordToFind[findIndex] && !attribution[findIndex]) {
          if (!found) {
            if (
              document.getElementById(letter)?.style.backgroundColor != "green"
            ) {
              this._setBackgroundColor(letter, "orange"); // keyboard
            }
            found = true;
            attribution[findIndex] = true;
          }
          this._setBackgroundColor(id, "orange"); // box
        }
      }

      if (!found && this.wordToFind.indexOf(letter) > -1) {
        this._setBackgroundColor(letter, "gray"); // keyboard
      } else if (!found) {
        this._setBackgroundColor(letter, "gray"); // keyboard
      }
    });
  }

  public surprise(): void {
    const canvas = this.renderer.createElement("canvas");

    this.renderer.appendChild(this._elementRef.nativeElement, canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true, // will fit all screen sizes
    });

    myConfetti();

    this.clicked = true;
  }

  private _checkWord() {
    if (this._getLastBox() !== this.nbLetters - 1) {
      this._snackBar.open("The word is too short...", "Close", {
        duration: 3000,
      });
      return;
    }

    let currentWord: string = this._getWord();

    this.prefsService.setIsLoading(true);
    this._apiService
      .wordExists(this.prefsService.getLang(), currentWord)
      .subscribe((data) => {
        if (!data.exists) {
          this._snackBar.open("The word doesn't exists...", "Close", {
            duration: 3000,
          });
          this.prefsService.setIsLoading(false);
          return;
        }

        this._checkLetterPosition(currentWord);

        if (currentWord == this.wordToFind) {
          const dialogRef = this._dialog.open(ModalComponent, {
            data: {
              title: "You win !!!",
              content: `The word was ${this.wordToFind}`,
            },
            disableClose: true,
            panelClass: "modal-win",
          });

          this.prefsService.setIsLoading(false);

          dialogRef.afterClosed().subscribe((result) => {
            if (result === "/infinite") {
              this.refresh();
            } else {
              this._router.navigate([result]);
            }
          });
          return;
        }

        if (this.currentRow == this.nbTries - 1) {
          const dialogRef = this._dialog.open(ModalComponent, {
            data: {
              title: "You lose ...",
              content: `The word was ${this.wordToFind}`,
            },
            disableClose: true,
          });

          this.prefsService.setIsLoading(false);

          dialogRef.afterClosed().subscribe((result) => {
            if (result === "/infinite") {
              this.refresh();
            } else {
              this._router.navigate([result]);
            }
          });
          return;
        }

        this.currentRow++;
        this.prefsService.setIsLoading(false);
      });
  }

  private _getLastBox() {
    let row = this.gameMatrix[this.currentRow];
    for (let i = 0; i < row.length; i++) {
      if (!row[i]) return i - 1;
    }
    return row.length - 1;
  }

  private _getWord(): string {
    return this.gameMatrix[this.currentRow].join("");
  }

  private _removeLastLetter() {
    this.gameMatrix[this.currentRow][this._getLastBox()] = "";
  }

  private _setBackgroundColor(id: string, color: string) {
    this.renderer.setStyle(
      document.getElementById(id),
      "background-color",
      color
    );
  }
}
