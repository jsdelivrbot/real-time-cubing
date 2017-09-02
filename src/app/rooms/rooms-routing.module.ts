import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth-guard.service';
import { RoomResolver } from './room-resolver.service';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  { path: 'rooms', component: RoomListComponent, canActivate: [AuthGuard] },
  { path: 'rooms/:id', component: RoomComponent, canActivate: [AuthGuard], resolve: { room: RoomResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
