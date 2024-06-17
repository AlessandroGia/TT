import { TestBed } from '@angular/core/testing';

import { TirocinioService } from './tirocinio.service';

describe('TirocinioService', () => {
  let service: TirocinioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TirocinioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
