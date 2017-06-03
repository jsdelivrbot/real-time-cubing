import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomListComponent } from './room-list/room-list.component';

const routes: Routes = [
  { path: 'rooms', component: RoomListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
