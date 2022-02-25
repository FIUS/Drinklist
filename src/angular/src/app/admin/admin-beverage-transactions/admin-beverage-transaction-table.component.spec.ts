import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeverageTransactionTableComponent} from './admin-beverage-transaction-table.component';

describe('AdminBeverageTransactionTableComponent', () => {
  let component: AdminBeverageTransactionTableComponent;
  let fixture: ComponentFixture<AdminBeverageTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeverageTransactionTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeverageTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
