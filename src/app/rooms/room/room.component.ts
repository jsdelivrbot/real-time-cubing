import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

import { AuthService } from '../../core/auth.service';
import { Message } from '../../models/message.model';
import { Room } from '../../models/room.model';
import { RoomService } from '../room.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnDestroy, OnInit {
  room: Room;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private roomService: RoomService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { room: Room }) => {
      this.room = data.room;
      this.roomService.joinRoom(this.room._id, this.auth.user);
      this.room.users.push(this.auth.user);
    });

    this.roomService.onUserJoined()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: User) => this.room.users.push(user));

    this.roomService.onUserLeft()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: User) => _.remove(this.room.users, user));

    this.roomService.onMessage()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((message: Message) => this.room.messages.push(message));
  }

  leave(): void {
    this.roomService.leaveRoom(this.room._id, this.auth.user);
    this.router.navigate(['/rooms']);
  }

  sendMessage(messageContent): void {
    const message: Message = { content: messageContent, userName: this.auth.user.name };
    this.roomService.sendMessage(this.room._id, message);
    this.room.messages.push(message);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
