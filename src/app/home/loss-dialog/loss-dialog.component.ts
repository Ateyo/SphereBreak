import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { HighscoreEntryComponent } from '../highscore-entry/highscore-entry.component';

@Component({
  selector: 'app-loss-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Game Over!</h2>
    <div mat-dialog-content>
      <p>You did not meet the quota for Level {{ level }}.</p>
      <p>Your final score for this level was: {{ score }}</p>
      <button mat-raised-button color="primary" (click)="openHighscoreEntry()">
        Save score
      </button>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onReplayClick()">Replay Level</button>
      <button mat-button (click)="onNextLevelClick()">Next Level</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 20px;
        text-align: center;
      }
      h2 {
        color: #f44336; /* Red for loss */
      }
      button {
        margin: 0 10px;
      }
    `
  ]
})
export class LossDialogComponent {
  private dialogRef = inject<MatDialogRef<LossDialogComponent>>(MatDialogRef);
  private dialog = inject(MatDialog);
  constructor(
    // eslint-disable-next-line no-unused-vars
    @Inject(MAT_DIALOG_DATA) private _data: { score: number; level: number }
  ) {}

  onReplayClick(): void {
    this.dialogRef.close(true);
  }

  onNextLevelClick(): void {
    this.dialogRef.close(false);
  }

  openHighscoreEntry(): void {
    this.dialogRef.close();
    this.dialog.open(HighscoreEntryComponent, {
      data: {
        score: this.score
      }
    });
  }

  get score(): number {
    return this._data.score;
  }

  get level(): number {
    return this._data.level;
  }
}
