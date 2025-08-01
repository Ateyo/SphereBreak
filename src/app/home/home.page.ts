import { Component, effect, inject, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IonicModule, IonToast, ToastController } from '@ionic/angular';

import levels from '../../assets/levels.json';
import { CoinsService } from '../shared/services/coins.service';
import { MathsService } from '../shared/services/maths.service';
import { GridComponent } from './grid/grid.component';
import { WinDialogComponent } from './win-dialog/win-dialog.component';

@Component({
  selector: 'app-home',
  imports: [GridComponent, IonicModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnChanges {
  private _coinsService = inject<CoinsService>(CoinsService);
  private _mathsService = inject<MathsService>(MathsService);
  private toastController = inject<ToastController>(ToastController);
  private dialog = inject<MatDialog>(MatDialog);

  isCoinsSet = false;
  total: number = 0;
  nextMultiples: Array<number> = [];
  break = false;
  score: number = 0;
  turn: number = 1;
  turnLimit: number = 15;
  quotaLimit: number = 0;
  echo = 0;
  coinCounter = 0;
  gameWon = false;
  level = 0;
  @ViewChild(IonToast) toast: IonToast | undefined;

  constructor() {
    effect(() => {
      this.total = this._mathsService.currentTotal();
      this.nextMultiples = this._mathsService.nextMultiples();
      this.turn = this._mathsService.turn();
      this.echo = this._mathsService.echo();
      this.coinCounter = this._mathsService.coinCounter();
      this.quotaLimit = this._mathsService.quotaLimit();
      this.gameWon = this._coinsService.gameWon();
      if (this.gameWon && this.isCoinsSet) {
        this.openWinDialog();
      }
    });

    effect(() => {
      this.break = this._mathsService.break();
      if (this.break) {
        setTimeout(() => {
          this.presentBreakToast('middle');
          this._coinsService.updateQuotaForBreak();
          this.startNewTurn();
          this._mathsService.break.set(false);
        }, 1000);
      }
    });
    effect(() => {
      this.score = this._mathsService.currentScore();
    });
    this.loadLevel(this.level);
    this.isCoinsSet = this._coinsService.isCoinsSet;
  }

  startNewTurn() {
    // Return any border coins due this turn
    this._coinsService.incrementCoinsArray();
    this._coinsService.clearSelectedCoins();
  }

  newTurn() {
    console.log('newturn');
    this.startNewTurn();
  }

  ngOnChanges(): void {
    console.log('home page total', this.total);
    this.isCoinsSet = this._coinsService.isCoinsSet;
  }

  async presentBreakToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Break! You matched a multiple of the core sphere!',
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  get quota(): number {
    return this._coinsService.quota;
  }

  openWinDialog() {
    const dialogRef = this.dialog.open(WinDialogComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result === true) {
          this.replay();
        } else if (result === false) {
          this.nextLevel();
        }
      },
      (error) => {
        console.error('Error closing win dialog:', error);
      }
    );
  }

  replay() {
    this.loadLevel(this.level);
    this._coinsService.gameWon.set(false);
  }

  nextLevel() {
    if (this.level + 1 < levels.length) {
      this.level++;
      this.loadLevel(this.level);
      this._coinsService.gameWon.set(false);
    } else {
      console.log('All levels completed!');
    }
  }

  loadLevel(level: number) {
    if (level < 0 || level >= levels.length) {
      console.error(`Invalid level: ${level}`);
      return;
    }
    this.turnLimit = levels[level].turns;
    this._mathsService.setQuotaLimit(levels[level].quota);
    this._mathsService.turn.set(1);
    this._mathsService.currentScore.set(0);
    this._coinsService.setQuota(0);
    this._coinsService.reset();
    this.nextMultiples = this._mathsService.getNextMultiples();
  }
}
