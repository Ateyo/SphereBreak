import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Ionic components
import { IonicModule } from '@ionic/angular';

// CoinComponent (adjust path if needed)
import { CoinComponent } from './components/coin/coin.component';

@NgModule({
  declarations: [],
  imports: [CoinComponent, CommonModule, ReactiveFormsModule, IonicModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    CoinComponent,
    IonicModule,
    CoinComponent,
  ],
})
export class SharedModule {}
