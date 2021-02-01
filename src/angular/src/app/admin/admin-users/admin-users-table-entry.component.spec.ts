import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminUsersTableEntryComponent} from './admin-users-table-entry.component';

describe('AdminUsersTableEntryComponent', () => {
  let component: AdminUsersTableEntryComponent;
  let fixture: ComponentFixture<AdminUsersTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsersTableEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
