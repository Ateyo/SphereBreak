import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

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
  imports: [MatDialogModule, MatButtonModule]
})
export class WinDialogComponent {
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<WinDialogComponent>);

  score: number;
  level: number;
  isHighscore: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data: WinDialogData) {
    this.score = data.score;
    this.level = data.level;
    this.isHighscore = data.isHighscore;
  }

  openHighscoreEntry(): void {
    this.dialog.open(HighscoreEntryComponent, {
      data: {
        score: this.score,
        level: this.level
      }
    });
  }

  quitAndSaveScore(): void {
    this.dialog
      .open(HighscoreEntryComponent, {
        data: {
          score: this.score,
          level: this.level
        }
      })
      .afterClosed()
      .subscribe(() => {
        this.dialogRef.close('quit');
      });
  }
}
