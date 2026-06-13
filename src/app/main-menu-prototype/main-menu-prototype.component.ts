import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

type Design = 'neon-v1' | 'obsidian' | 'gold';

@Component({
  selector: 'app-main-menu-prototype',
  standalone: true,
  imports: [NgClass, RouterLink, MatButtonModule],
  template: `
    <div class="proto-bar">
      @for (d of designs; track d) {
        <button
          mat-raised-button
          [color]="current() === d ? 'primary' : null"
          (click)="current.set(d)"
        >
          {{ d }}
        </button>
      }
      <a routerLink="/" mat-button>Back</a>
    </div>

    <div [ngClass]="'layout-' + current()">
      <div class="scanlines"></div>

      @if (current() === 'obsidian') {
        <div class="exploded-grid">
          @for (c of explodedCoins; track c.id) {
            <span
              class="coin"
              [ngClass]="c.type"
              [style.top.%]="c.y"
              [style.left.%]="c.x"
              [style.animation-delay.s]="c.delay"
              [style.animation-duration.s]="c.duration"
              [style.font-size.rem]="c.size"
              [style.width.rem]="c.size"
              [style.height.rem]="c.size"
            >{{ c.v }}</span>
          }
          <div class="orbit-ring"></div>
          <div class="core-sphere">&#9679;</div>
        </div>
      }

      @if (current() === 'gold') {
        <div class="coins-layer">
          @for (c of goldCoins; track c.id) {
            <span
              class="coin gold-coin"
              [style.top.%]="c.y"
              [style.left.%]="c.x"
              [style.animation-delay.s]="c.delay"
            >{{ c.v }}</span>
          }
        </div>
      }

      <div class="menu-content">
        <h1 class="game-title">SphereBreak</h1>
        @if (current() !== 'gold') {
          <p class="subtitle">Break the sphere</p>
        }

        <nav class="menu-items">
          <a routerLink="/coin-select" class="menu-item">Start Game</a>
          <a routerLink="/highscores" class="menu-item">Highscores</a>
        </nav>
      </div>
    </div>
  `,
  styles: [
    `
      .proto-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem;
        background: #111;
        border-bottom: 1px solid #333;
      }
      .proto-bar button {
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      .layout-neon-v1,
      .layout-obsidian,
      .layout-gold {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #0d0d0d;
        font-family: 'Audiowide', cursive;
        position: relative;
        overflow: hidden;
      }

      .scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 255, 255, 0.03) 2px,
          rgba(0, 255, 255, 0.03) 4px
        );
        pointer-events: none;
        z-index: 1;
      }

      .game-title {
        font-size: 5rem;
        color: #fff;
        text-shadow:
          0 0 10px #00ffff,
          0 0 20px #00ffff,
          0 0 40px #00ffff,
          0 0 80px #00ffff;
        margin-bottom: 0.25rem;
        animation: neon-pulse 1.5s ease-in-out infinite alternate;
        position: relative;
        z-index: 3;
      }

      .subtitle {
        font-family: 'Press Start 2P', cursive;
        font-size: 0.7rem;
        color: rgba(0, 255, 255, 0.5);
        margin-bottom: 3rem;
        letter-spacing: 0.5rem;
        position: relative;
        text-align:center;
        z-index: 3;
      }

      .menu-content {
        padding: 0 2rem;
        position: relative;
        z-index: 3;
      }

      .menu-items {
        position: relative;
        z-index: 3;
      }

      .menu-item {
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        margin: 1.25rem 0;
        display: block;
        text-align: center;
        padding: 0.75rem 3rem;
        border: 1px solid rgba(0, 255, 255, 0.3);
        transition: all 0.3s;
        text-transform: uppercase;
        letter-spacing: 0.25rem;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      .menu-item:hover {
        background: rgba(0, 255, 255, 0.1);
        border-color: #00ffff;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        color: #fff;
      }

      /* === EXPLODED GRID (obsidian) === */
      .exploded-grid {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
      }

      .exploded-grid .coin {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-family: kiwi_font, 'Audiowide', cursive;
        font-weight: bold;
        animation: coin-drift linear infinite;
        opacity: 0;
      }

      .exploded-grid .obsidian {
        background: radial-gradient(circle at 40% 35%, #2a2a3a, #080810);
        color: rgba(200, 220, 255, 0.95);
        box-shadow: 0 0 8px rgba(100, 180, 255, 0.2), inset 0 0 6px rgba(100, 180, 255, 0.05);
        text-shadow: 0 0 8px rgba(100, 180, 255, 0.6);
      }

      .exploded-grid .gold {
        background: radial-gradient(circle at 40% 35%, #e6c800, #997a00);
        color: rgba(255, 240, 180, 0.95);
        box-shadow: 0 0 10px rgba(230, 200, 0, 0.3);
        text-shadow: 0 0 6px rgba(230, 200, 0, 0.6);
      }

      .orbit-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 28rem;
        height: 18rem;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 1px solid rgba(0, 255, 255, 0.08);
        animation: ring-rotate 20s linear infinite;
        z-index: 0;
      }

      .core-sphere {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3.5rem;
        height: 3.5rem;
        margin-top: -1.75rem;
        margin-left: -1.75rem;
        border-radius: 50%;
        background: #00bfff;
        box-shadow: 0 0 20px #00bfff, 0 0 40px rgba(0, 191, 255, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: rgba(152, 251, 152, 0.9);
        transform: rotate(5deg);
        animation: sphere-orbit 20s linear infinite, sphere-pulse 2s ease-in-out infinite alternate;
        z-index: 2;
        font-family: kiwi_font, 'Audiowide', cursive;
      }

      .exploded-grid .menu-content {
        padding: 0 2rem;
      }

      @keyframes neon-pulse {
        from { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff; }
        to { text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff, 0 0 120px #00ffff; }
      }

      @keyframes coin-drift {
        0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
        10%  { opacity: 0.7; }
        85%  { opacity: 0.7; }
        100% { opacity: 0; transform: translateY(-80px) rotate(360deg); }
      }

      @keyframes ring-rotate {
        0%   { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes sphere-orbit {
        0%   { transform: rotate(5deg) translate(14rem, 0) rotate(0deg); }
        25%  { transform: rotate(5deg) translate(0, 9rem) rotate(-90deg); }
        50%  { transform: rotate(5deg) translate(-14rem, 0) rotate(-180deg); }
        75%  { transform: rotate(5deg) translate(0, -9rem) rotate(-270deg); }
        100% { transform: rotate(5deg) translate(14rem, 0) rotate(-360deg); }
      }

      @keyframes sphere-pulse {
        from { box-shadow: 0 0 20px #00bfff, 0 0 40px rgba(0, 191, 255, 0.3); }
        to { box-shadow: 0 0 30px #00bfff, 0 0 60px rgba(0, 191, 255, 0.6), 0 0 80px rgba(0, 191, 255, 0.3); }
      }

      /* === GOLD coins layer (simple variant) === */
      .coins-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
      }

      .gold-coin {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-family: kiwi_font, 'Audiowide', cursive;
        font-weight: bold;
        animation: coin-float linear infinite;
        opacity: 0;
        width: 2.5rem;
        height: 2.5rem;
        font-size: 0.85rem;
        background: radial-gradient(circle at 40% 35%, #e6c800, #997a00);
        color: rgba(255, 240, 180, 0.95);
        box-shadow: 0 0 10px rgba(230, 200, 0, 0.3);
        text-shadow: 0 0 6px rgba(230, 200, 0, 0.6);
        animation-duration: 20s;
      }

      @keyframes coin-float {
        0%   { opacity: 0; transform: translateY(20px) rotate(0deg); }
        10%  { opacity: 0.7; }
        90%  { opacity: 0.7; }
        100% { opacity: 0; transform: translateY(-120px) rotate(360deg); }
      }
    `
  ]
})
export class MainMenuPrototypeComponent {
  protected designs: Design[] = ['neon-v1', 'obsidian', 'gold'];
  protected current = signal<Design>('obsidian');

  private pos = [
    { x: 5, y: 10 }, { x: 88, y: 15 }, { x: 20, y: 35 },
    { x: 75, y: 40 }, { x: 10, y: 60 }, { x: 85, y: 65 },
    { x: 50, y: 20 }, { x: 35, y: 70 }, { x: 65, y: 75 },
    { x: 45, y: 85 }, { x: 15, y: 80 }, { x: 80, y: 50 }
  ];

  private values = [3, 7, 5, 9, 2, 8, 4, 6, 1, 3, 8, 9];

  protected goldCoins = this.pos.map((p, i) => ({
    id: i,
    x: p.x,
    y: p.y,
    v: this.values[i],
    delay: i * 1.5
  }));

  protected explodedCoins = [
    // top border row (obsidian)
    { id: 1,  x: 4,  y: 6,  v: 3,  type: 'obsidian', delay: 0,   duration: 18, size: 2.2 },
    { id: 2,  x: 22, y: 4,  v: 7,  type: 'obsidian', delay: 1.5, duration: 20, size: 2.5 },
    { id: 3,  x: 72, y: 5,  v: 5,  type: 'obsidian', delay: 3,   duration: 17, size: 2.2 },
    { id: 4,  x: 92, y: 7,  v: 9,  type: 'gold',     delay: 0.5, duration: 19, size: 2.5 },

    // right border column (obsidian)
    { id: 5,  x: 93, y: 28, v: 2,  type: 'obsidian', delay: 2,   duration: 22, size: 2.0 },
    { id: 6,  x: 91, y: 68, v: 8,  type: 'gold',     delay: 4,   duration: 16, size: 2.8 },

    // bottom border row (obsidian)
    { id: 7,  x: 3,  y: 90, v: 4,  type: 'obsidian', delay: 5,   duration: 19, size: 2.5 },
    { id: 8,  x: 28, y: 92, v: 6,  type: 'obsidian', delay: 0.8, duration: 21, size: 2.2 },
    { id: 9,  x: 68, y: 91, v: 1,  type: 'obsidian', delay: 3.5, duration: 18, size: 2.5 },
    { id: 10, x: 95, y: 89, v: 3,  type: 'gold',     delay: 6,   duration: 20, size: 2.2 },

    // left border column (obsidian)
    { id: 11, x: 4,  y: 30, v: 8,  type: 'obsidian', delay: 2.5, duration: 23, size: 2.0 },
    { id: 12, x: 6,  y: 65, v: 9,  type: 'gold',     delay: 1.2, duration: 17, size: 2.8 },

    // entry coins (gold, clustered near center but exploded outward)
    { id: 13, x: 33, y: 36, v: 3,  type: 'gold',     delay: 0.3, duration: 24, size: 3.2 },
    { id: 14, x: 60, y: 34, v: 5,  type: 'gold',     delay: 1.8, duration: 22, size: 3.2 },
    { id: 15, x: 35, y: 56, v: 8,  type: 'gold',     delay: 2.2, duration: 21, size: 3.2 },
    { id: 16, x: 58, y: 58, v: 9,  type: 'gold',     delay: 3.8, duration: 23, size: 3.2 },

    // extra border coins scattered (obsidian)
    { id: 17, x: 48, y: 12, v: 2,  type: 'obsidian', delay: 4.5, duration: 20, size: 1.8 },
    { id: 18, x: 12, y: 50, v: 6,  type: 'obsidian', delay: 5.5, duration: 19, size: 1.8 },
    { id: 19, x: 85, y: 50, v: 7,  type: 'obsidian', delay: 0.7, duration: 22, size: 1.8 },
    { id: 20, x: 46, y: 82, v: 4,  type: 'obsidian', delay: 3.2, duration: 18, size: 1.8 },
  ];
}
