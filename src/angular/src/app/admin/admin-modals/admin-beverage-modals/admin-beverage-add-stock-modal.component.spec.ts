import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeverageAddStockModalComponent} from './admin-beverage-add-stock-modal.component';

describe('AdminBeverageAddStockModalComponent', () => {
  let component: AdminBeverageAddStockModalComponent;
  let fixture: ComponentFixture<AdminBeverageAddStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeverageAddStockModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeverageAddStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
