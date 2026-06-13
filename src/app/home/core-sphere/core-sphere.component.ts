import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TurnEngine } from 'src/app/shared/services/turn-engine.service';

@Component({
  selector: 'app-core-sphere',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './core-sphere.component.html',
  styleUrls: ['./core-sphere.component.scss']
})
export class CoreSphereComponent {
  private _turnEngine = inject(TurnEngine);
  coreSphere$ = this._turnEngine.coreSphere$;
}
