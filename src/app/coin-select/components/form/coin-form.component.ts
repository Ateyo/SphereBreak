import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CoinComponent } from 'src/app/shared/components/coin/coin.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { CoinArray } from 'src/app/shared/interfaces';
import { SharedModule } from 'src/app/shared/shared.module';

import { CoinsService } from '../../../shared/services/coins.service';

@Component({
  selector: 'app-form',
  imports: [SharedModule, CoinComponent, ReactiveFormsModule],
  templateUrl: './coin-form.component.html',
  styleUrls: ['./coin-form.component.scss']
})
export class CoinFormComponent {
  readonly dialog = inject(MatDialog);
  coinNumber = new FormControl();

  constructor(
    private router: Router,
    private _coinsService: CoinsService
  ) {}

  get entryCoinsArray(): CoinArray[] {
    return this._coinsService.entryCoinsArray$();
  }

  onSubmit() {
    if (this.entryCoinsArray.length < 4) {
      this._coinsService.entryCoinsArray = [
        ...this.entryCoinsArray,
        this.coinNumber.value
      ];
    } else {
      this.openDialog();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      position: {
        top: '20px'
      },
      data: {
        title: 'Ready to Start?',
        content:
          'You have selected 4 entry coins. Would you like to start the game?',
        confirmText: 'Start Game',
        cancelText: 'Keep Editing'
        // selectedCoins: this.entryCoinsArray // Pass the selected coins
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/home']);
      }
    });
  }
}
