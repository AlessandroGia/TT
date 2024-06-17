import { TestBed } from '@angular/core/testing';

import { LibrettoDiarioApiService } from './libretto-diario-api.service';

describe('LibrettoDiarioApiService', () => {
  let service: LibrettoDiarioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibrettoDiarioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
