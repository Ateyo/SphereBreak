import { Injectable, signal, WritableSignal } from '@angular/core';
import { Coin, CoinArray } from '../interfaces';
import { MathsService } from './maths.service';

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  private _entryCoinsArray: WritableSignal<CoinArray[]> = signal([
    { id: 1, coin: { value: 0, entryCoin: true } },
  ]);
  private _quota = 0;

  get entryCoinsArray$() {
    return this._entryCoinsArray.asReadonly();
  }
  set entryCoinsArray(value: CoinArray[]) {
    this._entryCoinsArray.set(
      value.map((coin, index) => ({
        id: index + 1,
        coin: { ...coin.coin, entryCoin: true },
      }))
    );
    this.isCoinsSet = true;
  }
  get entryCoinsArray(): CoinArray[] {
    return this._entryCoinsArray();
  }

  private _coinsArray: CoinArray[] = [
    { id: 1, coin: { value: 0, entryCoin: false } },
  ];
  private _selectedCoins: Array<Coin> = [];

  entryCoinFirst = false;
  isCoinsSet = false;
  constructor(private _mathsService: MathsService) {
    //@TODO remove sometime, set coins for testing purposes
    this.entryCoinsArray = [
      { id: 1, coin: { value: 2, entryCoin: true } },
      { id: 2, coin: { value: 3, entryCoin: true } },
      { id: 3, coin: { value: 5, entryCoin: true } },
      { id: 4, coin: { value: 8, entryCoin: true } },
    ];
    this._coinsArray = [
      { id: 1, coin: { value: 1, entryCoin: false } },
      { id: 2, coin: { value: 2, entryCoin: false } },
      { id: 3, coin: { value: 3, entryCoin: false } },
      { id: 4, coin: { value: 4, entryCoin: false } },
      { id: 5, coin: { value: 5, entryCoin: false } },
      { id: 6, coin: { value: 6, entryCoin: false } },
      { id: 7, coin: { value: 7, entryCoin: false } },
      { id: 8, coin: { value: 8, entryCoin: false } },
      { id: 9, coin: { value: 9, entryCoin: false } },
      { id: 10, coin: { value: 1, entryCoin: false } },
      { id: 11, coin: { value: 2, entryCoin: false } },
      { id: 12, coin: { value: 3, entryCoin: false } },
    ];
    this.isCoinsSet = true;

    // Subscribe to break$ to update quota on break
    this._mathsService.break$.subscribe((isBreak) => {
      if (isBreak) {
        this.updateQuotaForBreak();
      }
    });
  }

  get coinsArray(): CoinArray[] {
    return this._coinsArray;
  }

  set coinsArray(value: CoinArray[]) {
    this._coinsArray = value;
    this.isCoinsSet = true;
  }

  get selectedCoinsArray(): Array<Coin> {
    //console.log('Selected coins array:', this._selectedCoins);
    return this._selectedCoins;
  }

  set selectedCoinsArray(value: Array<Coin>) {
    this._selectedCoins = value;
  }

  public checkEntryCoinFirst(entryCoin: boolean): boolean {
    if (entryCoin && this.selectedCoinsArray.length === 0) {
      this.entryCoinFirst = true;
      return true;
    } else {
      return false;
    }
  }

  public addSelectedCoin(coinValue: number) {
    if (coinValue !== undefined) {
      this.selectedCoinsArray.push({ value: coinValue, entryCoin: false });
      // Use makeAdditions to update total and trigger break logic
      this._mathsService.makeAdditions(
        this.selectedCoinsArray.map((c) => c.value)
      );
    }
  }

  public clearSelectedCoins() {
    this.selectedCoinsArray = [];
  }

  public incrementCoinsArray() {
    console.log(this.coinsArray);

    let counter = 1;
    this.coinsArray.forEach((c, index) => {
      let coin = c;
      if (coin.coin.value === 9) {
        coin.coin.value = 0;
      } else if (coin.coin.value === 0 && counter < 4) {
        counter++;
      } else {
        coin.coin.value++;
      }
      this.coinsArray[index] = coin;
    });
    console.log(this.coinsArray);
  }

  // Returns true if an entry coin is selected in the current selection
  public isEntryCoinSelected(): boolean {
    // Check if any selected coin is an entry coin
    return this.selectedCoinsArray.some((coin) =>
      this.entryCoinsArray.some(
        (entryCoin) => entryCoin.coin.value === coin.value
      )
    );
  }

  // Returns true if the coin is a border coin (not an entry coin)
  public isBorderCoin(coinValue: number): boolean {
    return !this.entryCoinsArray.some(
      (entryCoin) => entryCoin.coin.value === coinValue
    );
  }

  // Quota tracking: how many border coins have been used this game
  get quota(): number {
    return this._quota;
  }
  set quota(val: number) {
    this._quota = val;
  }

  // Call this when a break is made to update quota
  public updateQuotaForBreak(): void {
    // Only count border coins in the last selection
    const borderCoinsUsed = this.selectedCoinsArray.filter((coin) =>
      this.isBorderCoin(coin.value)
    );
    this._quota += borderCoinsUsed.length;
    // Remove used border coins and schedule their return
    // Check for end of game and quota win/loss
    if (this._mathsService.turn$.value > this._mathsService.turnLimit) {
      if (this._quota >= 20) {
        alert('Victory! You met the quota!');
      } else {
        alert('Game Over! You did not meet the quota.');
      }
    }
  }
}
