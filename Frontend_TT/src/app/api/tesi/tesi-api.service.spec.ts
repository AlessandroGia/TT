import { TestBed } from '@angular/core/testing';

import { TesiApiService } from './tesi-api.service';

describe('TesiApiService', () => {
  let service: TesiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TesiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
