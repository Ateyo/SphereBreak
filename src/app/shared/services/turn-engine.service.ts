import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TurnEngine {
  private _currentTotal: WritableSignal<number> = signal(0);
  private _nextMultiples: WritableSignal<number[]> = signal([]);
  private _break: WritableSignal<boolean> = signal(false);
  private _currentScore: WritableSignal<number> = signal(0);
  private _echo: WritableSignal<number> = signal(0);
  private _coinCounter: WritableSignal<number> = signal(0);
  private _turn: WritableSignal<number> = signal(1);
  private _turnLimit: WritableSignal<number> = signal(15);
  private _quotaLimit: WritableSignal<number> = signal(20);
  private _gameEnded: WritableSignal<boolean> = signal(false);

  readonly currentTotal$ = this._currentTotal.asReadonly();
  readonly nextMultiples$ = this._nextMultiples.asReadonly();
  readonly break$ = this._break.asReadonly();
  readonly currentScore$ = this._currentScore.asReadonly();
  readonly echo$ = this._echo.asReadonly();
  readonly coinCounter$ = this._coinCounter.asReadonly();
  readonly turn$ = this._turn.asReadonly();
  readonly turnLimit$ = this._turnLimit.asReadonly();
  readonly quotaLimit$ = this._quotaLimit.asReadonly();
  readonly gameEnded$ = this._gameEnded.asReadonly();

  private _coreSphere: WritableSignal<number> = signal(1);
  private _numberOfCoinsAdded = 0;
  private _lastCoinCount = 0;

  readonly coreSphere$ = this._coreSphere.asReadonly();

  setCoreSphere(value: number) {
    this._coreSphere.set(value);
  }

  get coreSphere(): number {
    return this._coreSphere();
  }

  getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  evaluateSelection(values: number[]): void {
    const total = values.reduce((sum, v) => sum + v, 0);
    this._numberOfCoinsAdded = values.length;
    this._currentTotal.set(total);
    this._computeNextMultiples(total);
    console.log(`[TurnEngine] evaluateSelection: values=[${values}] total=${total} coreSphere=${this._coreSphere()} total%coreSphere=${total % this._coreSphere()}`);
    this._checkForBreak(total);
  }

  advanceTurn(): void {
    this._break.set(false);
    this._currentTotal.set(0);
    this._lastCoinCount = this._numberOfCoinsAdded;
    this._numberOfCoinsAdded = 0;
    this._computeNextMultiples(0);
    this._turn.update(t => t + 1);
    if (this._turn() > this._turnLimit()) {
      this._gameEnded.set(true);
    } else {
      this._generateCoreSphere();
    }
  }

  resetGame(): void {
    this._gameEnded.set(false);
  }

  loadLevel(turns: number, quota: number): void {
    this._turnLimit.set(turns);
    this._quotaLimit.set(quota);
    this._currentScore.set(0);
    this._turn.set(1);
    this._break.set(false);
    this._gameEnded.set(false);
    this._echo.set(0);
    this._currentTotal.set(0);
    this._numberOfCoinsAdded = 0;
    this._lastCoinCount = 0;
    this._generateCoreSphere();
    this._computeNextMultiples(0);
  }

  private _generateCoreSphere(): void {
    this._coreSphere.set(this.getRandomIntInclusive(1, 9));
  }

  private _checkForBreak(total: number): void {
    const isMultiple = total > 0 && total % this._coreSphere() === 0;
    console.log(`[TurnEngine] _checkForBreak: total=${total} coreSphere=${this._coreSphere()} isMultiple=${isMultiple} alreadyBroken=${this._break()}`);
    if (isMultiple && !this._break()) {
      console.log(`[TurnEngine] BREAK! coins=${this._numberOfCoinsAdded} multiples=${total / this._coreSphere()}`);
      this._break.set(true);
      this._coinCounter.set(this._numberOfCoinsAdded);
      const multiplesFound = total / this._coreSphere();
      this._calculateScore(this._numberOfCoinsAdded, multiplesFound);
      if (this._lastCoinCount > 0 && this._lastCoinCount === this._numberOfCoinsAdded) {
        this._echo.update(e => e + 1);
      }
    }
  }

  private _calculateScore(coinsUsed: number, multiplesFound: number): void {
    this._currentScore.update(s => s + coinsUsed * 10 + multiplesFound * 50);
  }

  private _computeNextMultiples(total: number): void {
    const result: number[] = [];
    let count = 0;
    let current = total + 1;

    while (count < 5) {
      if (current % this._coreSphere() === 0) {
        result.push(current);
        count++;
      }
      current++;
    }
    this._nextMultiples.set(result);
  }
}
