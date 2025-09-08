import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HighscoreComponent } from './highscore.component';

const routes: Routes = [
  {
    path: '',
    component: HighscoreComponent,
    data: { title: 'Highscores' }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HighscoreComponent]
})
export class HighscoreModule {}
