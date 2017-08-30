import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { SocketService } from '../core/socket.service';
import { Room } from '../models/room.model';

@Injectable()
export class RoomService {
  rooms: Room[] = [];

  constructor(private socketService: SocketService, private http: HttpClient, private router: Router) {
    this.socketService.onSocket.subscribe(socket => {
      socket.on('initialRooms', (rooms: Room[]) => this.rooms = rooms);
      socket.on('newRoom', (room: Room) => this.rooms.push(room));
    });
  }

  createRoom(room: Room): void {
    this.http.post('/api/rooms', room).subscribe((data: any) => {
      this.router.navigate(['rooms', data.room._id]);
    });
  }
}
