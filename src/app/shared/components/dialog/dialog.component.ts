import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { CoinArray } from '../../interfaces';
import { CoinComponent } from '../coin/coin.component';

export interface DialogData {
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  selectedCoins?: CoinArray[];
}

@Component({
  selector: 'app-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.content }}</p>
      @if (data.selectedCoins) {
        <div class="selected-coins">
          <h3>Selected Entry Coins:</h3>
          <div class="flex flex-row">
            @if (data.selectedCoins.length === 0) {
              <p>No coins selected.</p>
            } @else {
              @for (coin of data.selectedCoins; track coin) {
                <app-coin
                  [entryCoin]="coin.coin.entryCoin"
                  [coinValue]="coin.coin.value"></app-coin>
              }
            }
          </div>
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button mat-button color="primary" (click)="onConfirm()">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CoinComponent]
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
