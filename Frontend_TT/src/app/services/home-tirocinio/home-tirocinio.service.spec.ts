import { TestBed } from '@angular/core/testing';

import { HomeTirocinioService } from './home-tirocinio.service';

describe('HomeTirocinioService', () => {
  let service: HomeTirocinioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeTirocinioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
