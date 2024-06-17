import { TestBed } from '@angular/core/testing';

import { NuovoTirocinioApiService } from './nuovo-tirocinio-api.service';

describe('NuovoTirocinioApiService', () => {
  let service: NuovoTirocinioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuovoTirocinioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
