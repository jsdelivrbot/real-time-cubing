import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RoomService } from './room.service';
import { RoomData } from '../models/room-data.model';

@Injectable()
export class RoomDataResolver implements Resolve<RoomData> {
  constructor(private roomService: RoomService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoomData> {
    const roomId = route.paramMap.get('id');
    return this.roomService.getRoomData(roomId);
  }
}
