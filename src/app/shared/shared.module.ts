import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

const matModules = [
  CommonModule,
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  RouterLink,
  MatInputModule
  // Add other Material modules here as needed
];

@NgModule({
  declarations: [],
  imports: [...matModules],
  exports: [...matModules]
})
export class SharedModule {}
