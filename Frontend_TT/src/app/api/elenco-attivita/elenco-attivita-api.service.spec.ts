import { TestBed } from '@angular/core/testing';

import { ElencoAttivitaApiService } from './elenco-attivita-api.service';

describe('ElencoAttivitaApiService', () => {
  let service: ElencoAttivitaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElencoAttivitaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
