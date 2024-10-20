import { TestBed } from '@angular/core/testing';

import { RequestSupplyService } from './requeest-supply.service';

describe('RequestSupplyServiceService', () => {
  let service: RequestSupplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestSupplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
