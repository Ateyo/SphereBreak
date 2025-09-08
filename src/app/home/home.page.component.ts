import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IonicModule, IonToast, ToastController } from '@ionic/angular';
import { take } from 'rxjs';

import levels from '../../assets/levels.json';
import { CoinsService } from '../shared/services/coins.service';
import { HighscoreService } from '../shared/services/highscore.service';
import { MathsService } from '../shared/services/maths.service';
import { PlayerService } from '../shared/services/player.service';
import { GridComponent } from './grid/grid.component';
import { LossDialogComponent } from './loss-dialog/loss-dialog.component';
import { WinDialogComponent } from './win-dialog/win-dialog.component';

@Component({
  selector: 'app-home-page',
  imports: [GridComponent, IonicModule],
  templateUrl: 'home.page.component.html',
  styleUrls: ['home.page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  private _coinsService = inject<CoinsService>(CoinsService);
  private _mathsService = inject<MathsService>(MathsService);
  private toastController = inject<ToastController>(ToastController);
  private dialog = inject<MatDialog>(MatDialog);
  private _highscoreService = inject<HighscoreService>(HighscoreService);
  private _playerService = inject<PlayerService>(PlayerService);

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
  private dialogOpen = false;

  private breakTimeout?: ReturnType<typeof setTimeout>;
  @ViewChild(IonToast) toast: IonToast | undefined;

  constructor() {
    effect(() => {
      this.isCoinsSet = this._coinsService.isCoinsSet();
    });
    effect(() => {
      this.total = this._mathsService.currentTotal();
      this.nextMultiples = this._mathsService.nextMultiples();
      this.turn = this._mathsService.turn();
      this.turnLimit = this._mathsService.turnLimit();
      this.echo = this._mathsService.echo();
      this.coinCounter = this._mathsService.coinCounter();
      this.quotaLimit = this._mathsService.quotaLimit();
    });

    effect(() => {
      this.break = this._mathsService.break();
      if (this.break) {
        effect(() => {
          this.break = this._mathsService.break();
          if (this.break) {
            if (this.breakTimeout) {
              clearTimeout(this.breakTimeout);
            }
            this.breakTimeout = setTimeout(() => {
              this.presentBreakToast('middle');
              this._coinsService.updateQuotaForBreak();
              this.startNewTurn();
              this._mathsService.break.set(false);
            }, 1000);
          }
        });
      }
    });

    effect(() => {
      this.score = this._mathsService.currentScore();
    });

    effect(() => {
      if (this._mathsService.gameEnded() && !this.dialogOpen) {
        this.handleGameEnd();
      }
    });
  }

  ngOnInit(): void {
    this.loadLevel(this.level);
    this.isCoinsSet = this._coinsService.isCoinsSet();
  }

  ngOnDestroy(): void {
    if (this.breakTimeout) {
      clearTimeout(this.breakTimeout);
    }
  }

  startNewTurn() {
    // Return any border coins due this turn
    this._coinsService.incrementCoinsArray();
    this._coinsService.clearSelectedCoins();
  }

  newTurn() {
    this.startNewTurn();
  }

  async presentBreakToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Break! You matched a multiple of the core sphere!',
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  async presentToastError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'middle',
      color: 'danger'
    });

    await toast.present();
  }

  handleGameEnd() {
    this.dialogOpen = true;
    const isWin = this._coinsService.quota >= this._mathsService.quotaLimit();

    if (isWin) {
      const isLastLevel = this.level + 1 >= levels.length;
      this._highscoreService
        .loadHighscores()
        .pipe(take(1))
        .subscribe({
          next: (currentHighscores) => {
            const qualifiesForHighscore =
              currentHighscores.length < 10 ||
              this.score >
                currentHighscores[currentHighscores.length - 1].score;

            if (isLastLevel && qualifiesForHighscore) {
              this.openWinDialog(true);
            } else {
              this.openWinDialog(false);
            }
          },
          error: (error) => {
            console.error('Error loading highscores:', error);
            this.presentToastError(
              'Could not load highscores. Please try again.'
            );
            this.openWinDialog(false);
          }
        });
    } else {
      this.openLossDialog();
    }
  }

  get quota(): number {
    return this._coinsService.quota;
  }

  openWinDialog(isHighscore: boolean) {
    const dialogRef = this.dialog.open(WinDialogComponent, {
      data: { score: this.score, level: this.level, isHighscore: isHighscore }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        this.dialogOpen = false; // Reset flag when dialog is closed
        this._mathsService.gameEnded.set(false); // Reset gameEnded state after dialog is closed
        if (result === true) {
          this.replay();
        } else if (result === false) {
          this.nextLevel();
        }
      },
      error: (error) => {
        console.error('Error closing win dialog:', error);
        this.dialogOpen = false; // Ensure flag is reset even on error
        this.presentToastError('An error occurred. Please try again.');
      }
    });
  }

  openLossDialog() {
    const dialogRef = this.dialog.open(LossDialogComponent, {
      data: { score: this.score, level: this.level }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        this.dialogOpen = false; // Reset flag when dialog is closed
        this._mathsService.gameEnded.set(false); // Reset gameEnded state after dialog is closed
        if (result === true) {
          this.replay();
        } else if (result === false) {
          // Optionally handle next level for loss, maybe disable it
          this.nextLevel();
        }
      },
      error: (error) => {
        console.error('Error closing loss dialog:', error);
        this.dialogOpen = false; // Ensure flag is reset even on error
        this.presentToastError('An error occurred. Please try again.');
      }
    });
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
    this._mathsService.setTurnLimit(levels[level].turns);
    this._mathsService.setQuotaLimit(levels[level].quota);
    this._mathsService.turn.set(1);
    this._coinsService.setQuota(0);
    this._coinsService.reset();
    this._mathsService.gameEnded.set(false); // Reset gameEnded state on level load
    this.dialogOpen = false; // Reset dialogOpen flag on level load
    this.nextMultiples = this._mathsService.getNextMultiples();
  }
}
