import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminStatUserToplistComponent} from './admin-stat-user-toplist.component';

describe('AdminStatUserToplistComponent', () => {
  let component: AdminStatUserToplistComponent;
  let fixture: ComponentFixture<AdminStatUserToplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminStatUserToplistComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStatUserToplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
