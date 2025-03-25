import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';
import { CoinsService } from 'src/app/shared/services/coins-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent  implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  entryCoinsArray: Array<number>= [];
  coinNumber = new FormControl();
  name: string;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  isModalOpen = false;

  constructor(private router: Router,
    private _coinsService: CoinsService) {
    this.name = 'yeah';
   }
  ngOnInit() {}


    onSubmit() {
        if(this.entryCoinsArray.length < 4) {
          this.entryCoinsArray.push(this.coinNumber.value);
        } else {
          this.setOpen(true);
        }
        this.coinNumber.reset();
    }
 
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  
  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this._coinsService.entryCoinsArray = this.entryCoinsArray;
    this.router.navigate(['/home']);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
