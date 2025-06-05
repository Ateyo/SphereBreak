import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MathsService {
  private _coreSphere: number;
  currentScore$: WritableSignal<number> = signal(0);
  currentTotal$: WritableSignal<number> = signal(0);
  //nextMultiples$ = new BehaviorSubject<number[]>([]);

  nextMultiples$: WritableSignal<number[]> = signal([]);
  break$ = new BehaviorSubject<boolean>(false);
  turn$ = new BehaviorSubject<number>(1);
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
    this.currentTotal$.set(total);
    this.checkForBreak(total);
  }

  public checkForBreak(total: number): void {
    console.log('checking for break ' + total);
    if (total > 0 && total % this._coreSphere === 0) {
      console.log(
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH'
      );
      this.breakLap();
    } else {
      const nextMultiples = this.getNextMultiples(total);
      if (total > nextMultiples[0]) {
        console.log('Exceeded next multiple, recalculate.');
        this.getNextMultiples(total);
      } else {
        console.log('not yet');
      }
    }
  }

  public getNextMultiples(total?: number): number[] {
    console.log('getting next multiples');
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
    this.nextMultiples$.set(result);
    return result;
  }

  public newTurn() {
    if (this.turn$.value < this.turnLimit) {
      this.changeCoreSphere();
      this.getNextMultiples(0);
      this.currentTotal$.set(0);
      this.turn$.next(this.turn$.value + 1);
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
    const coinsUsed =
      this.currentTotal$() > 0 ? this.currentTotal$() / this._coreSphere : 0;
    this.calculateScore(coinsUsed, 1);
    this.break$.next(true);
    this.newTurn();
  }

  public calculateScore(coinsUsed: number, multiplesFound: number): number {
    // Example scoring: each coin used = 10 pts, each multiple found = 50 pts
    const coinPoints = coinsUsed * 10;
    const multiplePoints = multiplesFound * 50;
    const score = coinPoints + multiplePoints;
    this.currentScore$.set(this.currentScore$() + score);
    return score;
  }
}
