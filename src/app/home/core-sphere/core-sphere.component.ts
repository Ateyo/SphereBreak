import { Component, effect, inject } from '@angular/core';
import { TurnEngine } from 'src/app/shared/services/turn-engine.service';

@Component({
  selector: 'app-core-sphere',
  templateUrl: './core-sphere.component.html',
  styleUrls: ['./core-sphere.component.scss']
})
export class CoreSphereComponent {
  private _turnEngine = inject(TurnEngine);

  value: number = 1;
  constructor() {
    effect(() => {
      this._turnEngine.turn();
      this.value = this._turnEngine.coreSphere;
    });
  }
}
