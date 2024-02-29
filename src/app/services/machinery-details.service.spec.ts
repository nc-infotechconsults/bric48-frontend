import { TestBed } from '@angular/core/testing';

import { MachineryDetailsService } from './machinery-details.service';

describe('MachineryDetailsService', () => {
  let service: MachineryDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineryDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
