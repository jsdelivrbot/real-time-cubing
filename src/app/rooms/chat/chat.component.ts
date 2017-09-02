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
  @Output() onMessage = new EventEmitter<string>();
  messageContent = '';

  constructor() { }

  onSubmit(): void {
    const messageContent = _.trim(this.messageContent);
    if (messageContent) {
      this.onMessage.emit(messageContent);
      this.messageContent = '';
    }
  }
}
