import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

interface CoinData {
  id: number;
  x: number;
  y: number;
  v: number;
  type: 'obsidian' | 'gold';
  delay: number;
  duration: number;
  size: number;
}

@Component({
  selector: 'app-main-menu',
  imports: [SharedModule, NgClass],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  protected explodedCoins: CoinData[] = [
    { id: 1,  x: 4,  y: 6,  v: 3,  type: 'obsidian', delay: 0,   duration: 18, size: 2.2 },
    { id: 2,  x: 22, y: 4,  v: 7,  type: 'obsidian', delay: 1.5, duration: 20, size: 2.5 },
    { id: 3,  x: 72, y: 5,  v: 5,  type: 'obsidian', delay: 3,   duration: 17, size: 2.2 },
    { id: 4,  x: 92, y: 7,  v: 9,  type: 'gold',     delay: 0.5, duration: 19, size: 2.5 },
    { id: 5,  x: 93, y: 28, v: 2,  type: 'obsidian', delay: 2,   duration: 22, size: 2.0 },
    { id: 6,  x: 91, y: 68, v: 8,  type: 'gold',     delay: 4,   duration: 16, size: 2.8 },
    { id: 7,  x: 3,  y: 90, v: 4,  type: 'obsidian', delay: 5,   duration: 19, size: 2.5 },
    { id: 8,  x: 28, y: 92, v: 6,  type: 'obsidian', delay: 0.8, duration: 21, size: 2.2 },
    { id: 9,  x: 68, y: 91, v: 1,  type: 'obsidian', delay: 3.5, duration: 18, size: 2.5 },
    { id: 10, x: 95, y: 89, v: 3,  type: 'gold',     delay: 6,   duration: 20, size: 2.2 },
    { id: 11, x: 4,  y: 30, v: 8,  type: 'obsidian', delay: 2.5, duration: 23, size: 2.0 },
    { id: 12, x: 6,  y: 65, v: 9,  type: 'gold',     delay: 1.2, duration: 17, size: 2.8 },
    { id: 13, x: 33, y: 36, v: 3,  type: 'gold',     delay: 0.3, duration: 24, size: 3.2 },
    { id: 14, x: 60, y: 34, v: 5,  type: 'gold',     delay: 1.8, duration: 22, size: 3.2 },
    { id: 15, x: 35, y: 56, v: 8,  type: 'gold',     delay: 2.2, duration: 21, size: 3.2 },
    { id: 16, x: 58, y: 58, v: 9,  type: 'gold',     delay: 3.8, duration: 23, size: 3.2 },
    { id: 17, x: 48, y: 12, v: 2,  type: 'obsidian', delay: 4.5, duration: 20, size: 1.8 },
    { id: 18, x: 12, y: 50, v: 6,  type: 'obsidian', delay: 5.5, duration: 19, size: 1.8 },
    { id: 19, x: 85, y: 50, v: 7,  type: 'obsidian', delay: 0.7, duration: 22, size: 1.8 },
    { id: 20, x: 46, y: 82, v: 4,  type: 'obsidian', delay: 3.2, duration: 18, size: 1.8 },
  ];
}
