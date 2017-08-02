import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { Room } from '../../models/room.model';
import { wcaEvents } from '../../models/wca-event.model';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent {
  @Output() create = new EventEmitter();
  roomForm: FormGroup;

  constructor(private auth: AuthService, private formBuilder: FormBuilder) {
    this.roomForm = formBuilder.group({
      name: '',
      public: true,
      event: wcaEvents[0]
    });
  }

  onCreate() {
    const room: Room = this.roomForm.value;
    room.users = [this.auth.user];
    this.create.emit(room);
  }
}
