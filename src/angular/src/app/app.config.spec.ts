import {TestBed} from '@angular/core/testing';
import {AppConfig} from './app.config';

describe('AppConfig', () => {
  let service: AppConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
