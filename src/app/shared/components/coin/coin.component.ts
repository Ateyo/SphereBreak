import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Input
} from '@angular/core';

import { GridEngine } from '../../services/grid-engine.service';

@Component({
  selector: 'app-coin',
  imports: [CommonModule],
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.scss']
})
export class CoinComponent {
  private _gridEngine = inject(GridEngine);

  @Input() coinId: number = 0;
  @Input() coinValue: number = 0;
  @Input() entryCoin: boolean = false;
  selectedCoin: boolean = false;

  constructor() {
    effect(() => {
      this.selectedCoin = this._gridEngine.selectedCoins().some(
        (c) => c.id === this.coinId && c.entryCoin === this.entryCoin
      );
    });
  }

  coinSelection(): void {
    this._gridEngine.selectCoin(this.coinId);
  }
}
