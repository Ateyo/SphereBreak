import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HighscoreService } from 'src/app/shared/services/highscore.service';
import { PlayerService } from 'src/app/shared/services/player.service';

interface WinDialogData {
  score: number;
  level: number;
  isHighscore: boolean;
}

@Component({
  selector: 'app-win-dialog',
  templateUrl: './win-dialog.component.html',
  styleUrls: ['./win-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class WinDialogComponent {
  highscoreForm: FormGroup;
  // isHighscore: boolean = false; // This will now come from data
  private _playerService = inject(PlayerService);
  private _highscoreService = inject(HighscoreService);
  private fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: WinDialogData) {
    data.isHighscore;
    this.highscoreForm = this.fb.group({
      initials: [
        this._playerService.getInitials(),
        [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]
      ]
    });
  }

  saveHighscore(): void {
    if (this.highscoreForm.valid) {
      const initials = this.highscoreForm.value.initials;
      this._highscoreService
        .addHighscore(initials, this.data.score, this.data.level)
        .subscribe({
          next: (response) => {
            console.log('High score saved:', response);
          },
          error: (error) => console.error('Error saving high score:', error)
        });
    }
  }

  cancelSave(): void {
    // No action needed here, just close the dialog
  }
}
