import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBeveragesComponent} from './admin-beverages.component';

describe('AdminBeveragesComponent', () => {
  let component: AdminBeveragesComponent;
  let fixture: ComponentFixture<AdminBeveragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBeveragesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBeveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
