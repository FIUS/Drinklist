import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminStatBeverageToplistComponent} from './admin-stat-beverage-toplist.component';

describe('AdminStatBeverageToplistComponent', () => {
  let component: AdminStatBeverageToplistComponent;
  let fixture: ComponentFixture<AdminStatBeverageToplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminStatBeverageToplistComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStatBeverageToplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
