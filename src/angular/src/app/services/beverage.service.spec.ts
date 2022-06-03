import {TestBed} from '@angular/core/testing';

import {BeverageService} from './beverage.service';

describe('BeverageService', () => {
  let service: BeverageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeverageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
