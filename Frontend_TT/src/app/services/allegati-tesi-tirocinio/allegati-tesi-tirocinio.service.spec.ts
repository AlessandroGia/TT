import { TestBed } from '@angular/core/testing';

import { AllegatiTesiTirocinioService } from './allegati-tesi-tirocinio.service';

describe('AllegatiTesiTirocinioService', () => {
  let service: AllegatiTesiTirocinioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllegatiTesiTirocinioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
