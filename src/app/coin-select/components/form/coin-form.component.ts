import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; // <-- Add Validators import
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CoinComponent } from 'src/app/shared/components/coin/coin.component';
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
    MatInputModule,
    MatButtonModule,
    MatIconModule
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
    1,
    [Validators.required, Validators.min(1), Validators.max(9)] // <-- Add validators for required, min, max
  );

  get entryCoinsArray(): CoinArray[] {
    return this._coinsService.entryCoinsArray$();
  }

  onSubmit() {
    if (this.entryCoinsArray.length < 4) {
      if (this.coinNumber.value !== null) {
        this._coinsService.addEntryCoin(this.coinNumber.value);
      }
    } 
  }

  removeCoin(coin: CoinArray) {
    this._coinsService.removeEntryCoin(coin);
  }

  startGame() {
    this.router.navigate(['/home']);
  }
}
