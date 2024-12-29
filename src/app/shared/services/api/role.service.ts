import { Injectable } from '@angular/core';
import { Role } from '../../model/domain/role';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService<Role, any> {
  override resource = '/roles';
}
