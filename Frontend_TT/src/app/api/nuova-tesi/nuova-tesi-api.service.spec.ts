import { TestBed } from '@angular/core/testing';

import { NuovaTesiApiService } from './nuova-tesi-api.service';

describe('NuovaTesiApiService', () => {
  let service: NuovaTesiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuovaTesiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
