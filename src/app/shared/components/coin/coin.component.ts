import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CoinsService } from '../../services/coins.service';
import { MathsService } from '../../services/maths.service';

@Component({
  selector: 'app-coin',
  imports: [CommonModule],
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.scss'],
})
export class CoinComponent implements OnInit, OnChanges {
  number: number;
  display = true;
  selectedCoin = false;
  entryCoinFirst = false;
  @Input() coinValue: number | undefined;
  @Input() entryCoin = false;

  constructor(
    private mathsService: MathsService,
    private _coinsService: CoinsService
  ) {
    this.number = this.coinValue
      ? this.coinValue
      : this.mathsService.getRandomIntInclusive(1, 9);
    if (this.coinValue === 0) {
      this.display = false;
    }
  }

  coinSelection(): void {
    // Enforce entry coin selection order
    if (this.entryCoin) {
      // Entry coin can always be selected first
      if (
        this._coinsService.selectedCoinsArray.length === 0 ||
        this._coinsService.isEntryCoinSelected()
      ) {
        this.selectedCoin = true;
        this._coinsService.addSelectedCoin(
          this.coinValue ? this.coinValue : this.number
        );
      }
    } else {
      // Border coin: only allow if an entry coin is already selected in this selection
      if (this._coinsService.isEntryCoinSelected() && !this.selectedCoin) {
        this.selectedCoin = true;
        this._coinsService.addSelectedCoin(
          this.coinValue ? this.coinValue : this.number
        );
      }
    }
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coinValue'] && changes['coinValue'].currentValue === 0) {
      this.display = false;
    }
    this.number = this.coinValue
      ? this.coinValue
      : this.mathsService.getRandomIntInclusive(1, 9);
  }

  // Listen for external reset of selected coins
  ngDoCheck(): void {
    if (
      this._coinsService.selectedCoinsArray.length === 0 &&
      this.selectedCoin
    ) {
      this.selectedCoin = false;
    }
  }
}
