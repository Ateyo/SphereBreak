import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { take } from 'rxjs/operators';
import { PlayerService } from 'src/app/shared/services/player.service';

@Component({
  selector: 'app-highscore-entry',
  templateUrl: './highscore-entry.component.html',
  styleUrls: ['./highscore-entry.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule]
})
export class HighscoreEntryComponent {
  public data: { score: number; level: number } = inject(MAT_DIALOG_DATA);
  private playerService = inject(PlayerService);
  private dialogRef = inject(MatDialogRef<HighscoreEntryComponent>);

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  initials: string[] = this.getInitialInitials();
  currentInitialIndex = 0;

  private getInitialInitials(): string[] {
    const saved = this.playerService.getInitials();
    if (saved && saved.length === 3) {
      return saved.split('');
    }
    return ['A', 'A', 'A'];
  }

  changeChar(initialIndex: number, direction: number): void {
    const currentLetter = this.initials[initialIndex];
    let currentIndex = this.alphabet.indexOf(currentLetter);
    currentIndex += direction;

    if (currentIndex < 0) {
      currentIndex = this.alphabet.length - 1;
    } else if (currentIndex >= this.alphabet.length) {
      currentIndex = 0;
    }

    this.initials[initialIndex] = this.alphabet[currentIndex];
  }

  save(): void {
    const initials = this.initials.join('');
    this.playerService.setInitials(initials);
    this.playerService
      .saveScore(this.data.score, this.data.level)
      .pipe(take(1))
      .subscribe({
        next: () => this.dialogRef.close(),
        error: (err) => console.error('Failed to save score:', err)
      });
  }
}
