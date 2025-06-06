import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoinsService } from '../../services/coins.service';
import { MathsService } from '../../services/maths.service';

@Component({
  selector: 'app-coin',
  imports: [CommonModule],
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.scss']
})
export class CoinComponent implements OnChanges {
  @Input() coinId: number = 0;
  number: number;
  selectedCoin: boolean = false;
  entryCoinFirst = false;
  @Input() coinValue: number = 0;
  @Input() entryCoin: boolean = false;

  constructor(
    private mathsService: MathsService,
    private _coinsService: CoinsService
  ) {
    this.number = this.coinValue
      ? this.coinValue
      : this.mathsService.getRandomIntInclusive(1, 9);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coinValue'] && changes['coinValue'].currentValue === 0) {
    }
    this.number = this.coinValue
      ? this.coinValue
      : this.mathsService.getRandomIntInclusive(1, 9);
  }

  ngDoCheck(): void {
    if (
      this._coinsService.selectedCoinsArray.length === 0 &&
      this.selectedCoin
    ) {
      this.selectedCoin = false;
    }
  }

  coinSelection(): void {
    const coinToAdd = {
      value: this.coinValue !== undefined ? this.coinValue : this.number,
      entryCoin: this.entryCoin,
      id: this.coinId
    };

    // Allow selecting multiple entry coins, but border coins require at least one entry coin
    if (this.entryCoin) {
      this.selectedCoin = true;
      this._coinsService.addSelectedCoin(coinToAdd, this.coinId);
    } else {
      // Border coin: only allow if at least one entry coin is selected
      if (this._coinsService.selectedCoinsArray.some((c) => c.coin.entryCoin)) {
        this.selectedCoin = true;
        this._coinsService.addSelectedCoin(coinToAdd, this.coinId);
      }
    }
  }
}
