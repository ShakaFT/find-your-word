import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

export interface DialogData {
    title: string;
    content: string;
  }

@Component({
    selector: 'modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.scss']
})
export class ModalComponent {
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    goToWordleList(): void {
        this.dialogRef.close("/wordleList")
    }

    newGame(): void {
        this.dialogRef.close("/infinite")
    }
}