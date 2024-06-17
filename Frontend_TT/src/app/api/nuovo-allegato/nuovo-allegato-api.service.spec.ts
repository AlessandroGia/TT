import { TestBed } from '@angular/core/testing';

import { NuovoAllegatoApiService } from './nuovo-allegato-api.service';

describe('NuovoAllegatoApiService', () => {
  let service: NuovoAllegatoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuovoAllegatoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
