import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminSessionsTableEntryComponent} from './admin-sessions-table-entry.component';

describe('AdminTokensTableEntryComponent', () => {
  let component: AdminSessionsTableEntryComponent;
  let fixture: ComponentFixture<AdminSessionsTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSessionsTableEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSessionsTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
