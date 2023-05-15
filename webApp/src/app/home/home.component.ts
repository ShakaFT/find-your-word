import { Component, ElementRef, HostListener, Renderer2 } from "@angular/core";
import { AZERTY_KEYBOARD, QWERTY_KEYBOARD } from "../constants";
import { ModalComponent } from "../components/modal/modal.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { PrefsService } from "../services/prefs.service";
import * as confetti from "canvas-confetti";

@Component({
  selector: "home-component",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  public frKeyboard = AZERTY_KEYBOARD;

  public enKeyboard = QWERTY_KEYBOARD;

  public keyboard = this.frKeyboard;

  public currentRow: number = 0;

  public nbLetters: number = 0;

  public nbTries: number = 5;

  public wordToFind: string = "";

  public gameMatrix: Array<Array<string>> = [];

  public wordleTimestamp!: number;

  public clicked: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private renderer: Renderer2,
    private _elementRef: ElementRef,
    private _apiService: ApiService,
    public prefsService: PrefsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    console.log("HomeComponent constructor");
    this._route.params.subscribe((_) => {
      this.refresh();
    });
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.wordleTimestamp = params["timestamp"];
      this.wordToFind = params["word"];
    });

    this.refresh();
  }

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
    this.keyboard = this.prefsService.getLang() === "fr" ? this.frKeyboard : this.enKeyboard;

    // Refresh keyboard background color
    this.keyboard.forEach((row) => {
      row.forEach((letter) => {
        document
          .getElementById(letter)
          ?.style.removeProperty("background-color");
      });
    });

    this.prefsService.setIsLoading(true);
    if (this.wordToFind != undefined) {
      this.goToScoreIfAlreadyDid();

      this.nbLetters = this.wordToFind.length;

      // Refresh matrix
      this.gameMatrix = [];
      for (let y = 0; y < this.nbTries; y++) {
        this.gameMatrix.push([]);
        for (let x = 0; x < this.nbLetters; x++) {
          this.gameMatrix[y].push("");
        }
      }
      this.prefsService.setIsLoading(false);
      return;
    }

    this._apiService.dailyWordle().subscribe((data) => {
      this.wordToFind = data.daily_words[this.prefsService.getLang()][0].word;
      this.wordleTimestamp =
        data.daily_words[this.prefsService.getLang()][0].timestamp;
      this.nbLetters = this.wordToFind.length;

      this.goToScoreIfAlreadyDid();

      // Refresh matrix
      this.gameMatrix = [];
      for (let y = 0; y < this.nbTries; y++) {
        this.gameMatrix.push([]);
        for (let x = 0; x < this.nbLetters; x++) {
          this.gameMatrix[y].push("");
        }
      }
      this.prefsService.setIsLoading(false);
    });
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

      for (let findIndex = 0; findIndex < this.wordToFind.length; findIndex++) {
        if (letter == this.wordToFind[findIndex] && !attribution[findIndex]) {
          if (
            document.getElementById(letter)?.style.backgroundColor != "green"
          ) {
            this._setBackgroundColor(letter, "orange"); // keyboard
          }
          this._setBackgroundColor(id, "orange"); // box
          return;
        }
      }

      this._setBackgroundColor(letter, "gray");
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
              title: "You win !",
              content: `The word was ${this.wordToFind}`,
            },
            panelClass: "modal-win",
          });
          if (this.prefsService.isLogin()) {
            this._apiService
              .sendScore(
                this.prefsService.getUser()!.username,
                this.wordleTimestamp,
                this.currentRow + 1
              )
              .subscribe((data) => {
                console.log(data);
                this.prefsService.setIsLoading(false);
              });
          } else {
            this.prefsService.setIsLoading(false);
          }

          dialogRef.afterClosed().subscribe((result) => {
            this._router.navigate([result]);
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
            this._router.navigate([result]);
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

  goToScoreIfAlreadyDid() {
    if (this.prefsService.isLogin()) {
      this._apiService
        .getScore(this.prefsService.getUser()!.username, this.wordleTimestamp)
        .subscribe((data) => {
          if (data["personal_score"]) {
            this.prefsService.setIsLoading(false);
            this._router.navigate([
              "/scores",
              { timestamp: this.wordleTimestamp },
            ]);
          }
        });
    }
  }

  private _setBackgroundColor(id: string, color: string) {
    this.renderer.setStyle(
      document.getElementById(id),
      "background-color",
      color
    );
  }
}
