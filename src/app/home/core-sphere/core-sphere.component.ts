import { Component, OnInit } from '@angular/core';
import { MathsService } from 'src/app/shared/services/maths.service';

@Component({
  selector: 'app-core-sphere',
  templateUrl: './core-sphere.component.html',
  styleUrls: ['./core-sphere.component.scss'],
})
export class CoreSphereComponent  implements OnInit {
  value: number;
  constructor(
    private _mathsService: MathsService
  ) { 
    this.value = this._mathsService.coreSphere;
  }

  ngOnInit() {}

}
