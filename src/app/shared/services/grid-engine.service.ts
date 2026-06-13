import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { Coin, CoinArray } from '../interfaces';
import { TurnEngine } from './turn-engine.service';

export interface GridEngineSnapshot {
  coinsArray: CoinArray[];
  levelQuota: number;
  selectedCoins: Coin[];
  turnsSinceRegen: number;
}

@Injectable({
  providedIn: 'root'
})
export class GridEngine {
  private _turnEngine = inject(TurnEngine);

  private _entryCoinsArray: WritableSignal<CoinArray[]> = signal([]);
  private _coinsArray: WritableSignal<CoinArray[]> = signal([]);
  private _selectedCoins: WritableSignal<Coin[]> = signal([]);
  private _levelQuota: WritableSignal<number> = signal(0);
  private _isCoinsSet: WritableSignal<boolean> = signal(false);
  private _turnsSinceRegen = 0;

  readonly entryCoinsArray$ = this._entryCoinsArray.asReadonly();
  readonly coinsArray$ = this._coinsArray.asReadonly();
  readonly selectedCoins$ = this._selectedCoins.asReadonly();
  readonly levelQuota$ = this._levelQuota.asReadonly();
  readonly isCoinsSet$ = this._isCoinsSet.asReadonly();

  makeGrid(
    entryCoins: { value: number; entryCoin: boolean }[],
    borderCoins: { value: number; entryCoin: boolean }[]
  ): void {
    this._entryCoinsArray.set(
      entryCoins.map((c, i) => ({
        id: i + 1,
        coin: { value: c.value, entryCoin: true }
      }))
    );
    this._coinsArray.set(
      borderCoins.map((c, i) => ({
        id: 101 + i,
        coin: { value: c.value, entryCoin: false }
      }))
    );
    this._isCoinsSet.set(true);
  }

  addEntryCoin(value: number): void {
    const maxId =
      this._entryCoinsArray().length > 0
        ? Math.max(...this._entryCoinsArray().map((c) => c.id))
        : 0;
    this._entryCoinsArray.update((coins) => [
      ...coins,
      { id: maxId + 1, coin: { value, entryCoin: true } }
    ]);
  }

  removeEntryCoin(id: number): void {
    this._entryCoinsArray.update((coins) => coins.filter((c) => c.id !== id));
  }

  isValidSelection(coinId: number): boolean {
    const allCoins = [...this._entryCoinsArray(), ...this._coinsArray()];
    const target = allCoins.find((c) => c.id === coinId);
    if (!target) return false;
    if (this._selectedCoins().some((c) => c.id === coinId)) return false;
    if (
      !target.coin.entryCoin &&
      !this._selectedCoins().some((c) => c.entryCoin)
    )
      return false;
    return true;
  }

  selectCoin(coinId: number): void {
    if (!this.isValidSelection(coinId)) return;

    const allCoins = [...this._entryCoinsArray(), ...this._coinsArray()];
    const target = allCoins.find((c) => c.id === coinId)!;

    console.log(
      `[GridEngine] selectCoin: id=${coinId} value=${target.coin.value} entryCoin=${target.coin.entryCoin}`
    );

    this._selectedCoins.update((coins) => [
      ...coins,
      {
        value: target.coin.value,
        entryCoin: target.coin.entryCoin,
        id: coinId
      }
    ]);
    const selectedValues = this._selectedCoins().map((c) => c.value);
    console.log(`[GridEngine] selected values: [${selectedValues}]`);
    this._turnEngine.evaluateSelection(selectedValues);
  }

  confirmBreak(): void {
    const selected = this._selectedCoins();
    const borderUsed = selected.filter((c) => !c.entryCoin).length;
    this._levelQuota.update((q) => q + borderUsed);

    const usedIds = selected
      .filter((c) => !c.entryCoin && c.id != null)
      .map((c) => c.id!);
    if (usedIds.length > 0) {
      this._coinsArray.update((coins) =>
        coins.map((c) =>
          usedIds.includes(c.id) ? { ...c, coin: { ...c.coin, value: 0 } } : c
        )
      );
    }
  }

  startNewTurn(): void {
    this._selectedCoins.set([]);
    this._turnsSinceRegen++;

    this._coinsArray.update((coins) =>
      coins.map((c) => {
        if (!c.coin.entryCoin) {
          if (c.coin.value === 9)
            return { ...c, coin: { ...c.coin, value: 0 } };
          if (c.coin.value === 0) return c;
          return { ...c, coin: { ...c.coin, value: c.coin.value + 1 } };
        }
        return c;
      })
    );

    if (this._turnsSinceRegen >= 3) {
      this._turnsSinceRegen = 0;
      this._coinsArray.update((coins) =>
        coins.map((c) => {
          if (!c.coin.entryCoin && c.coin.value === 0) {
            return {
              ...c,
              coin: {
                ...c.coin,
                value: this._turnEngine.getRandomIntInclusive(1, 9)
              }
            };
          }
          return c;
        })
      );
    }
  }

  getSnapshot(): GridEngineSnapshot {
    return {
      coinsArray: this._coinsArray().map((c) => ({
        ...c,
        coin: { ...c.coin }
      })),
      levelQuota: this._levelQuota(),
      selectedCoins: this._selectedCoins().map((c) => ({ ...c })),
      turnsSinceRegen: this._turnsSinceRegen
    };
  }

  restoreSnapshot(snapshot: GridEngineSnapshot): void {
    this._coinsArray.set(snapshot.coinsArray);
    this._levelQuota.set(snapshot.levelQuota);
    this._selectedCoins.set(snapshot.selectedCoins);
    this._turnsSinceRegen = snapshot.turnsSinceRegen;
  }

  reset(): void {
    this._levelQuota.set(0);
    this._selectedCoins.set([]);
    this._turnsSinceRegen = 0;
  }

  clearSelection(): void {
    this._selectedCoins.set([]);
  }
}
