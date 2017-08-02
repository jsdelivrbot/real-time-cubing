import { Component } from '@angular/core';

import { RoomService } from '../room.service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent {
  constructor(private roomService: RoomService) { }

  onCreateRoom(room: Room) {
    this.roomService.createRoom(room);
  }
}
