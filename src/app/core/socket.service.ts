import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  socket: SocketIOClient.Socket;
  onSocket = new ReplaySubject<SocketIOClient.Socket>(1);

  constructor() { }

  connect(jwt: string): void {
    this.socket = socketIo.connect(environment.baseUrl, { query: `token=${jwt}` });
    this.onSocket.next(this.socket);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
