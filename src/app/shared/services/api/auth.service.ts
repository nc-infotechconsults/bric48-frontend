import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CredentialsDTO } from 'src/app/shared/model/dto/credentials-dto';
import { User } from '../../model/domain/user';
import { AccessTokenDTO } from '../../model/dto/access-token-dto';
import { AbstractBaseService } from './abstract.base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AbstractBaseService {
  override resource = '/auth';
  protected override baseUrl: string = '/api';

  login(credentials: CredentialsDTO): Observable<AccessTokenDTO> {
    return this.makePostRequest('/token', credentials);
  }

  session(): Observable<User> {
    return this.makeGetRequest('/session');
  }
}
