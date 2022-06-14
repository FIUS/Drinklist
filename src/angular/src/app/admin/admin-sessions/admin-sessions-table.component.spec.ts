import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminSessionsTableComponent} from './admin-sessions-table.component';

describe('AdminTokensTableComponent', () => {
  let component: AdminSessionsTableComponent;
  let fixture: ComponentFixture<AdminSessionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSessionsTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSessionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
