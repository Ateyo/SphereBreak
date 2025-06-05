import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonicModule, IonToast, ToastController } from '@ionic/angular';
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
  break = false;
  score: number = 0;
  turn: number = 1;
  turnLimit: number = 15;
  @ViewChild(IonToast) toast: IonToast | undefined;

  constructor(
    private _coinsService: CoinsService,
    private _mathsService: MathsService,
    private toastController: ToastController
  ) {
    this.total = this._mathsService.currentTotal$();
    this._mathsService.nextMultiples$.subscribe((value) => {
      console.log('home page next multiples', value);
      this.nextMultiples = value;
    });
    this._mathsService.break$.subscribe((value) => {
      this.break = value;
      if (value) {
        this._coinsService.clearSelectedCoins();
        this.presentBreakToast('bottom');
        setTimeout(() => {
          this.startNewTurn();
        }, 1000);
      }
    });
    effect(() => {
      this.score = this._mathsService.currentScore$();
    });
    this.turnLimit = this._mathsService.turnLimit;
    this.nextMultiples = this._mathsService.getNextMultiples();
    this.isCoinsSet = this._coinsService.isCoinsSet;
  }

  startNewTurn() {
    // Return any border coins due this turn
    this._coinsService.incrementCoinsArray();
  }

  newTurn() {
    console.log('newturn');
    this.startNewTurn();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('home page total', this.total);
    this.isCoinsSet = this._coinsService.isCoinsSet;
  }

  async presentBreakToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Break! You matched a multiple of the core sphere!',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  get quota(): number {
    return this._coinsService.quota;
  }
}
