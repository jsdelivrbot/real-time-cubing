import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';

import { RoomService } from './room.service';
import { Room } from '../models/room.model';

@Injectable()
export class RoomResolver implements Resolve<Room> {
  constructor(private roomService: RoomService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Room> {
    const roomId = route.paramMap.get('id');
    return this.roomService.getRoom(roomId).catch(error => {
      this.router.navigate(['/rooms']);
      return Observable.empty();
    });
  }
}