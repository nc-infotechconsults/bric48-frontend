import { TestBed } from '@angular/core/testing';

import { NearbyHeadphonesService } from './nearby-headphones.service';

describe('NearbyHeadphonesService', () => {
  let service: NearbyHeadphonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyHeadphonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
