import { TestBed } from '@angular/core/testing';

import { AllegatoApiService } from './allegato-api.service';

describe('AllegatoApiService', () => {
  let service: AllegatoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllegatoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
