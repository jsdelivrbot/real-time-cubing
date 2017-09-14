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
import { Solve } from '../../models/solve.model';
import { State, UserState } from '../../models/user-state.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnDestroy, OnInit {
  room: Room;
  scramble: string;
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
      this.room.userStates.push({ userId: this.auth.user._id, state: State.Ready } as UserState);
    });

    this.roomService.onUserJoined()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: User) => {
          this.room.users.push(user);
          this.room.userStates.push({ userId: user._id, state: State.Ready } as UserState);
        });

    this.roomService.onUserLeft()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: User) => {
          _.remove(this.room.users, user);
          _.remove(this.room.userStates, { userId: user._id });
        });

    this.roomService.onMessage()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((message: Message) => this.room.messages.push(message));

    this.roomService.onSolve()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((solve: Solve) => {
          this.room.solves.push(solve);
          _.find(this.room.userStates, { userId: solve.userId }).state = State.Ready;
        });

    this.roomService.onScramble()
        .takeUntil(this.ngUnsubscribe)
        .subscribe((scramble: string) => {
          this.scramble = scramble;
          this.room.solveIndex += 1;
          _(this.room.userStates)
            .filter({ state: State.Ready })
            .each((userState: UserState) => userState.state = State.Scrambling);
        });
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

  sendSolve(solve: Solve): void {
    solve.userId = this.auth.user._id;
    solve.index = this.room.solveIndex;
    this.roomService.sendSolve(this.room._id, solve);
    this.room.solves.push(solve);
    _.find(this.room.userStates, { userId: solve.userId }).state = State.Ready;
  }

  newScrambleRequest(): void {
    this.roomService.newScrambleRequest(this.room._id);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
