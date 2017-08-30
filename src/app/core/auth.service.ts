import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import * as jwtDecode from 'jwt-decode';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { SocketService } from './socket.service';

@Injectable()
export class AuthService {
  user: User;

  constructor(private socketService: SocketService, private router: Router) {
    const currentJwt = localStorage.getItem('jwt');
    if (currentJwt) {
      this.onToken(currentJwt);
    }
    Observable.fromEvent(window, 'storage')
      .filter((event: StorageEvent) => event.key === 'jwt')
      .map((event: StorageEvent) => event.newValue)
      .subscribe(jwt => this.onToken(jwt));
  }

  openWcaOAuthPopup(): void {
    const params = new URLSearchParams();
    params.set('response_type', 'code');
    params.set('client_id', environment.wcaOAuthClientId);
    params.set('scopes', 'public');
    params.set('redirect_uri', `${environment.baseUrl}/oauth-callback`);
    const url = `https://www.worldcubeassociation.org/oauth/authorize?${params.toString()}`;
    window.open(url, '', 'width=600,height=400');
  }

  signOut(): void {
    localStorage.removeItem('jwt');
    this.user = null;
    this.socketService.disconnect();
    this.router.navigate(['']);
  }

  /**
   * Extracts the user data from the given token and establishes websocket connection.
   */
  private onToken(jwt: string): void {
    this.user = jwtDecode<any>(jwt).user;
    this.socketService.connect(jwt);
    this.router.navigate(['/rooms']);
  }
}
