import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GridEngine } from 'src/app/shared/services/grid-engine.service';
import { TurnEngine } from 'src/app/shared/services/turn-engine.service';
import { TurnHistoryService } from 'src/app/shared/services/turn-history.service';

@Component({
  selector: 'app-debug-panel',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div
      class="debug-overlay"
      *ngIf="visible"
      (click)="close()"
      (keydown.escape)="close()"
      tabindex="0">
      <div
        class="debug-panel"
        (click)="$event.stopPropagation()"
        (keydown)="$event.stopPropagation()"
        tabindex="-1">
        <div class="debug-header">
          <h3>Debug: Turn History</h3>
          <button class="debug-close" (click)="close()" tabindex="0">x</button>
        </div>
        <div class="debug-info">
          Turn {{ turnEngine.turn$() }} | Score {{ turnEngine.currentScore$() }}
        </div>
        <div class="debug-entries">
          <div
            *ngFor="let entry of turnHistoryService.history$(); let i = index"
            class="debug-entry">
            <span class="debug-entry-label">
              Turn {{ entry.turn }} snapshot
            </span>
            <button class="debug-return-btn" (click)="revertTo(i)" tabindex="0">
              Return
            </button>
          </div>
        </div>
        <p
          *ngIf="turnHistoryService.history$().length === 0"
          class="debug-empty">
          No snapshots yet.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .debug-overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        justify-content: flex-end;
      }
      .debug-panel {
        width: 320px;
        max-width: 90vw;
        height: 100%;
        background: #1a1a2e;
        color: #e0e0e0;
        padding: 1rem;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.5);
        overflow-y: auto;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
      }
      .debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #333;
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .debug-header h3 {
        margin: 0;
        font-size: 1rem;
        color: #ffd700;
      }
      .debug-close {
        background: none;
        border: 1px solid #555;
        color: #e0e0e0;
        cursor: pointer;
        font-size: 1rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }
      .debug-info {
        font-size: 0.75rem;
        color: #aaa;
        margin-bottom: 0.75rem;
      }
      .debug-entries {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .debug-entry {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #16213e;
        padding: 0.5rem;
        border-radius: 4px;
        border-left: 3px solid #ffd700;
      }
      .debug-entry-label {
        font-size: 0.8rem;
      }
      .debug-return-btn {
        background: #ffd700;
        color: #1a1a2e;
        border: none;
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.75rem;
      }
      .debug-return-btn:hover {
        background: #ffed4a;
      }
      .debug-empty {
        color: #666;
        font-style: italic;
        text-align: center;
        margin-top: 2rem;
      }
    `
  ]
})
export class DebugPanelComponent {
  protected turnEngine = inject(TurnEngine);
  protected gridEngine = inject(GridEngine);
  protected turnHistoryService = inject(TurnHistoryService);

  visible = false;

  close(): void {
    this.visible = false;
  }

  open(): void {
    this.visible = true;
  }

  revertTo(index: number): void {
    this.turnHistoryService.revertTo(index);
    this.close();
  }
}
