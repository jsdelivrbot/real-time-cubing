import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomService } from './room.service';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
    RoomsRoutingModule
  ],
  declarations: [
    RoomListComponent,
    RoomFormComponent
  ],
  providers: [RoomService]
})
export class RoomsModule { }
