import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminTokensTableComponent} from './admin-tokens-table.component';

describe('AdminTokensTableComponent', () => {
  let component: AdminTokensTableComponent;
  let fixture: ComponentFixture<AdminTokensTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTokensTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTokensTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
