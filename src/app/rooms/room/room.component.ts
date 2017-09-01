import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { RoomService } from '../room.service';
import { RoomData } from '../../models/room-data.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  roomData: RoomData;

  constructor(private route: ActivatedRoute, private auth: AuthService, private roomService: RoomService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { roomData: RoomData }) => {
      this.roomData = data.roomData;
      this.roomService.joinRoom(this.roomData.room._id, this.auth.user);
    });
  }
}
