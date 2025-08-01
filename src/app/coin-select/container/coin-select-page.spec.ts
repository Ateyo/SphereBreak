import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinSelectPageComponent } from './coin-select-page';

describe('CoinSelectPageComponent', () => {
  let component: CoinSelectPageComponent;
  let fixture: ComponentFixture<CoinSelectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinSelectPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CoinSelectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
