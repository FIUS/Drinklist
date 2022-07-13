import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeveragesTableComponent} from './admin-beverages-table.component';

describe('AdminBeveragesTableComponent', () => {
  let component: AdminBeveragesTableComponent;
  let fixture: ComponentFixture<AdminBeveragesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeveragesTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeveragesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
