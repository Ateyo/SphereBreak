import { TestBed } from '@angular/core/testing';

import { Coin } from '../interfaces/coin';
import { CoinsService } from './coins.service';

describe('CoinsService', () => {
  let service: CoinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoinsService]
    });
    service = TestBed.inject(CoinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get entryCoinsArray', () => {
    const coins = [
      { id: 1, coin: { value: 2, entryCoin: true } },
      { id: 2, coin: { value: 3, entryCoin: true } }
    ];
    service.entryCoinsArray = coins;
    expect(service.entryCoinsArray.length).toBe(2);
    expect(service.entryCoinsArray[0].coin.value).toBe(2);
  });

  it('should add selected coin', () => {
    const coin: Coin = { value: 5, entryCoin: false, id: 99 };
    service.clearSelectedCoins();
    service.addSelectedCoin(coin, 99);
    expect(service.selectedCoinsArray.length).toBe(1);
    expect(service.selectedCoinsArray[0].value).toBe(5);
  });

  it('should clear selected coins', () => {
    const coin: Coin = { value: 1, entryCoin: false, id: 1 };
    service.addSelectedCoin(coin, 1);
    service.clearSelectedCoins();
    expect(service.selectedCoinsArray.length).toBe(0);
  });

  it('should increment coinsArray', () => {
    const before = service.coinsArray.map((c) => c.coin.value);
    service.incrementCoinsArray();
    const after = service.coinsArray.map((c) => c.coin.value);
    expect(after.length).toBe(before.length);
  });

  it('should update quota for break', () => {
    service.clearSelectedCoins();
    service.addSelectedCoin({ value: 2, entryCoin: false, id: 1 }, 1);
    const prevQuota = service.quota;
    service.updateQuotaForBreak();
    expect(service.quota).toBeGreaterThanOrEqual(prevQuota);
  });

  it('should check for quota win', () => {
    service.setQuota(20);
    expect(service.checkForQuotaWin()).toBeTrue();
    service.setQuota(10);
    expect(service.checkForQuotaWin()).toBeFalse();
  });
});
