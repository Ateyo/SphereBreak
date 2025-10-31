import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  Input
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
  imports: [MatDialogModule, CommonModule, MatButtonModule]
})
export class WinDialogComponent {
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<WinDialogComponent>);

  @Input() score!: number;
  @Input() level!: number;
  @Input() isHighscore!: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data: WinDialogData) {
    this.score = this.data.score;
    this.level = this.data.level;
    this.isHighscore = this.data.isHighscore;
  }

  openHighscoreEntry(): void {
    this.dialog.open(HighscoreEntryComponent, {
      data: {
        score: this.score
      }
    });
  }

  quitAndSaveScore(): void {
    this.dialog
      .open(HighscoreEntryComponent, {
        data: {
          score: this.score
        }
      })
      .afterClosed()
      .subscribe(() => {
        this.dialogRef.close('quit');
      });
  }
}
