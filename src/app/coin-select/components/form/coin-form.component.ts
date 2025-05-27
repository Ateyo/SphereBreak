import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoinsService } from '../../../shared/services/coins.service';

@Component({
  selector: 'app-form',
  imports: [SharedModule],
  templateUrl: './coin-form.component.html',
  styleUrls: ['./coin-form.component.scss'],
})
export class CoinFormComponent implements OnInit {
  @ViewChild('modal') modal!: IonModal;
  coinNumber = new FormControl();
  name: string;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  isModalOpen = false;

  constructor(private router: Router, private _coinsService: CoinsService) {
    this.name = 'yeah';
  }
  ngOnInit() {}

  get entryCoinsArray() {
    return this._coinsService.entryCoinsArray$();
  }

  onSubmit() {
    if (this.entryCoinsArray.length < 4) {
      this._coinsService.entryCoinsArray = [
        ...this.entryCoinsArray,
        this.coinNumber.value,
      ];
    } else {
      this.setOpen(true);
    }
    this.coinNumber.reset();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    if (this.modal) {
      this.modal.dismiss(null, 'cancel');
    }
    this.isModalOpen = false;
  }

  confirm() {
    if (this.modal) {
      this.modal.dismiss(this.name, 'confirm');
    }
    this.router.navigate(['/home']);
    this.isModalOpen = false;
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
