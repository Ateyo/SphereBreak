import { inject, Injectable, signal } from '@angular/core';

import { GridEngine, GridEngineSnapshot } from './grid-engine.service';
import { TurnEngine, TurnEngineSnapshot } from './turn-engine.service';

export interface TurnSnapshot {
  turn: number;
  turnEngine: TurnEngineSnapshot;
  gridEngine: GridEngineSnapshot;
}

@Injectable({
  providedIn: 'root'
})
export class TurnHistoryService {
  private _turnEngine = inject(TurnEngine);
  private _gridEngine = inject(GridEngine);

  private _history = signal<TurnSnapshot[]>([]);

  readonly history$ = this._history.asReadonly();

  snapshot(): void {
    this._history.update((h) => [
      ...h,
      {
        turn: this._turnEngine.getSnapshot().turn,
        turnEngine: this._turnEngine.getSnapshot(),
        gridEngine: this._gridEngine.getSnapshot()
      }
    ]);
  }

  private _applySnapshot(snapshot: TurnSnapshot): void {
    this._turnEngine.restoreSnapshot(snapshot.turnEngine);
    this._turnEngine.clearBreak();
    this._gridEngine.restoreSnapshot(snapshot.gridEngine);
  }

  revert(): boolean {
    const history = this._history();
    if (history.length === 0) return false;

    const snapshot = history[history.length - 1];
    this._applySnapshot(snapshot);
    this._history.update((h) => h.slice(0, -1));

    return true;
  }

  revertTo(index: number): boolean {
    const history = this._history();
    if (index < 0 || index >= history.length) return false;

    const snapshot = history[index];
    this._applySnapshot(snapshot);
    this._history.update((h) => h.slice(0, index));

    return true;
  }

  clear(): void {
    this._history.set([]);
  }
}
