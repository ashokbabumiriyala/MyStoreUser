import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceOrderRowExpandComponent } from './service-order-row-expand.component';

describe('ServiceOrderRowExpandComponent', () => {
  let component: ServiceOrderRowExpandComponent;
  let fixture: ComponentFixture<ServiceOrderRowExpandComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderRowExpandComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceOrderRowExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
