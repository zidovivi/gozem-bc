import { TestBed } from '@angular/core/testing';

import { WebSocketDataService } from './web-socket-data.service';

describe('WebSocketDataService', () => {
  let service: WebSocketDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
