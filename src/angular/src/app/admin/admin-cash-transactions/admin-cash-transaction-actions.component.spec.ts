import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminCashTransactionActionsComponent} from './admin-cash-transaction-actions.component';

describe('AdminCashTransactionActionsComponent', () => {
  let component: AdminCashTransactionActionsComponent;
  let fixture: ComponentFixture<AdminCashTransactionActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCashTransactionActionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCashTransactionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
