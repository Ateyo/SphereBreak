import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { HighscoreService } from './highscore.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _highscoreService = inject(HighscoreService);
  playerInitials: WritableSignal<string> = signal('');

  constructor() {
    const savedInitials = localStorage.getItem('playerInitials');
    if (savedInitials) {
      this.playerInitials.set(savedInitials);
    }
  }

  setInitials(initials: string): void {
    this.playerInitials.set(initials);
    localStorage.setItem('playerInitials', initials);
  }

  getInitials(): string {
    return this.playerInitials();
  }

  saveScore(score: number, level: number) {
    return this._highscoreService.addHighscore(
      this.playerInitials(),
      score,
      level
    );
  }
}
