import { Injectable } from '@angular/core';
import { Area } from '../../model/domain/area';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService extends BaseService<Area, any> {
  override resource = '/areas';
}
