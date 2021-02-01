import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeveragesActionsComponent} from './admin-beverages-actions.component';

describe('AdminBeveragesActionsComponent', () => {
  let component: AdminBeveragesActionsComponent;
  let fixture: ComponentFixture<AdminBeveragesActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeveragesActionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeveragesActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
