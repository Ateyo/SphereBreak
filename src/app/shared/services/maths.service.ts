import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  break$ = new BehaviorSubject<boolean>(false);
  // coinCounter: WritableSignal<number> = signal(0);
  coinUsedSave: number = 0;
  turnLimit = 15;

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
    //this._coreSphere = this.getRandomIntInclusive(1, 9);
    this._coreSphere = 7; // For testing purposes, set to 1
    console.log('Core sphere changed to: ' + this._coreSphere);
  }

  public getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  public makeAdditions(selectedCoinsArray: number[]): void {
    let total = 0;
    selectedCoinsArray.forEach((c) => {
      total += c;
    });
    this.currentTotal.set(total);
    this.checkForBreak(total);
  }

  public checkForBreak(total: number): void {
    if (total > 0 && total % this._coreSphere === 0) {
      this.breakLap();
    } else {
      const nextMultiples = this.getNextMultiples(total);
      if (total > nextMultiples[0]) {
        this.getNextMultiples(total);
      } else {
      }
    }
  }

  public getNextMultiples(total?: number): number[] {
    const result: number[] = [];
    let count = 0;
    let currentNumber = this._coreSphere;

    while (count < 3) {
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

  public newTurn() {
    if (this.turn() < this.turnLimit) {
      this.changeCoreSphere();
      this.getNextMultiples(0);
      this.currentTotal.set(0);
      this.turn.set(this.turn() + 1);
      this.break$.next(false);
    } else {
      // Game over: emit event only, quota check should be handled elsewhere
      this.break$.next(false);
      // Optionally emit a game over event here
      console.log('Turn limit reached! Game over.');
    }
  }

  public breakLap() {
    console.log('Break!');
    // Calculate score: coins used = currentTotal / coreSphere, multiples found = 1 (for this turn)

    const coinsUsed = this.currentTotal() / this._coreSphere;
    // this.coinCounter.set(coinsUsed);
    this.calculateScore(coinsUsed, 1);
    if (this.coinUsedSave === coinsUsed) {
      this.echo.set(this.echo() + 1);
    }
    this.coinUsedSave = coinsUsed;
    this.break$.next(true);
    this.newTurn();
  }

  public calculateScore(coinsUsed: number, multiplesFound: number): number {
    // Example scoring: each coin used = 10 pts, each multiple found = 50 pts
    const coinPoints = coinsUsed * 10;
    const multiplePoints = multiplesFound * 50;
    const score = coinPoints + multiplePoints;
    this.currentScore.set(this.currentScore() + score);
    return score;
  }
}
