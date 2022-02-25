import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminCashTransactionTableComponent} from './admin-cash-transaction-table.component';

describe('AdminCashTransactionTableComponent', () => {
  let component: AdminCashTransactionTableComponent;
  let fixture: ComponentFixture<AdminCashTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCashTransactionTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCashTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
