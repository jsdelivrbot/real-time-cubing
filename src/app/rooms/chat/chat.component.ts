import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  // @Input() messages: Message[];
  messages: Message[] = [{ userName: 'Jonatan Kłosko', content: 'Hiya' }, { userName: 'Jeremy Fleischman', content: 'What\'s up?' }];
  @Output() onMessage = new EventEmitter<string>();
  messageContent = '';

  constructor() { }

  onSubmit(): void {
    if (this.messageContent) {
      this.onMessage.emit(this.messageContent);
      this.messageContent = '';
    }
  }
}
