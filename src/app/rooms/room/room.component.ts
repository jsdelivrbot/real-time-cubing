import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthService } from '../../core/auth.service';
import { RoomData } from '../../models/room-data.model';
import { RoomService } from '../room.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnDestroy, OnInit {
  roomData: RoomData;
  private ngUnsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute, private auth: AuthService, private roomService: RoomService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { roomData: RoomData }) => {
      this.roomData = data.roomData;
      this.roomService.joinRoom(this.roomData.room._id, this.auth.user);
    });

    this.roomService.onUserJoined()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: User) => this.roomData.room.users.push(user));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
