import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminHistoryTableEntryComponent} from './admin-history-table-entry.component';

describe('AdminHistoryTableEntryComponent', () => {
  let component: AdminHistoryTableEntryComponent;
  let fixture: ComponentFixture<AdminHistoryTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHistoryTableEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHistoryTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
