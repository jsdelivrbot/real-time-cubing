import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor() { }

  openOAuthPopup() {
    const params = new URLSearchParams();
    params.set('response_type', 'code');
    params.set('client_id', 'd77dacb2f4e24aa7b44533fcf66733bfd637dcb0cd55809879ced2128a35f59b');
    params.set('scopes', 'public');
    params.set('redirect_uri', 'http://localhost:4200/oauth-callback');
    const url = `https://staging.worldcubeassociation.org/oauth/authorize?${params.toString()}`;
    const popup: Window = window.open(url, '', 'width=600,height=400');
    Observable.fromEvent(window, 'storage')
      .filter((event: StorageEvent) => event.key === 'jwt')
      .map((event: StorageEvent) => event.newValue)
      .subscribe(token => {
        console.log(jwtDecode(token));
      });
  }
}
