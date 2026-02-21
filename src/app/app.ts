import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatList } from './chat/memory-chat/chat-list/chat-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('chat-ai-ui');
}
