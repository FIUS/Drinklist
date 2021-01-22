import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminHistoryTableComponent} from './admin-history-table.component';

describe('AdminHistoryTableComponent', () => {
  let component: AdminHistoryTableComponent;
  let fixture: ComponentFixture<AdminHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHistoryTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
