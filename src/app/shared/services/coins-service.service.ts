import { Injectable } from '@angular/core';
import { MathsService } from './maths.service';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  private _entryCoinsArray: Array<number> = [];
  private _coinsArray: Array<number> = [];
  private _selectedCoins: Array<number> = [];
  
  entryCoinFirst = false;
  isCoinsSet = false;
  constructor(private _mathsService: MathsService) {
    //@TODO remove sometime, set coins for testing purposes
    this.entryCoinsArray = [2, 3, 5, 8];
    this._coinsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
    this.isCoinsSet = true;
  }
    
  get entryCoinsArray(): Array<number> {
    return this._entryCoinsArray;
  }
  
  set entryCoinsArray(value: Array<number>) {
    this._entryCoinsArray = value;
    this.isCoinsSet = true;
  }
    
  get coinsArray(): Array<number> {
    return this._coinsArray;
  }
  
  set coinsArray(value: Array<number>) {
    this._coinsArray = value;
    this.isCoinsSet = true;
  }
    
  get selectedCoinsArray(): Array<number> {
    return this._selectedCoins;
  }
  
  // set selectedCoinsArray(value: Array<number>) {
  //   this._selectedCoins = value;
  // }

  
  public checkEntryCoinFirst(entryCoin: boolean): boolean {
    if (entryCoin && this.selectedCoinsArray.length === 0) {
      this.entryCoinFirst = true;
      return true;
    } else {
      return false;
    }
  }

  public addSelectedCoin(coinValue: number) {
    if (coinValue !== undefined){
      this.selectedCoinsArray.push(coinValue);
      this._mathsService.makeAdditions(this.selectedCoinsArray);
    }
  }

  public incrementCoinsArray() {
    console.log(this.coinsArray);

    let counter = 1;
    this.coinsArray.forEach((c, index) => {
      let coin = c;
      if(coin === 9) {
        coin = 0;
      } else if ( coin === 0 && counter < 4) {
        counter++;
      } else {
        coin++;
      }
      this.coinsArray[index] = coin;
    });
    console.log(this.coinsArray);

  }
}
