import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminSessionsComponent} from './admin-sessions.component';

describe('AdminTokensComponent', () => {
  let component: AdminSessionsComponent;
  let fixture: ComponentFixture<AdminSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSessionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
