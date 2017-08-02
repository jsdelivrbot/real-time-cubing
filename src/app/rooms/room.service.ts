import { Injectable } from '@angular/core';

import { SocketService } from '../core/socket.service';
import { Room } from '../models/room.model';

@Injectable()
export class RoomService {
  room: Room;
  rooms: Room[] = [];

  constructor(private socketService: SocketService) {
    this.socketService.onSocket.subscribe(socket => {
      socket.on('newRoom', room => {
        this.rooms.push(room);
      });
    });
  }

  createRoom(room: Room): void {
    this.room = room;
    this.rooms.push(room);
    this.socketService.socket.emit('createRoom', room);
  }
}
