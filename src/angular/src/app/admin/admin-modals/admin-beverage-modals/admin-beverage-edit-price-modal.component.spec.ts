import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeverageEditPriceModalComponent} from './admin-beverage-edit-price-modal.component';

describe('AdminBeverageEditPriceModalComponent', () => {
  let component: AdminBeverageEditPriceModalComponent;
  let fixture: ComponentFixture<AdminBeverageEditPriceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeverageEditPriceModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeverageEditPriceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
