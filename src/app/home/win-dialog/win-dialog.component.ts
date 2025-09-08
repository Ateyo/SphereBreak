import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HighscoreEntryComponent } from '../highscore-entry/highscore-entry.component';

interface WinDialogData {
  score: number;
  level: number;
  isHighscore: boolean;
}

@Component({
  selector: 'app-win-dialog',
  templateUrl: './win-dialog.component.html',
  styleUrls: ['./win-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    CommonModule,
    MatButtonModule
  ]
})
export class WinDialogComponent {
  private dialog = inject(MatDialog);

  constructor(@Inject(MAT_DIALOG_DATA) public data: WinDialogData) {}

  openHighscoreEntry(): void {
    this.dialog.open(HighscoreEntryComponent, {
      data: {
        score: this.data.score
      }
    });
  }
}
