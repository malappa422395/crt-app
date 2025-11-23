import { TestBed } from '@angular/core/testing';

import { MoneyManagerAccountService } from './money-manager-account.service';

describe('MoneyManagerAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoneyManagerAccountService = TestBed.get(MoneyManagerAccountService);
    expect(service).toBeTruthy();
  });
});
