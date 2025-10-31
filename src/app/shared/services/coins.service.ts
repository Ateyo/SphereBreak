import {
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal
} from '@angular/core';

import { Coin, CoinArray } from '../interfaces';
import { MathsService } from './maths.service';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  private _mathsService = inject<MathsService>(MathsService);

  turn: number = 1;
  coinSave: Array<{ id: number; breakCount: number }> = [];

  private _entryCoinsArray: WritableSignal<CoinArray[]> = signal([]);
  private _quota: WritableSignal<number> = signal(0);
  private _levelQuota: WritableSignal<number> = signal(0);
  private _coinsArray: WritableSignal<CoinArray[]> = signal([
    { id: 1, coin: { value: 0, entryCoin: false } }
  ]);
  private _selectedCoins: WritableSignal<Array<Coin>> = signal([]);
  private _breakCounter = 0; // Track number of breaks
  private _coinZeroBreaks = new Map<number, number>(); // Track at which break count each coin was set to 0
  gameWon: WritableSignal<boolean> = signal(false);

  entryCoinFirst = false;
  isCoinsSet: WritableSignal<boolean> = signal(false);

  constructor() {
    // Initialize with test coins
    this.entryCoinsArray = [
      { id: 1, coin: { value: 2, entryCoin: true } },
      { id: 2, coin: { value: 3, entryCoin: true } },
      { id: 3, coin: { value: 5, entryCoin: true } },
      { id: 4, coin: { value: 8, entryCoin: true } }
    ];
    this._coinsArray.set([
      {
        id: 101,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 102,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 103,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 104,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 105,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 106,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 107,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 108,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 109,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 110,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 111,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      },
      {
        id: 112,
        coin: {
          value: this._mathsService.getRandomIntInclusive(1, 9),
          entryCoin: false
        }
      }
    ]);
    this.isCoinsSet.set(true);

    effect(() => {
      this.turn = this._mathsService.turn();
    });
  }

  get entryCoinsArray$() {
    return this._entryCoinsArray.asReadonly();
  }

  set entryCoinsArray(value: CoinArray[]) {
    this._entryCoinsArray.set(
      value.map((coin, index) => ({
        id: index + 1,
        coin: { ...coin.coin, entryCoin: true }
      }))
    );
    this.isCoinsSet.set(true);
  }
  get entryCoinsArray(): CoinArray[] {
    return this._entryCoinsArray();
  }

  addEntryCoin(value: number) {
    const maxId =
      this._entryCoinsArray().length > 0
        ? Math.max(...this._entryCoinsArray().map((c) => c.id))
        : 0;
    const newCoin: CoinArray = {
      id: maxId + 1,
      coin: { value, entryCoin: true }
    };
    this._entryCoinsArray.update((coins) => [...coins, newCoin]);
  }

  removeEntryCoin(coin: CoinArray) {
    this._entryCoinsArray.update((coins) =>
      coins.filter((c) => c.id !== coin.id)
    );
  }

  get coinsArray$() {
    return this._coinsArray.asReadonly();
  }

  set coinsArray(value: CoinArray[]) {
    this._coinsArray.set(value);
    this.isCoinsSet.set(true);
  }

  get selectedCoinsArray(): Coin[] {
    return this._selectedCoins();
  }

  set selectedCoinsArray(coins: Coin[]) {
    this._selectedCoins.set(coins);

    // Update coin counter in MathsService with number of coins
  }

  // Quota tracking
  get quota$() {
    return this._quota.asReadonly();
  }

  get levelQuota$() {
    return this._levelQuota.asReadonly();
  }

  public setQuota(val: number) {
    this._quota.set(val);
  }

  public updateQuota(): void {
    const borderCoinsUsed = this._selectedCoins().filter(
      (coin) => !coin.entryCoin
    );
    this.setQuota(borderCoinsUsed.length);
    this._levelQuota.update(
      (currentLevelQuota) => currentLevelQuota + borderCoinsUsed.length
    );
  }

  public reset() {
    this.gameWon.set(false);
    this.setQuota(0);
    this._levelQuota.set(0);
    this.clearSelectedCoins();
  }

  public addSelectedCoin(coin: Coin, coinId?: number) {
    if (coin !== undefined) {
      this._selectedCoins.update((currentCoins) => [
        ...currentCoins,
        {
          value: coin.value,
          entryCoin: coin.entryCoin,
          id: coinId // Store the ID with the selected coin
        }
      ]);
    }

    // Use makeAdditions to update total and trigger break logic
    this._mathsService.makeAdditions(this._selectedCoins().map((c) => c.value));
    this.updateQuota();
  }

  // Clear selected coins
  public clearSelectedCoins(): void {
    this._selectedCoins.set([]);
    this.updateQuota();
  }

  public removeSelectedCoin(coinId: number): void {
    this._selectedCoins.update((currentCoins) =>
      currentCoins.filter((coin) => coin.id !== coinId)
    );
    // Update the total after removing a coin
    this._mathsService.makeAdditions(this._selectedCoins().map((c) => c.value));
    this.updateQuota();
  }

  // Increment coins in the coinsArray
  // This will increment the value of each coin in the coinsArray
  // If a coin's value is 9, it will be set to 0 and tracked in coinSave
  // If a coin's value is 0, it will be set to a random value between 1 and 9 after 3 breaks
  // If a coin's value is between 1 and 8, it will be incremented by 1
  public incrementCoinsArray(): void {
    this._coinsArray.update((coins) =>
      coins.map((coin) => {
        if (!coin.coin.entryCoin) {
          // Skip entry coins
          if (coin.coin.value === 9) {
            this.coinSave.push({
              id: coin.id,
              breakCount: this._mathsService.turn()
            });
            return { ...coin, coin: { ...coin.coin, value: 0 } };
          } else if (coin.coin.value === 0) {
            const savedCoin = this.coinSave.find((c) => c.id === coin.id);
            if (savedCoin && this.countTurns(savedCoin.breakCount)) {
              const newValue = this._mathsService.getRandomIntInclusive(1, 9);
              // Remove from coinSave as it's no longer at 0
              this.coinSave = this.coinSave.filter((c) => c.id !== coin.id);
              return { ...coin, coin: { ...coin.coin, value: newValue } };
            }
          } else {
            return {
              ...coin,
              coin: { ...coin.coin, value: coin.coin.value + 1 }
            };
          }
        }
        return coin;
      })
    );
  }

  // countTurns before a coin needs to reappear
  // Returns true if the coin has been set to 0 for 3 or more breaks
  // @Param breakCount: number - The break count when the coin was set to 0
  public countTurns(breakCount: number): boolean {
    if (!breakCount) return false;
    // A coin should be restored after 3 turns (so on the 4th turn)
    return this.turn - breakCount >= 3;
  }

  // Call this when a break is made to update quota
  public updateQuotaForBreak(): void {
    this._breakCounter++; // Increment break counter

    // Set used border coins to 0
    const borderCoinsUsed = this._selectedCoins().filter(
      (coin) => !coin.entryCoin
    );
    borderCoinsUsed.forEach((usedCoin) => {
      if (usedCoin.id) {
        const coin = this._coinsArray().find((c) => c.id === usedCoin.id);
        if (coin) {
          this._coinsArray.update((coins) =>
            coins.map((c) =>
              c.id === coin.id ? { ...c, coin: { ...c.coin, value: 0 } } : c
            )
          );

          this.coinSave.push({
            id: usedCoin.id,
            breakCount: this._mathsService.turn()
          });
          // Track when this coin was set to 0
          this._coinZeroBreaks.set(usedCoin.id, this._breakCounter);
        }
      }
    });

    // Check for end of game and quota win/loss only when turns are exceeded
    if (this._mathsService.turn() > this._mathsService.turnLimit()) {
      if (this.checkForQuotaWin()) {
        this.gameWon.set(true);
      } else {
        this.gameWon.set(false);
      }
    }
  }

  checkForQuotaWin(): boolean {
    return this._levelQuota() >= this._mathsService.quotaLimit();
  }

  public updateCoin(coin: CoinArray, newValue: string) {
    const entryCoin = this._entryCoinsArray().find((c) => c.id === coin.id);
    if (entryCoin) {
      const parsedValue = parseInt(newValue, 10);
      if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 9) {
        console.error('Invalid coin value. Must be between 0 and 9.');
        return;
      }
      entryCoin.coin.value = parsedValue;
    }
  }
}
