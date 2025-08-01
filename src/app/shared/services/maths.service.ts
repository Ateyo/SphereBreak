import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathsService {
  private _coreSphere: number;
  currentScore: WritableSignal<number> = signal(0);
  currentTotal: WritableSignal<number> = signal(0);
  nextMultiples: WritableSignal<number[]> = signal([]);
  turn: WritableSignal<number> = signal(1);
  echo: WritableSignal<number> = signal(0);
  break: WritableSignal<boolean> = signal(false);
  coinCounter: WritableSignal<number> = signal(0);
  coinUsedSave: number = 0;
  turnLimit = 15;
  quotaLimit: WritableSignal<number> = signal(20);

  constructor() {
    this._coreSphere = 1;
    this.changeCoreSphere();
  }

  get coreSphere(): number {
    return this._coreSphere;
  }

  set coreSphere(value: number) {
    this._coreSphere = value;
  }

  // get currentTotal(): Observable<number> {
  //   return this._currentTotal;
  // }

  // set currentTotal(value: number) {
  //   this._currentTotal = value;
  // }

  public changeCoreSphere() {
    this._coreSphere = this.getRandomIntInclusive(1, 9);
    //this._coreSphere = 7; // For testing purposes, set to 1
  }

  public getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private _numberOfCoinsAdded: number = 0;

  public makeAdditions(selectedCoinsArray: number[]): void {
    let total = 0;
    selectedCoinsArray.forEach((c) => {
      total += c;
    });
    this._numberOfCoinsAdded = selectedCoinsArray.length;
    this.currentTotal.set(total);
    this.getNextMultiples(this.currentTotal());
    this.checkForBreak(total);
  }

  public checkForBreak(total: number): void {
    if (total > 0 && total % this._coreSphere === 0) {
      this.breakLap();
    }
  }

  public getNextMultiples(total?: number): number[] {
    const result: number[] = [];
    let count = 0;
    let currentNumber = this._coreSphere;

    while (count < 5) {
      if (
        currentNumber % this._coreSphere === 0 &&
        currentNumber > (total ? total : 0)
      ) {
        result.push(currentNumber);
        count++;
      }
      currentNumber++;
    }
    this.nextMultiples.set(result);
    return result;
  }

  public breakLap() {
    console.log('Break!');
    this.break.set(true);
    // Calculate score: coins used = number of coins added, multiples found = currentTotal / coreSphere
    const multiplesFound = this.currentTotal() / this._coreSphere;
    this.calculateScore(this._numberOfCoinsAdded, multiplesFound);
    if (this.coinUsedSave === this._numberOfCoinsAdded) {
      this.echo.set(this.echo() + 1);
    }

    this.coinCounter.set(this._numberOfCoinsAdded);
    this.coinUsedSave = this._numberOfCoinsAdded;
    this.newTurn();
  }

  public newTurn() {
    if (this.turn() < this.turnLimit) {
      console.log('Starting new turn: ' + this.turn());
      this.changeCoreSphere();
      this.getNextMultiples(0);
      this.currentTotal.set(0);
      this._numberOfCoinsAdded = 0;
      this.turn.set(this.turn() + 1);
      // Reset coin counter for new turn
    } else {
      // Game over: emit event only, quota check should be handled elsewhere
      this.break.set(false);
      // Optionally emit a game over event here
      //@Todo add game over logic
    }
  }

  public calculateScore(coinsUsed: number, multiplesFound: number): void {
    // Example scoring: each coin used = 10 pts, each multiple found = 50 pts
    console.log(
      `Calculating score: coinsUsed=${coinsUsed}, multiplesFound=${multiplesFound}`
    );
    const coinPoints = coinsUsed * 10;
    const multiplePoints = multiplesFound * 50;
    const score = coinPoints + multiplePoints;
    this.currentScore.set(this.currentScore() + score);
  }

  public setQuotaLimit(limit: number): void {
    this.quotaLimit.set(limit);
  }
}
