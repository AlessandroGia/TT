import { TestBed } from '@angular/core/testing';

import { TesiService } from './tesi.service';

describe('TesiService', () => {
  let service: TesiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TesiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
