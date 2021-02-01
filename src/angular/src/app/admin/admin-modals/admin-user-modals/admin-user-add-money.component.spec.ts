import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminUserAddMoneyComponent} from './admin-user-add-money.component';

describe('AdminUserAddMoneyComponent', () => {
  let component: AdminUserAddMoneyComponent;
  let fixture: ComponentFixture<AdminUserAddMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserAddMoneyComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserAddMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
