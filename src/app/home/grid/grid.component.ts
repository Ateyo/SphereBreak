import { Component, OnInit } from '@angular/core';
import { CoinComponent } from '../coin/coin.component';
import { CoinsService } from 'src/app/shared/services/coins-service.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent  implements OnInit {
  entryCoinsArray: number[];
  coinsArray: number[];

  constructor(private coinsService: CoinsService) {
    this.entryCoinsArray = this.coinsService.entryCoinsArray;
    this.coinsArray = this.coinsService.coinsArray;
   }

  ngOnInit() {}
}
