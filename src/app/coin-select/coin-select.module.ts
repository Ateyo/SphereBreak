import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPage } from './form.page';
import { FormComponent } from './components/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CoinSelectRoutingModule } from './coin-select-rounting.module';
import { HomePageModule } from '../home/home.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoinSelectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HomePageModule,
  ],
  declarations: [FormPage, FormComponent],
})
export class CoinSelectModule { }
