import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService<User, UserDTO> extends BaseService<User, UserDTO> {
  override resource = '/users';
  userMachineries$ = new BehaviorSubject<Map<string, User[]>>(null);

  getUserNearMachinery(machineryId: string): Observable<User[]> {
    return this.makeGetRequest(`/userNearMachinery/${machineryId}`);
  }

}
