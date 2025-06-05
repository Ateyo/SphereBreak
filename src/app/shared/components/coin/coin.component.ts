import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
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
export class CoinComponent implements OnInit, OnChanges {
  @Input() coinId: number = 0;
  number: number;
  display = true;
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

  ngOnInit() {
    if (this.coinValue === 0) {
      this.display = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coinValue'] && changes['coinValue'].currentValue === 0) {
      this.display = false;
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
    // Only allow selection if coin has a valid value
    if (this.coinValue && this.coinValue > 0) {
      this.selectedCoin = !this.selectedCoin;

      if (this.selectedCoin) {
        this._coinsService.addSelectedCoin(
          {
            value: this.coinValue,
            entryCoin: this.entryCoin
          },
          this.coinId
        );
      } else {
        this._coinsService.clearSelectedCoins();
      }
    }
  }
}
