import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import * as jwtDecode from 'jwt-decode';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  user: User;

  constructor() {
    const currentJwt = localStorage.getItem('jwt');
    if (currentJwt) {
      this.extractUserFromToken(currentJwt);
    }
    Observable.fromEvent(window, 'storage')
      .filter((event: StorageEvent) => event.key === 'jwt')
      .map((event: StorageEvent) => event.newValue)
      .subscribe(jwt => this.extractUserFromToken(jwt));
  }

  openWcaOAuthPopup(): void {
    const params = new URLSearchParams();
    params.set('response_type', 'code');
    params.set('client_id', environment.wcaOAuthClientId);
    params.set('scopes', 'public');
    params.set('redirect_uri', `${environment.baseUrl}/oauth-callback`);
    const url = `https://www.worldcubeassociation.org/oauth/authorize?${params.toString()}`;
    const popup: Window = window.open(url, '', 'width=600,height=400');
  }

  extractUserFromToken(jwt: string): void {
    this.user = jwtDecode(jwt).user;
  }

  signOut(): void {
    localStorage.removeItem('jwt');
    this.user = null;
  }
}
