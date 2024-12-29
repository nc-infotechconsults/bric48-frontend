import { Injectable } from '@angular/core';
import { Machinery } from '../../model/domain/machinery';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MachineryService extends BaseService<Machinery, any> {
  override resource = '/machineries';
}
