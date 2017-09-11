import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { SocketService } from '../core/socket.service';
import { Message } from '../models/message.model';
import { SimplifiedRoom, Room } from '../models/room.model';
import { Solve } from '../models/solve.model';
import { User } from '../models/user.model';

@Injectable()
export class RoomService {
  rooms: SimplifiedRoom[] = [];

  constructor(private socketService: SocketService, private http: HttpClient) {
    this.socketService.onSocket.subscribe(socket => {
      socket.on('initialRooms', (rooms: SimplifiedRoom[]) => this.rooms = rooms);
      socket.on('roomCreated', (room: SimplifiedRoom) => this.rooms.push(room));
      socket.on('roomRemoved', (room: SimplifiedRoom) => _.remove(this.rooms, room));
    });
  }

  createRoom(room: SimplifiedRoom): Observable<SimplifiedRoom> {
    return this.http.post('/api/rooms', room);
  }

  getRoom(roomId: string): Observable<Room> {
    return this.http.get(`/api/rooms/${roomId}`);
  }

  joinRoom(roomId: string, user: User): void {
    this.socketService.socket.emit('joinRoom', { roomId, user });
  }

  leaveRoom(roomId: string, user: User): void {
    this.socketService.socket.emit('leaveRoom', { roomId, user });
  }

  sendMessage(roomId: string, message: Message): void {
    this.socketService.socket.emit('message', { roomId, message });
  }

  sendSolve(roomId: string, userId: string, solve: Solve): void {
    this.socketService.socket.emit('solve', { roomId, userId, solve });
  }

  onUserJoined(): Observable<User> {
    return this.observableFromSocketEvent('userJoined');
  }

  onUserLeft(): Observable<User> {
    return this.observableFromSocketEvent('userLeft');
  }

  onMessage(): Observable<Message> {
    return this.observableFromSocketEvent('message');
  }

  onSolve(): Observable<{ userId: string, solve: Solve }> {
    return this.observableFromSocketEvent('solve');
  }

  onScramble(): Observable<string> {
    return this.observableFromSocketEvent('scramble');
  }

  private observableFromSocketEvent(event): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on(event, (data: any) => observer.next(data));
    });
  }
}
