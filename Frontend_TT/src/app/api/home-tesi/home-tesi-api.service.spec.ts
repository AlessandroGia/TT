import { TestBed } from '@angular/core/testing';

import { HomeTesiApiService } from './home-tesi-api.service';

describe('HomeTesiApiService', () => {
  let service: HomeTesiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeTesiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
