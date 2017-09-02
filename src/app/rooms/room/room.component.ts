import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

import { AuthService } from '../../core/auth.service';
import { Message } from '../../models/message.model';
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

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private roomService: RoomService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { roomData: RoomData }) => {
      this.roomData = data.roomData;
      this.roomService.joinRoom(this.roomData.room._id, this.auth.user);
    });

    this.roomService.onUserJoined()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: User) => this.roomData.room.users.push(user));

    this.roomService.onUserLeft()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: User) => _.remove(this.roomData.room.users, user));
  }

  leave(): void {
    this.roomService.leaveRoom(this.roomData.room._id, this.auth.user);
    this.router.navigate(['/rooms']);
  }

  sendMessage(messageContent): void {
    const message: Message = { content: messageContent, userName: this.auth.user.name };
    this.roomService.sendMessage(message);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
