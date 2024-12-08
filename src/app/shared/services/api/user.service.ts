import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService<User, UserDTO> extends BaseService<User, UserDTO> {
  override resource = '/users';

  getUserNearMachinery(machineryId: string): Observable<User[]> {
    return this.makeGetRequest(`/userNearMachinery/${machineryId}`);
  }
}
