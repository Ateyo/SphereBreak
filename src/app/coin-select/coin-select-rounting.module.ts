import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinSelectPageComponent } from './container/coin-select-page';

const routes: Routes = [
  {
    path: '',
    component: CoinSelectPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoinSelectRoutingModule {}
