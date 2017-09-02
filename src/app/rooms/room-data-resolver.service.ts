import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';

import { RoomService } from './room.service';
import { RoomExtended } from '../models/room.model';

@Injectable()
export class RoomDataResolver implements Resolve<RoomExtended> {
  constructor(private roomService: RoomService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoomExtended> {
    const roomId = route.paramMap.get('id');
    return this.roomService.getRoomData(roomId).catch(error => {
      this.router.navigate(['/rooms']);
      return Observable.empty();
    });
  }
}
