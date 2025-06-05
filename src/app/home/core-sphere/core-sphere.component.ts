import { Component, OnInit } from '@angular/core';
import { MathsService } from 'src/app/shared/services/maths.service';

@Component({
  selector: 'app-core-sphere',
  templateUrl: './core-sphere.component.html',
  styleUrls: ['./core-sphere.component.scss'],
})
export class CoreSphereComponent implements OnInit {
  value: number = 1;
  constructor(private _mathsService: MathsService) {}

  ngOnInit() {
    // Also update on turn change (in case coreSphere changes at new turn)
    this._mathsService.turn$.subscribe(() => {
      this.value = this._mathsService.coreSphere;
    });
  }
}
