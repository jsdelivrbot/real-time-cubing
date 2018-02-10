import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';

import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Input() messages: Message[];
  @Output() message = new EventEmitter<string>();
  messageContent = '';

  constructor() { }

  onSubmit(): void {
    const messageContent = _.trim(this.messageContent);
    if (messageContent) {
      this.message.emit(messageContent);
      this.messageContent = '';
    }
  }
}
