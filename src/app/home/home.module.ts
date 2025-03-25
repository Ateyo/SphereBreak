import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { GridComponent } from './grid/grid.component';
import { CoinComponent } from './coin/coin.component';
import { CoreSphereComponent } from './core-sphere/core-sphere.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  exports: [
    CoinComponent
  ],
  declarations: [HomePage, GridComponent, CoinComponent, CoreSphereComponent],
})
export class HomePageModule {}
