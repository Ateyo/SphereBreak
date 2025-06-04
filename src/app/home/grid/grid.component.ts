import { Component, OnInit, effect } from '@angular/core';
import { CoinArray } from 'src/app/shared/interfaces';
import { CoinsService } from 'src/app/shared/services/coins.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreSphereComponent } from '../core-sphere/core-sphere.component';

@Component({
  selector: 'app-grid',
  imports: [SharedModule, CoreSphereComponent],
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  entryCoinsArray: CoinArray[];
  coinsArray: CoinArray[];

  constructor(private coinsService: CoinsService) {
    this.coinsArray = this.coinsService.coinsArray;
    this.entryCoinsArray = this.coinsService.entryCoinsArray$();
    effect(() => {
      this.entryCoinsArray = this.coinsService.entryCoinsArray$();
    });
  }

  ngOnInit() {}
}
