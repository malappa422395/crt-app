import { TestBed } from '@angular/core/testing';

import { ProspectDataService } from './prospect-data-service';

describe('ProspectDataService', () => {
  let service: ProspectDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProspectDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
