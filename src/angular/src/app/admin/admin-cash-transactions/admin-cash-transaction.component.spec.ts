import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminCashTransactionComponent} from './admin-cash-transaction.component';

describe('AdminCashTransactionComponent', () => {
  let component: AdminCashTransactionComponent;
  let fixture: ComponentFixture<AdminCashTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCashTransactionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCashTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
