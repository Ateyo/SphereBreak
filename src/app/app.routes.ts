import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule)
  },
  {
    path: 'coin-select',
    loadChildren: () =>
      import('./coin-select/coin-select.module').then((m) => m.CoinSelectModule)
  },
  {
    path: 'highscores',
    loadChildren: () =>
      import('./highscore/highscore.module').then((m) => m.HighscoreModule)
  },
  {
    path: 'coin-prototype',
    loadComponent: () =>
      import('./coin-prototype/coin-prototype.component').then(
        (m) => m.CoinPrototypeComponent
      )
  },
  {
    path: 'menu-prototype',
    loadComponent: () =>
      import('./main-menu-prototype/main-menu-prototype.component').then(
        (m) => m.MainMenuPrototypeComponent
      )
  },
  {
    path: '',
    loadChildren: () =>
      import('./main-menu/main-menu.module').then((m) => m.MainMenuModule)
  }
];
