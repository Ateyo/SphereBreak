import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IonicModule, IonToast, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import levels from '../../assets/levels.json';
import { DebugPanelComponent } from '../shared/debug-panel/debug-panel.component';
import { GridEngine } from '../shared/services/grid-engine.service';
import { HighscoreService } from '../shared/services/highscore.service';
import { PlayerService } from '../shared/services/player.service';
import { TurnEngine } from '../shared/services/turn-engine.service';
import { TurnHistoryService } from '../shared/services/turn-history.service';
import { getRandomIntInclusive } from '../shared/utils/random';
import { GridComponent } from './grid/grid.component';
import { LossDialogComponent } from './loss-dialog/loss-dialog.component';
import { WinDialogComponent } from './win-dialog/win-dialog.component';

@Component({
  selector: 'app-home-page',
  imports: [DebugPanelComponent, GridComponent, IonicModule],
  templateUrl: 'home.page.component.html',
  styleUrls: ['home.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit, OnDestroy {
  private _turnEngine = inject(TurnEngine);
  private _gridEngine = inject(GridEngine);
  private toastController = inject<ToastController>(ToastController);
  private dialog = inject<MatDialog>(MatDialog);
  private _highscoreService = inject<HighscoreService>(HighscoreService);
  private _playerService = inject<PlayerService>(PlayerService);
  private _turnHistoryService = inject(TurnHistoryService);
  private router = inject(Router);

  protected debugMode = environment.debug;

  levelQuota$ = this._gridEngine.levelQuota$;
  isCoinsSet$ = this._gridEngine.isCoinsSet$;
  total$ = this._turnEngine.currentTotal$;
  nextMultiples$ = this._turnEngine.nextMultiples$;
  break$ = this._turnEngine.break$;
  score$ = this._turnEngine.currentScore$;
  turn$ = this._turnEngine.turn$;
  turnLimit$ = this._turnEngine.turnLimit$;
  quotaLimit$ = this._turnEngine.quotaLimit$;
  echo$ = this._turnEngine.echo$;
  coinCounter$ = this._turnEngine.coinCounter$;
  coreSphere$ = this._turnEngine.coreSphere$;
  level = 0;
  private dialogOpen = signal(false);

  private breakTimeout?: ReturnType<typeof setTimeout>;
  @ViewChild(IonToast) toast: IonToast | undefined;
  @ViewChild(DebugPanelComponent) debugPanel: DebugPanelComponent | undefined;
  private _lastSelectionLength = 0;

  constructor() {
    effect(() => {
      if (this.break$()) {
        console.log(
          `[HomePage] Break detected! total=${this.total$()} coreSphere=${this._turnEngine.coreSphere} score=${this.score$()} turn=${this.turn$()}`
        );
        if (this.breakTimeout) {
          clearTimeout(this.breakTimeout);
        }
        this.breakTimeout = setTimeout(() => {
          console.log('[HomePage] Confirming break...');
          this.presentBreakToast('middle');
          this._gridEngine.confirmBreak();
          this._gridEngine.startNewTurn();
          this._turnEngine.advanceTurn();
        }, 1000);
      }
    });

    effect(() => {
      if (this._turnEngine.gameEnded$() && !this.dialogOpen()) {
        this.handleGameEnd();
      }
    });

    effect(() => {
      if (!this.debugMode) return;
      const len = this._gridEngine.selectedCoins$().length;
      if (len > this._lastSelectionLength) {
        this._turnHistoryService.snapshot();
      }
      this._lastSelectionLength = len;
    });
  }

  ngOnInit(): void {
    if (this._gridEngine.entryCoinsArray$().length === 0) {
      this.router.navigate(['/']);
      return;
    }
    this.loadLevel(this.level);
  }

  ngOnDestroy(): void {
    if (this.breakTimeout) {
      clearTimeout(this.breakTimeout);
    }
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

  async handleGameEnd() {
    this.dialogOpen.set(true);
    const isWin = this.levelQuota$() >= this.quotaLimit$();

    if (isWin) {
      const isLastLevel = this.level + 1 >= levels.length;
      try {
        const currentHighscores = await firstValueFrom(
          this._highscoreService.loadHighscores()
        );
        const qualifiesForHighscore =
          currentHighscores.length < 10 ||
          this.score$() > currentHighscores[currentHighscores.length - 1].score;

        this.openWinDialog(isLastLevel && qualifiesForHighscore);
      } catch (error) {
        console.error('Error loading highscores:', error);
        this.presentToastError('Could not load highscores. Please try again.');
        this.openWinDialog(false);
      }
    } else {
      this.openLossDialog();
    }
  }

  openWinDialog(isHighscore: boolean) {
    const dialogRef = this.dialog.open(WinDialogComponent, {
      data: {
        score: this.score$(),
        level: this.level,
        isHighscore: isHighscore
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        this.dialogOpen.set(false);
        this._turnEngine.resetGame();
        if (result === true) {
          this.replay();
        } else if (result === false) {
          this.nextLevel();
        } else if (result === 'quit') {
          this.quit();
        }
      },
      error: (error) => {
        console.error('Error closing win dialog:', error);
        this.dialogOpen.set(false);
        this._turnEngine.resetGame();
        this.presentToastError('An error occurred. Please try again.');
      }
    });
  }

  openLossDialog() {
    const dialogRef = this.dialog.open(LossDialogComponent, {
      data: { score: this.score$(), level: this.level }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        this.dialogOpen.set(false);
        this._turnEngine.resetGame();
        if (result === true) {
          this.replay();
        } else if (result === false) {
          this.nextLevel();
        }
      },
      error: (error) => {
        console.error('Error closing loss dialog:', error);
        this.dialogOpen.set(false);
        this.presentToastError('An error occurred. Please try again.');
      }
    });
  }

  replay() {
    this.loadLevel(this.level);
  }

  nextLevel() {
    if (this.level + 1 < levels.length) {
      this.level++;
      this.loadLevel(this.level);
    } else {
      console.log('All levels completed!');
    }
  }

  quit() {
    this.router.navigate(['/']);
  }

  private _setupGrid(): void {
    const entryCoins = this._gridEngine.entryCoinsArray$().map((c) => ({
      value: c.coin.value,
      entryCoin: true
    }));
    const borderCoins = Array.from({ length: 12 }, () => ({
      value: getRandomIntInclusive(1, 9),
      entryCoin: false
    }));
    this._gridEngine.makeGrid(entryCoins, borderCoins);
  }

  loadLevel(level: number) {
    if (level < 0 || level >= levels.length) {
      console.error(`Invalid level: ${level}`);
      return;
    }
    this._turnEngine.loadLevel(levels[level].turns, levels[level].quota);
    this._gridEngine.reset();
    this._setupGrid();
    this._turnHistoryService.clear();
    this._lastSelectionLength = 0;
    this.dialogOpen.set(false);
  }
}
