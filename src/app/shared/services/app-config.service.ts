import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/domain/user';
import { AccessTokenDTO } from '../model/dto/access-token-dto';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private accessToken?: AccessTokenDTO;
  private loggedUser?: User;
  private router = inject(Router);

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

  cleanAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    this.router.navigateByUrl("/auth/login");
  }

}
