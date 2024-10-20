import { TestBed } from '@angular/core/testing';

import { DeviisService } from './deviis.service';

describe('DeviisService', () => {
  let service: DeviisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
