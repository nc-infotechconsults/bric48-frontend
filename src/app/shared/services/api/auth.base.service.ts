import { Injectable } from '@angular/core';
import { CredentialsDTO } from 'src/app/model/dto/credentials-dto';
import { AbstractBaseService } from './abstract.base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AbstractBaseService {
  override resource = '/auth';

  login(credentials: CredentialsDTO){
    this.makePostRequest('/token', credentials);
  }

  session(){
    this.makeGetRequest('/session');
  }
}
