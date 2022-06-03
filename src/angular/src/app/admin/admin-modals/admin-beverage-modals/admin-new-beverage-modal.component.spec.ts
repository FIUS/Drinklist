import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminNewBeverageModalComponent} from './admin-new-beverage-modal.component';

describe('AdminNewBeverageModalComponent', () => {
  let component: AdminNewBeverageModalComponent;
  let fixture: ComponentFixture<AdminNewBeverageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminNewBeverageModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNewBeverageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
