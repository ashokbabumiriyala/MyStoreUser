import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductOrderRowExpandComponent } from './product-order-row-expand.component';

describe('ProductOrderRowExpandComponent', () => {
  let component: ProductOrderRowExpandComponent;
  let fixture: ComponentFixture<ProductOrderRowExpandComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOrderRowExpandComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductOrderRowExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
