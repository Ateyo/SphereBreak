import { Component, effect, inject } from '@angular/core';
import { MathsService } from 'src/app/shared/services/maths.service';

@Component({
  selector: 'app-core-sphere',
  templateUrl: './core-sphere.component.html',
  styleUrls: ['./core-sphere.component.scss']
})
export class CoreSphereComponent {
  private _mathsService = inject(MathsService);

  value: number = 1;
  constructor() {
    effect(() => {
      console.log('EFFFECTTTTTT CORE SPHERE');
      this._mathsService.turn();
      this.value = this._mathsService.coreSphere;
    });
  }
}
