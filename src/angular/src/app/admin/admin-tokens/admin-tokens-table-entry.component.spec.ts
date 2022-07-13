import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminTokensTableEntryComponent} from './admin-tokens-table-entry.component';

describe('AdminTokensTableEntryComponent', () => {
  let component: AdminTokensTableEntryComponent;
  let fixture: ComponentFixture<AdminTokensTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTokensTableEntryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTokensTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
