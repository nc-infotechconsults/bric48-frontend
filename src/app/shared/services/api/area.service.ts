import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService<Area, AreaDTO> extends BaseService<Area, AreaDTO> {
  override resource = '/areas';
}
