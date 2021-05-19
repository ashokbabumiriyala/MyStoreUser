import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefundsAndCancellationComponent } from './refunds-and-cancellation.component';

describe('RefundsAndCancellationComponent', () => {
  let component: RefundsAndCancellationComponent;
  let fixture: ComponentFixture<RefundsAndCancellationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundsAndCancellationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefundsAndCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
