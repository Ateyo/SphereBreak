import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CoinVariation {
  id: string;
  name: string;
  description: string;
  theme: 'cool' | 'warm' | 'dark';
}

interface CoinState {
  id: number;
  value: number;
  entryCoin: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-coin-prototype',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './coin-prototype.component.html',
  styleUrls: ['./coin-prototype.component.scss']
})
export class CoinPrototypeComponent {
  variations: CoinVariation[] = [
    {
      id: 'current',
      name: 'Current',
      description: 'Existing flat-color coin (baseline)',
      theme: 'cool'
    },
    {
      id: 'azure',
      name: 'Azure',
      description: 'Dark navy gradient + cyan glow — matches your blue theme',
      theme: 'cool'
    },
    {
      id: 'violet',
      name: 'Violet',
      description: 'Dark purple gradient + magenta glow',
      theme: 'cool'
    },
    {
      id: 'teal',
      name: 'Teal',
      description: 'Dark teal gradient + teal glow',
      theme: 'cool'
    },
    {
      id: 'obsidian',
      name: 'Obsidian',
      description: 'Near-black gradient + bright blue-white glow, high contrast',
      theme: 'dark'
    },
    {
      id: 'ruby',
      name: 'Ruby',
      description: 'Dark crimson gradient + red glow',
      theme: 'warm'
    }
  ];

  activeThemeId = signal('current');

  grid: CoinState[] = [
    // Row 1: 4 border coins
    { id: 0, value: 1, entryCoin: false, selected: false },
    { id: 1, value: 3, entryCoin: false, selected: false },
    { id: 2, value: 6, entryCoin: false, selected: false },
    { id: 3, value: 2, entryCoin: false, selected: false },
    // Row 2: border + entry + entry + border
    { id: 4, value: 4, entryCoin: false, selected: false },
    { id: 5, value: 8, entryCoin: true, selected: false },
    { id: 6, value: 5, entryCoin: true, selected: false },
    { id: 7, value: 7, entryCoin: false, selected: false },
    // Row 3: border + entry + entry + border
    { id: 8, value: 9, entryCoin: false, selected: false },
    { id: 9, value: 2, entryCoin: true, selected: false },
    { id: 10, value: 4, entryCoin: true, selected: false },
    { id: 11, value: 3, entryCoin: false, selected: false },
    // Row 4: 4 border coins
    { id: 12, value: 7, entryCoin: false, selected: false },
    { id: 13, value: 5, entryCoin: false, selected: false },
    { id: 14, value: 8, entryCoin: false, selected: false },
    { id: 15, value: 6, entryCoin: false, selected: false }
  ];

  setTheme(id: string) {
    this.activeThemeId.set(id);
  }

  toggleCoin(coinId: number) {
    const coin = this.grid.find(c => c.id === coinId);
    if (coin) {
      coin.selected = !coin.selected;
    }
  }

  coinClasses(coin: CoinState): Record<string, boolean> {
    return {
      'entry-coin': coin.entryCoin,
      'border-coin': !coin.entryCoin,
      'selected-coin': coin.selected,
      ['theme-' + this.activeThemeId()]: true
    };
  }

  get activeVariation(): CoinVariation | undefined {
    return this.variations.find(v => v.id === this.activeThemeId());
  }

  themeBtnClasses(v: CoinVariation): Record<string, boolean> {
    return {
      active: this.activeThemeId() === v.id,
      [v.theme]: true
    };
  }
}
