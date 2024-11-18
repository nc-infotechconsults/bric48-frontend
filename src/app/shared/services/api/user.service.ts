import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService<User, UserDTO> extends BaseService<User, UserDTO> {
  override resource = '/users';
}
