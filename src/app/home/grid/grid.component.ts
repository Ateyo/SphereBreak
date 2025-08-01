import { Component, effect, inject } from '@angular/core';
import { CoinComponent } from 'src/app/shared/components/coin/coin.component'; // <-- Import CoinComponent
import { CoinArray } from 'src/app/shared/interfaces';
import { CoinsService } from 'src/app/shared/services/coins.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { CoreSphereComponent } from '../core-sphere/core-sphere.component';

@Component({
  selector: 'app-grid',
  imports: [SharedModule, CoreSphereComponent, CoinComponent],
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  private coinsService = inject(CoinsService);

  entryCoinsArray: CoinArray[];
  coinsArray: CoinArray[];

  constructor() {
    this.coinsArray = this.coinsService.coinsArray;
    this.entryCoinsArray = this.coinsService.entryCoinsArray$();
    effect(() => {
      this.entryCoinsArray = [...this.coinsService.entryCoinsArray$()];
    });
  }
}
