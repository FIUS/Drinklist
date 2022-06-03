import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeverageTransactionActionsComponent} from './admin-beverage-transaction-actions.component';

describe('AdminBeverageTransactionActionsComponent', () => {
  let component: AdminBeverageTransactionActionsComponent;
  let fixture: ComponentFixture<AdminBeverageTransactionActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeverageTransactionActionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeverageTransactionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
