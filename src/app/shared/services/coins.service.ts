import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Coin, CoinArray } from '../interfaces';
import { MathsService } from './maths.service';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  turn: number = 1;
  coinSave: Array<{ id: number; breakCount: number }> = [];

  private _entryCoinsArray: WritableSignal<CoinArray[]> = signal([
    { id: 1, coin: { value: 0, entryCoin: true } }
  ]);
  private _quota = 0;
  private _coinsArray: CoinArray[] = [
    { id: 1, coin: { value: 0, entryCoin: false } }
  ];
  private _selectedCoins: Array<Coin> = [];
  private _breakCounter = 0; // Track number of breaks
  private _coinZeroBreaks = new Map<number, number>(); // Track at which break count each coin was set to 0

  entryCoinFirst = false;
  isCoinsSet = false;

  constructor(private _mathsService: MathsService) {
    // Initialize with test coins
    this.entryCoinsArray = [
      { id: 1, coin: { value: 2, entryCoin: true } },
      { id: 2, coin: { value: 3, entryCoin: true } },
      { id: 3, coin: { value: 5, entryCoin: true } },
      { id: 4, coin: { value: 8, entryCoin: true } }
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
      { id: 12, coin: { value: 3, entryCoin: false } }
    ];
    this.isCoinsSet = true;

    effect(() => {
      this.turn = this._mathsService.turn();
    });
    // Subscribe to break$ to update quota on break
    this._mathsService.break$.subscribe((isBreak) => {
      if (isBreak) {
        this.updateQuotaForBreak();
      }
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
    this.isCoinsSet = true;
  }
  get entryCoinsArray(): CoinArray[] {
    return this._entryCoinsArray();
  }

  get coinsArray(): CoinArray[] {
    return this._coinsArray;
  }

  set coinsArray(value: CoinArray[]) {
    this._coinsArray = value;
    this.isCoinsSet = true;
  }

  get selectedCoinsArray(): CoinArray[] {
    return this._selectedCoins.map((coin) => ({
      id: coin.id || 0, // Use stored ID or 0 as fallback
      coin: coin
    }));
  }

  set selectedCoinsArray(coins: CoinArray[]) {
    this._selectedCoins = coins.map((c) => ({
      ...c.coin,
      id: c.id // Preserve the ID when setting selected coins
    }));

    // Update coin counter in MathsService with number of coins
  }

  public checkEntryCoinFirst(entryCoin: boolean): boolean {
    if (entryCoin && this.selectedCoinsArray.length === 0) {
      this.entryCoinFirst = true;
      return true;
    } else {
      return false;
    }
  }

  public addSelectedCoin(coin: Coin, coinId?: number) {
    if (coin !== undefined) {
      this._selectedCoins.push({
        value: coin.value,
        entryCoin: coin.entryCoin,
        id: coinId // Store the ID with the selected coin
      });

      // Use makeAdditions to update total and trigger break logic
      this._mathsService.makeAdditions(this._selectedCoins.map((c) => c.value));
    }
  }

  // Clear selected coins
  public clearSelectedCoins() {
    this._selectedCoins = [];
  }

  // Increment coins in the coinsArray
  // This will increment the value of each coin in the coinsArray
  // If a coin's value is 9, it will be set to 0 and tracked in coinSave
  // If a coin's value is 0, it will be set to a random value between 1 and 9 after 3 breaks
  // If a coin's value is between 1 and 8, it will be incremented by 1
  public incrementCoinsArray() {
    this.coinsArray.forEach((coin) => {
      if (!coin.coin.entryCoin) {
        // Skip entry coins
        if (coin.coin.value === 9) {
          this.coinSave.push({
            id: coin.id,
            breakCount: this._mathsService.turn()
          });
          coin.coin.value = 0;
        } else if (coin.coin.value === 0) {
          const savedCoin = this.coinSave.find((c) => c.id === coin.id);
          if (savedCoin && this.countTurns(savedCoin.breakCount)) {
            coin.coin.value = this._mathsService.getRandomIntInclusive(1, 9);
            // Remove from coinSave as it's no longer at 0
            this.coinSave = this.coinSave.filter((c) => c.id !== coin.id);
          }
        } else {
          coin.coin.value++;
        }
      }
    });

    // Trigger change detection
    this._coinsArray = [...this._coinsArray];
  }

  // countTurns before a coin needs to reappear
  // Returns true if the coin has been set to 0 for 3 or more breaks
  // @Param breakCount: number - The break count when the coin was set to 0
  public countTurns(breakCount: number): boolean {
    if (!breakCount) return false;
    // A coin should be restored after 3 turns (so on the 4th turn)
    return this.turn - breakCount >= 3;
  }

  // Returns true if an entry coin is selected in the current selection
  // @Param coins: CoinArray - The coin to check
  public isEntryCoinSelected(coins: CoinArray): boolean {
    return this.selectedCoinsArray.some(
      (selectedCoin) =>
        selectedCoin.coin.entryCoin &&
        selectedCoin.coin.value === coins.coin.value
    );
  }

  // Returns true if the coin is a border coin (not an entry coin)
  // @Param coin: Coin - The coin to check
  public isBorderCoin(coin: Coin): boolean {
    return !coin.entryCoin;
  }

  // Quota tracking
  get quota(): number {
    return this._quota;
  }

  set quota(val: number) {
    this._quota = val;
  }

  // Call this when a break is made to update quota
  public updateQuotaForBreak(): void {
    // Only count and process border coins in the last selection
    const borderCoinsUsed = this._selectedCoins.filter(
      (coin) => !coin.entryCoin
    );
    this._quota += borderCoinsUsed.length;
    this._breakCounter++; // Increment break counter

    // Set used border coins to 0
    borderCoinsUsed.forEach((usedCoin) => {
      if (usedCoin.id) {
        const coin = this._coinsArray.find((c) => c.id === usedCoin.id);
        if (coin) {
          coin.coin.value = 0;

          this.coinSave.push({
            id: usedCoin.id,
            breakCount: this._mathsService.turn()
          });
          // Track when this coin was set to 0
          this._coinZeroBreaks.set(usedCoin.id, this._breakCounter);
        }
      }
    });

    // Check for end of game and quota win/loss
    if (this._mathsService.turn() > this._mathsService.turnLimit) {
      if (this._quota >= 20) {
        alert('Victory! You met the quota!');
      } else {
        alert('Game Over! You did not meet the quota.');
      }
    }
  }
}
