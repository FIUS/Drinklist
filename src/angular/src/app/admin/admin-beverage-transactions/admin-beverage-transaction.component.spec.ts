import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeverageTransactionComponent} from './admin-beverage-transaction.component';

describe('AdminBeverageTransactionComponent', () => {
  let component: AdminBeverageTransactionComponent;
  let fixture: ComponentFixture<AdminBeverageTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeverageTransactionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeverageTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
