import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class StructureService<Structure, StructureDTO> extends BaseService<Structure, StructureDTO> {
  override resource = '/structures';
}
