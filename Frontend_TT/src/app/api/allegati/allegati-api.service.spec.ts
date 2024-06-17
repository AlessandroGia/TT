import { TestBed } from '@angular/core/testing';

import { AllegatiApiService } from './allegati-api.service';

describe('AllegatiApiService', () => {
  let service: AllegatiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllegatiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
