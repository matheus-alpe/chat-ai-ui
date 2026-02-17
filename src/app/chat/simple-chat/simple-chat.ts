import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ChatService } from '../chat-service';
import { ChatResponse } from '../chat-response';
import { finalize } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-simple-chat',
  imports: [
    CardModule,
    ToolbarModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
  ],
  templateUrl: './simple-chat.html',
  styleUrl: './simple-chat.css',
})
export class SimpleChat {
  private readonly chatHistory = viewChild.required<ElementRef>('chatHistory');
  private readonly chatService = inject(ChatService);
  private readonly local = true;

  userInput = '';
  isLoading = false;

  messages = signal<ChatResponse[]>([{ message: 'Hello, how can I help you today?', isBot: true }]);

  private readonly autoScrollEffect = effect(() => {
    this.messages();
    setTimeout(() => this.scrollToBottom(), 10);
  });

  sendMessage() {
    this.trimUserMessage();
    if (!this.userInput || this.isLoading) return;
    this.updateMessages(this.userInput);
    this.isLoading = true;
    if (this.local) {
      this.simulateResponse();
    } else {
      this.sendChatMessage();
    }
  }

  private trimUserMessage() {
    this.userInput = this.userInput.trim();
  }

  private updateMessages(message: string, isBot = false) {
    this.messages.update((messages) => [...messages, { message, isBot }]);
  }

  private getResponse() {
    setTimeout(() => {
      const response = 'This is a simulated response.';
      this.updateMessages(response, true);
      this.isLoading = false;
    }, 2000);
  }

  private simulateResponse() {
    this.getResponse();
    this.userInput = '';
  }

  private scrollToBottom() {
    try {
      const chatElement = this.chatHistory();
      if (chatElement?.nativeElement) {
        chatElement.nativeElement.scrollTop = chatElement.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Failed to scroll to bottom:', err);
    }
  }

  private sendChatMessage() {
    this.chatService
      .sendMessage(this.userInput)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: ChatResponse) => {
          if (response) {
            this.updateMessages(response.message, true);
          }
          this.userInput = '';
        },
        error: () => {
          this.updateMessages('Failed to get response from server.', true);
        },
      });
  }
}
