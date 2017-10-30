import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomService } from './room.service';
import { RoomComponent } from './room/room.component';
import { RoomResolver } from './room-resolver.service';
import { ChatComponent } from './chat/chat.component';
import { TimerComponent } from './timer/timer.component';
import { SolvesComponent } from './solves/solves.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
    RoomsRoutingModule
  ],
  declarations: [
    RoomListComponent,
    RoomFormComponent,
    RoomComponent,
    ChatComponent,
    TimerComponent,
    SolvesComponent
  ],
  providers: [RoomService, RoomResolver]
})
export class RoomsModule { }
