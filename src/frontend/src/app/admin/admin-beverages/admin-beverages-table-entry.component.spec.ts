import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeveragesTableEntryComponent} from './admin-beverages-table-entry.component';

describe('AdminBeveragesTableEntryComponent', () => {
  let component: AdminBeveragesTableEntryComponent;
  let fixture: ComponentFixture<AdminBeveragesTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeveragesTableEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeveragesTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
