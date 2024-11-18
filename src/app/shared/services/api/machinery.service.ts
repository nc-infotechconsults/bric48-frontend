import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MachineryService<Machinery, MachineryDTO> extends BaseService<Machinery, MachineryDTO> {
  override resource = '/machineries';
}
