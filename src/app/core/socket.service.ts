import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor() { }

  connect(jwt: string): void {
    this.socket = socketIo.connect(environment.baseUrl, { query: `token=${jwt}` });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
