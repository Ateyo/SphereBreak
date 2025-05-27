import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CoinsService } from '../shared/services/coins.service';
import { MathsService } from '../shared/services/maths.service';
import { GridComponent } from './grid/grid.component';

@Component({
  selector: 'app-home',
  imports: [GridComponent, IonicModule, CommonModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnChanges {
  isCoinsSet = false;
  total: number = 0;
  nextMultiples: Array<number>;

  constructor(
    private _coinsService: CoinsService,
    private _mathsService: MathsService
  ) {
    this._mathsService.currentTotal$.subscribe((value) => {
      this.total = value;
    });
    this._mathsService.nextMultiples$.subscribe((value) => {
      console.log(value);
      this.nextMultiples = value;
    });
    this.nextMultiples = this._mathsService.getNextMultiples();
    this.isCoinsSet = this._coinsService.isCoinsSet;
  }

  newTurn() {
    console.log('newturn');
    this._coinsService.incrementCoinsArray();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.total);
    this.isCoinsSet = this._coinsService.isCoinsSet;
  }
}
