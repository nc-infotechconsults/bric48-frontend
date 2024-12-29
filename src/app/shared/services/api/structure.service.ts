import { Injectable } from '@angular/core';
import { Structure } from '../../model/domain/structure';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class StructureService extends BaseService<Structure, any> {
  override resource = '/structures';
}
