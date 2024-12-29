import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../model/domain/user';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User, any> {
  override resource = '/users';
  userMachineries$ = new BehaviorSubject<Map<string, User[]>>(null);

  getUserNearMachinery(machineryId: string): Observable<User[]> {
    return this.makeGetRequest(`/userNearMachinery/${machineryId}`);
  }

}
