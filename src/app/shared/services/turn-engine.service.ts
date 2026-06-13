import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TurnEngine {
  currentTotal: WritableSignal<number> = signal(0);
  nextMultiples: WritableSignal<number[]> = signal([]);
  break: WritableSignal<boolean> = signal(false);
  currentScore: WritableSignal<number> = signal(0);
  echo: WritableSignal<number> = signal(0);
  coinCounter: WritableSignal<number> = signal(0);
  turn: WritableSignal<number> = signal(1);
  turnLimit: WritableSignal<number> = signal(15);
  quotaLimit: WritableSignal<number> = signal(20);
  gameEnded: WritableSignal<boolean> = signal(false);
  private _coreSphere = 1;
  private _numberOfCoinsAdded = 0;
  private _lastCoinCount = 0;

  setCoreSphere(value: number) {
    this._coreSphere = value;
  }

  get coreSphere(): number {
    return this._coreSphere;
  }

  getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  evaluateSelection(values: number[]): void {
    const total = values.reduce((sum, v) => sum + v, 0);
    this._numberOfCoinsAdded = values.length;
    this.currentTotal.set(total);
    this._computeNextMultiples(total);
    this._checkForBreak(total);
  }

  advanceTurn(): void {
    this.break.set(false);
    this.currentTotal.set(0);
    this._lastCoinCount = this._numberOfCoinsAdded;
    this._numberOfCoinsAdded = 0;
    this._computeNextMultiples(0);
    if (this.turn() < this.turnLimit()) {
      this.turn.update(t => t + 1);
      this._generateCoreSphere();
    } else {
      this.gameEnded.set(true);
    }
  }

  loadLevel(turns: number, quota: number): void {
    this.turnLimit.set(turns);
    this.quotaLimit.set(quota);
    this.currentScore.set(0);
    this.turn.set(1);
    this.break.set(false);
    this.gameEnded.set(false);
    this.echo.set(0);
    this.currentTotal.set(0);
    this._numberOfCoinsAdded = 0;
    this._lastCoinCount = 0;
    this._generateCoreSphere();
    this._computeNextMultiples(0);
  }

  private _generateCoreSphere(): void {
    this._coreSphere = this.getRandomIntInclusive(1, 9);
  }

  private _checkForBreak(total: number): void {
    if (total > 0 && total % this._coreSphere === 0 && !this.break()) {
      this.break.set(true);
      this.coinCounter.set(this._numberOfCoinsAdded);
      const multiplesFound = total / this._coreSphere;
      this._calculateScore(this._numberOfCoinsAdded, multiplesFound);
      if (this._lastCoinCount > 0 && this._lastCoinCount === this._numberOfCoinsAdded) {
        this.echo.update(e => e + 1);
      }
    }
  }

  private _calculateScore(coinsUsed: number, multiplesFound: number): void {
    this.currentScore.update(s => s + coinsUsed * 10 + multiplesFound * 50);
  }

  private _computeNextMultiples(total: number): void {
    const result: number[] = [];
    let count = 0;
    let current = total + 1;

    while (count < 5) {
      if (current % this._coreSphere === 0) {
        result.push(current);
        count++;
      }
      current++;
    }
    this.nextMultiples.set(result);
  }
}
