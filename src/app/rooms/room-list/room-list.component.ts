import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RoomService } from '../room.service';
import { SimplifiedRoom } from '../../models/room.model';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent {
  constructor(private roomService: RoomService, private router: Router) { }

  onCreateRoom(room: SimplifiedRoom) {
    this.roomService.createRoom(room).subscribe((createdRoom: SimplifiedRoom) => {
      this.router.navigate(['rooms', createdRoom._id]);
    });
  }
}
