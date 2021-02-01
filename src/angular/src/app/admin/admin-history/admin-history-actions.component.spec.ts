import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminHistoryActionsComponent} from './admin-history-actions.component';

describe('AdminHistoryActionsComponent', () => {
  let component: AdminHistoryActionsComponent;
  let fixture: ComponentFixture<AdminHistoryActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHistoryActionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHistoryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
