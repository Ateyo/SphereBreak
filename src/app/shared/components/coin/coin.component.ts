import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CoinsService } from '../../services/coins.service';
import { MathsService } from '../../services/maths.service';

@Component({
  selector: 'app-coin',
  imports: [CommonModule],
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.scss']
})
export class CoinComponent implements OnChanges {
  private _mathsService = inject(MathsService);
  private _coinsService = inject(CoinsService);

  @Input() coinId: number = 0;
  number: number;
  selectedCoin: boolean = false;
  entryCoinFirst = false;
  @Input() coinValue: number = 0;
  @Input() entryCoin: boolean = false;

  constructor() {
    this.number = this.coinValue
      ? this.coinValue
      : this._mathsService.getRandomIntInclusive(1, 9);

    effect(() => {
      this.selectedCoin = this._coinsService.selectedCoinsArray.some(
        (c) => c.id === this.coinId && c.entryCoin === this.entryCoin
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coinValue'] && changes['coinValue'].currentValue === 0) {
      return;
    }
    this.number = this.coinValue
      ? this.coinValue
      : this._mathsService.getRandomIntInclusive(1, 9);
  }

  coinSelection(): void {
    const coinToAdd = {
      value: this.coinValue !== undefined ? this.coinValue : this.number,
      entryCoin: this.entryCoin,
      id: this.coinId
    };

    // Allow selecting multiple unique entry coins, but border coins require at least one entry coin
    if (this.entryCoin) {
      if (
        this._coinsService.selectedCoinsArray.some((c) => c.id === this.coinId)
      ) {
        // If already selected, do nothing (no toggling)
      } else {
        this._coinsService.addSelectedCoin(coinToAdd, this.coinId);
      }
    } else {
      // Border coin: only allow if at least one entry coin is selected
      if (
        this._coinsService.selectedCoinsArray.some((c) => c.entryCoin) &&
        !this._coinsService.selectedCoinsArray.some((c) => c.id === this.coinId)
      ) {
        this._coinsService.addSelectedCoin(coinToAdd, this.coinId);
      } else if (
        this._coinsService.selectedCoinsArray.some((c) => c.id === this.coinId)
      ) {
        // If already selected, do nothing (no toggling)
      }
    }
  }
}
