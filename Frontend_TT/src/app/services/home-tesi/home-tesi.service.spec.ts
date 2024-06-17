import { TestBed } from '@angular/core/testing';

import { HomeTesiService } from './home-tesi.service';

describe('HomeTesiService', () => {
  let service: HomeTesiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeTesiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
