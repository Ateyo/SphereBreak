import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Highscore } from '../shared/interfaces/highscore.interface';
import { HighscoreService } from '../shared/services/highscore.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-highscore',
  imports: [SharedModule],
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit {
  highscores: Highscore[] = [];
  private highscoreService = inject(HighscoreService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.highscoreService
      .loadHighscores()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((scores) => {
        this.highscores = scores;
      });
  }
}
