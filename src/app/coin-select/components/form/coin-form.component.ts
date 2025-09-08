import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; // <-- Add Validators import
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CoinComponent } from 'src/app/shared/components/coin/coin.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { CoinArray } from 'src/app/shared/interfaces';
import { PlayerService } from 'src/app/shared/services/player.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { CoinsService } from '../../../shared/services/coins.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    SharedModule,
    CoinComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './coin-form.component.html',
  styleUrls: ['./coin-form.component.scss']
})
export class CoinFormComponent {
  private router = inject(Router);
  private _coinsService = inject(CoinsService);
  private _playerService = inject(PlayerService);

  readonly dialog = inject(MatDialog);
  coinNumber = new FormControl(
    null,
    [Validators.required, Validators.min(1), Validators.max(9)] // <-- Add validators for required, min, max
  );
  playerInitials: string = this._playerService.getInitials();

  get entryCoinsArray(): CoinArray[] {
    return this._coinsService.entryCoinsArray$();
  }

  onInitialsChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.playerInitials = inputElement.value;
    this._playerService.setInitials(this.playerInitials);
  }

  onSubmit() {
    if (this.entryCoinsArray.length < 4) {
      if (this.coinNumber.value !== null) {
        this._coinsService.entryCoinsArray = [
          ...this.entryCoinsArray,
          this.coinNumber.value
        ];
      }
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

  updateCoinValue(event: Event, coin: CoinArray) {
    const newCoinValue = (event.target as HTMLInputElement).value;
    this._coinsService.updateCoin(coin, newCoinValue);
  }
}
