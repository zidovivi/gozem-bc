import { TestBed } from '@angular/core/testing';

import { DomainDataService } from './domain-data.service';

describe('DomainDataService', () => {
  let service: DomainDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
