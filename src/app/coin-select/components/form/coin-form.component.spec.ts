import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CoinFormComponent } from './coin-form.component';

describe('CoinFormComponent', () => {
  let component: CoinFormComponent;
  let fixture: ComponentFixture<CoinFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoinFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CoinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
