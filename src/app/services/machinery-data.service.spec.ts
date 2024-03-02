import { TestBed } from '@angular/core/testing';

import { MachineryDataService } from './machinery-data.service';

describe('MachineryDataService', () => {
  let service: MachineryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
