import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class BeaconService<Beacon, BeaconDTO> extends BaseService<Beacon, BeaconDTO> {
  override resource = '/beacons';
}
