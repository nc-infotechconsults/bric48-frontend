import { Injectable } from '@angular/core';
import { Beacon } from '../../model/domain/beacon';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class BeaconService extends BaseService<Beacon, any> {
  override resource = '/beacons';
}
