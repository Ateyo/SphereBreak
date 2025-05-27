import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CoinComponent } from '../shared/components/coin/coin.component';
import { SharedModule } from '../shared/shared.module';
import { CoreSphereComponent } from './core-sphere/core-sphere.component';
import { GridComponent } from './grid/grid.component';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CoinComponent,
    HomePage,
    GridComponent,
    CoreSphereComponent,
    SharedModule,
  ],
  exports: [
    CoinComponent,
    HomePage,
    GridComponent,
    CoreSphereComponent,
    SharedModule,
  ],
})
export class HomePageModule {}
