import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CoinComponent } from 'src/app/shared/components/coin/coin.component';
import { CoinArray } from 'src/app/shared/interfaces';
import { SharedModule } from 'src/app/shared/shared.module';

import { GridEngine } from '../../../shared/services/grid-engine.service';

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
    MatIconModule,
    RouterLink
  ],
  templateUrl: './coin-form.component.html',
  styleUrls: ['./coin-form.component.scss']
})
export class CoinFormComponent {
  private router = inject(Router);
  private _gridEngine = inject(GridEngine);

  coinNumber = new FormControl(1, [
    Validators.required,
    Validators.min(1),
    Validators.max(9)
  ]);

  coinError = '';

  get entryCoinsArray(): CoinArray[] {
    return this._gridEngine.entryCoinsArray$();
  }

  onSubmit() {
    if (this.entryCoinsArray.length >= 4) return;

    if (this.coinNumber.invalid) {
      this.coinError = 'Enter a value between 1 and 9';
      return;
    }
    this.coinError = '';

    const value = this.coinNumber.value;
    if (value === null || value === undefined) return;

    this._gridEngine.addEntryCoin(value);
    this.coinNumber.setValue(1, { emitEvent: false });
    this.coinNumber.markAsUntouched();
  }

  removeCoin(coin: CoinArray) {
    this._gridEngine.removeEntryCoin(coin.id);
  }

  startGame() {
    if (this.entryCoinsArray.length < 4) return;
    this.router.navigate(['/home']);
  }
}
