import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoinComponent } from './coin.component';

describe('CoinComponent', () => {
  let component: CoinComponent;
  let fixture: ComponentFixture<CoinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CoinComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('coin should have value', () => {
    fixture.componentRef.setInput('coinValue', 2);
    fixture.detectChanges();
    const coinElement: HTMLElement =
      fixture.nativeElement.querySelector('.coin-number');
    expect(coinElement).toBeTruthy();
    expect(coinElement.textContent).toContain(2); // Adjust based on actual value
  });
});
