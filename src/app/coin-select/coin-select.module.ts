import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CoinSelectRoutingModule } from './coin-select-rounting.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoinSelectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [],
})
export class CoinSelectModule {}
