import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
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
  currentUserSolves: Solve[];
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
      this.currentUserSolves = _.filter(this.room.solves, { userId: this.auth.user._id });
    });

    this.roomService.onUserJoined()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((user: User) => {
          this.room.users.push(user);
          this.room.userStates.push({ userId: user._id, state: State.Ready } as UserState);
        });

    this.roomService.onUserLeft()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((user: User) => {
          _.remove(this.room.users, user);
          _.remove(this.room.userStates, { userId: user._id });
        });

    this.roomService.onMessage()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((message: Message) => this.room.messages.push(message));

    this.roomService.onSolve()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((solve: Solve) => {
          this.room.solves.push(solve);
          _.find(this.room.userStates, { userId: solve.userId }).state = State.Ready;
        });

    this.roomService.onStateChange()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((userState: UserState) => {
          _.find(this.room.userStates, { userId: userState.userId }).state = userState.state;
        });

    this.roomService.onScramble()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((scramble: string) => {
          this.scramble = scramble;
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
    solve.index = (_.max(_.map(this.room.solves, 'index')) + 1) || 0;
    this.roomService.sendSolve(this.room._id, solve);
    this.room.solves.push(solve);
    this.currentUserSolves.push(solve);
    _.find(this.room.userStates, { userId: solve.userId }).state = State.Ready;
  }

  sendState(state: State): void {
    const userState: UserState = { state, userId: this.auth.user._id };
    _.find(this.room.userStates, { userId: userState.userId }).state = state;
    this.roomService.sendState(this.room._id, userState);
  }

  newScrambleRequest(): void {
    this.roomService.newScrambleRequest(this.room._id);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
