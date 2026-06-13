import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CoinComponent } from 'src/app/shared/components/coin/coin.component';
import { GridEngine } from 'src/app/shared/services/grid-engine.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { CoreSphereComponent } from '../core-sphere/core-sphere.component';

@Component({
  selector: 'app-grid',
  imports: [SharedModule, CoreSphereComponent, CoinComponent],
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  private gridEngine = inject(GridEngine);

  entryCoinsArray$ = this.gridEngine.entryCoinsArray;
  coinsArray$ = this.gridEngine.coinsArray;
}
