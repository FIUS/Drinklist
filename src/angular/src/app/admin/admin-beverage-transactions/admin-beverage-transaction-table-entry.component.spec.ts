import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeverageTransactionTableEntryComponent} from './admin-beverage-transaction-table-entry.component';

describe('AdminBeverageTransactionTableEntryComponent', () => {
  let component: AdminBeverageTransactionTableEntryComponent;
  let fixture: ComponentFixture<AdminBeverageTransactionTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeverageTransactionTableEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeverageTransactionTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
