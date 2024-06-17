import { TestBed } from '@angular/core/testing';

import { ElencoAttivitaService } from './elenco-attivita.service';

describe('ElencoAttivitaService', () => {
  let service: ElencoAttivitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElencoAttivitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
