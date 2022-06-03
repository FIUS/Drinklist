import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminUsersActionsComponent} from './admin-users-actions.component';

describe('AdminUsersActionsComponent', () => {
  let component: AdminUsersActionsComponent;
  let fixture: ComponentFixture<AdminUsersActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsersActionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
