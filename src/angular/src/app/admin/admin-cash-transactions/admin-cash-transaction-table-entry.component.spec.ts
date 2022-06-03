import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminCashTransactionTableEntryComponent} from './admin-cash-transaction-table-entry.component';

describe('AdminCashTransactionTableEntryComponent', () => {
  let component: AdminCashTransactionTableEntryComponent;
  let fixture: ComponentFixture<AdminCashTransactionTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCashTransactionTableEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCashTransactionTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
