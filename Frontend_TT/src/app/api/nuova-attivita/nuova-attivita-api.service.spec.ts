import { TestBed } from '@angular/core/testing';

import { NuovaAttivitaApiService } from './nuova-attivita-api.service';

describe('NuovaAttivitaApiService', () => {
  let service: NuovaAttivitaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuovaAttivitaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
