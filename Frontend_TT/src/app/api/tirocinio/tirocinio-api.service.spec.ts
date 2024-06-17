import { TestBed } from '@angular/core/testing';

import { TirocinioApiService } from './tirocinio-api.service';

describe('TirocinioApiService', () => {
  let service: TirocinioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TirocinioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
