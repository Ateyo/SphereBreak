import { Component } from '@angular/core';

import { CoinFormComponent } from '../components/form/coin-form.component';

@Component({
  selector: 'app-page-form',
  templateUrl: './coin-select-page.html',
  styleUrls: ['./coin-select-page.scss'],
  standalone: true,
  imports: [CoinFormComponent]
})
export class CoinSelectPageComponent {
  constructor() {}
}
