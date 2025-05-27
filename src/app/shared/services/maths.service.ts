import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MathsService {
  private _coreSphere: number;
  currentScore$ = new BehaviorSubject<number>(0);
  currentTotal$ = new BehaviorSubject<number>(0);
  nextMultiples$ = new BehaviorSubject<number[]>([]);

  constructor() {
    this._coreSphere = this.getRandomIntInclusive(1, 9);
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
    this.coreSphere = this.getRandomIntInclusive(1, 9);
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
    this.currentTotal$.next(total);
    this.checkForVictory(total);
  }

  public checkForVictory(total: number): void {
    console.log('checking for victory' + total);
    let nextMultiples = this.getNextMultiples();
    if (total === nextMultiples[0]) {
      console.log('VICTORY');
    } else if (total > nextMultiples[0]) {
      console.log('uhhfkjds');
      this.getNextMultiples(total);
    } else if (total < nextMultiples[0]) {
      console.log('not yet');
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
    this.nextMultiples$.next(result);
    return result;
  }

  public newTurn() {
    this.changeCoreSphere();
    this.getNextMultiples();
  }

  public calculateScore() {}
}
