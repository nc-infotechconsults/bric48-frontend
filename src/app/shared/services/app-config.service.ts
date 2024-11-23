import { Injectable } from '@angular/core';
import { AccessTokenDTO } from '../model/dto/access-token-dto';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private accessToken?: AccessTokenDTO;

  constructor() { 
    const json = localStorage.getItem('accessToken');
    if(json){
      this.accessToken = JSON.parse(json);
    }
  }

  setAccessToken(accessToken: AccessTokenDTO){
    this.accessToken = accessToken;
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
  }

  getAccessToken() {
    return this.accessToken;
  }

}
