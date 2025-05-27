import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'form',
    loadChildren: () => import('./coin-select/coin-select.module').then( m => m.CoinSelectModule)
  },
  {
    path: '',
    redirectTo: 'form',
    pathMatch: 'full'
  },
];
