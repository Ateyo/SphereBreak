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
    if (
      this._coinsService.checkEntryCoinFirst(this.entryCoin) ||
      this._coinsService.entryCoinFirst
    ) {
      this.selectedCoin = true;
      this._coinsService.addSelectedCoin(
        this.coinValue ? this.coinValue : this.number
      );
    }
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coinValue'].currentValue === 0) {
      this.display = false;
    }
    this.number = this.coinValue
      ? this.coinValue
      : this.mathsService.getRandomIntInclusive(1, 9);
  }
}
