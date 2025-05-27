import {
  beforeEach,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoinFormComponent } from './coin-form.component';

describe('CoinFormComponent', () => {
  let component: CoinFormComponent;
  let fixture: ComponentFixture<CoinFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CoinFormComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
