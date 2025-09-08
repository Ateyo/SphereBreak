import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loss-dialog',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <h2 mat-dialog-title>Game Over!</h2>
    <div mat-dialog-content>
      <p>You did not meet the quota for Level {{ level }}.</p>
      <p>Your final score for this level was: {{ score }}</p>
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

  get score(): number {
    return this._data.score;
  }

  get level(): number {
    return this._data.level;
  }
}
