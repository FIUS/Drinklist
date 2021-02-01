import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminConfirmationModalComponent} from './admin-confirmation-modal.component';

describe('AdminConfirmationModalComponent', () => {
  let component: AdminConfirmationModalComponent;
  let fixture: ComponentFixture<AdminConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminConfirmationModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
