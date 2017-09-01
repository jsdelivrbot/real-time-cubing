import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SocketService } from '../core/socket.service';
import { Room } from '../models/room.model';
import { RoomData } from '../models/room-data.model';
import { User } from '../models/user.model';

@Injectable()
export class RoomService {
  rooms: Room[] = [];

  constructor(private socketService: SocketService, private http: HttpClient) {
    this.socketService.onSocket.subscribe(socket => {
      socket.on('initialRooms', (rooms: Room[]) => this.rooms = rooms);
      socket.on('newRoom', (room: Room) => this.rooms.push(room));
    });
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post('/api/rooms', room).map((data: any) => data.room);
  }

  getRoomData(roomId: string): Observable<RoomData> {
    return this.http.get(`/api/rooms/${roomId}`);
  }

  joinRoom(roomId: string, user: User): void {
    this.socketService.socket.emit('joinRoom', { roomId, user });
  }

  onUserJoined(): Observable<User> {
    return this.observableFromSocketEvent('userJoined');
  }

  private observableFromSocketEvent(event): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on(event, (data: any) => observer.next(data));
    });
  }
}
