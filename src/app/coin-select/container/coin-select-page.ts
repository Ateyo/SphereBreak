import { Component, OnInit } from '@angular/core';
import { CoinFormComponent } from '../components/form/coin-form.component';

@Component({
  selector: 'page-form',
  templateUrl: './coin-select-page.html',
  styleUrls: ['./coin-select-page.scss'],
  imports: [CoinFormComponent]
})
export class CoinSelectPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
