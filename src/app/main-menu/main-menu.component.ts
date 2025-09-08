import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-main-menu',
  imports: [SharedModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  private router = inject(Router);
}
