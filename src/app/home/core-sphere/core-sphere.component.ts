import { Component, effect } from '@angular/core';
import { MathsService } from 'src/app/shared/services/maths.service';

@Component({
  selector: 'app-core-sphere',
  templateUrl: './core-sphere.component.html',
  styleUrls: ['./core-sphere.component.scss']
})
export class CoreSphereComponent {
  value: number = 1;
  constructor(private _mathsService: MathsService) {
    effect(() => {
      console.log('EFFFECTTTTTT CORE SPHERE');
      let turn = this._mathsService.turn();
      this.value = this._mathsService.coreSphere;
    });
  }
}
