import { TestBed } from '@angular/core/testing';

import { AttivitaApiService } from './attivita-api.service';

describe('AttivitaApiService', () => {
  let service: AttivitaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttivitaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
