import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService<Role, RoleDTO> extends BaseService<Role, RoleDTO> {
  override resource = '/roles';
}
