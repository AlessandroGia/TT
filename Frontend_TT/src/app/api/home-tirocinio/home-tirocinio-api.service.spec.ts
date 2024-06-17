import { TestBed } from '@angular/core/testing';

import { HomeTirocinioApiService } from './home-tirocinio-api.service';

describe('HomeTirocinioApiService', () => {
  let service: HomeTirocinioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeTirocinioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
