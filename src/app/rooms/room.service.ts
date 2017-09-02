import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { SocketService } from '../core/socket.service';
import { Message } from '../models/message.model';
import { Room, RoomExtended } from '../models/room.model';
import { User } from '../models/user.model';

@Injectable()
export class RoomService {
  rooms: Room[] = [];

  constructor(private socketService: SocketService, private http: HttpClient) {
    this.socketService.onSocket.subscribe(socket => {
      socket.on('initialRooms', (rooms: Room[]) => this.rooms = rooms);
      socket.on('roomCreated', (room: Room) => this.rooms.push(room));
      socket.on('roomRemoved', (room: Room) => _.remove(this.rooms, room));
    });
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post('/api/rooms', room);
  }

  getRoomData(roomId: string): Observable<RoomExtended> {
    return this.http.get(`/api/rooms/${roomId}`);
  }

  joinRoom(roomId: string, user: User): void {
    this.socketService.socket.emit('joinRoom', { roomId, user });
  }

  leaveRoom(roomId: string, user: User): void {
    this.socketService.socket.emit('leaveRoom', { roomId, user });
  }

  sendMessage(message: Message): void {
    this.socketService.socket.emit('message', message);
  }

  onUserJoined(): Observable<User> {
    return this.observableFromSocketEvent('userJoined');
  }

  onUserLeft(): Observable<User> {
    return this.observableFromSocketEvent('userLeft');
  }

  private observableFromSocketEvent(event): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on(event, (data: any) => observer.next(data));
    });
  }
}
