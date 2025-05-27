import { Component, OnInit } from '@angular/core';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CoinFormComponent } from '../components/form/coin-form.component';

@Component({
  selector: 'page-form',
  templateUrl: './coin-select-page.html',
  styleUrls: ['./coin-select-page.scss'],
  imports: [
    CoinFormComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class CoinSelectPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
