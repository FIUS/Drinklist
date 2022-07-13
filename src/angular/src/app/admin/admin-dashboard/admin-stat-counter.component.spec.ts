import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminStatCounterComponent} from './admin-stat-counter.component';

describe('AdminStatCounterComponent', () => {
  let component: AdminStatCounterComponent;
  let fixture: ComponentFixture<AdminStatCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminStatCounterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStatCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
