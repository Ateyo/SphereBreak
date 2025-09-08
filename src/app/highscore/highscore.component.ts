import { Component, inject, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    this.highscoreService.loadHighscores().subscribe((scores) => {
      this.highscores = scores;
    });
  }
}
