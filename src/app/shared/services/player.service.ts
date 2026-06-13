import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { HighscoreService } from './highscore.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _highscoreService = inject(HighscoreService);
  private _playerInitials: WritableSignal<string> = signal('');
  readonly playerInitials$ = this._playerInitials.asReadonly();

  constructor() {
    const savedInitials = localStorage.getItem('playerInitials');
    if (savedInitials) {
      this._playerInitials.set(savedInitials);
    }
  }

  setInitials(initials: string): void {
    this._playerInitials.set(initials);
    localStorage.setItem('playerInitials', initials);
  }

  getInitials(): string {
    return this._playerInitials();
  }

  saveScore(score: number, level: number) {
    return this._highscoreService.addHighscore(
      this._playerInitials(),
      score,
      level
    );
  }
}
