import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MemoryChatService } from '../../services/memory-chat-service';
import { ChatMessage, ChatStartResponse, ChatType } from '../../types';
import { catchError, finalize, Observable, of } from 'rxjs';
import { MarkdownToHtmlPipe } from '../../../shared/markdown-to-html-pipe';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-chat-panel',
  imports: [MarkdownToHtmlPipe, FormsModule, Card, ButtonModule, InputText],
  templateUrl: './chat-panel.html',
  styleUrl: './chat-panel.css',
})
export class ChatPanel {
  private readonly chatHistory = viewChild<ElementRef>('chatHistory');

  protected readonly memoryChatService = inject(MemoryChatService);

  userInput = signal('');
  isLoading = false;
  messages = signal<ChatMessage[]>([]);

  readonly isDisabled = computed(() => this.userInput().trim() === '' || this.isLoading);

  private readonly syncMessagesEffect = effect(() => {
    const resourceMessages = this.memoryChatService.chatMessagesResource.value();
    this.messages.set(resourceMessages || []);
  });

  private readonly autoScrollEffect = effect(() => {
    this.messages(); // Track messages changes
    setTimeout(this.scrollToBottom.bind(this), 0);
  });

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    this.userInput.set(this.userInput().trim());
    if (this.isDisabled()) return;
    this.isLoading = true;
    this.updateMessages(this.userInput());
    this.sendChatMessage();
  }

  private sendChatMessage() {
    const currentChatID = this.memoryChatService.selectedChatId();
    const message = this.userInput();

    const handler: () => Observable<ChatStartResponse | ChatMessage> = currentChatID
      ? () => this.memoryChatService.continueChat(currentChatID!, message)
      : () => this.memoryChatService.startNewChat(message);

    handler()
      .pipe(catchError((error) => this.handleError(error)))
      .pipe(finalize(() => this.clearInput()))
      .subscribe((response: ChatStartResponse | ChatMessage) => {
        if ('chatId' in response) {
          this.memoryChatService.selectChat(response.chatId);
          this.memoryChatService.listAllChats.reload();
        } else {
          this.updateMessages(response.content, ChatType.ASSISTANT);
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error?: any) {
    console.error('Chat error:', error);

    let errorMessage = 'Sorry, I am unable to process your request at the moment.';

    if (error?.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (error?.status === 404) {
      errorMessage = 'Chat not found. Please start a new conversation.';
    } else if (error?.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    this.updateMessages(errorMessage, ChatType.ASSISTANT);
    return of();
  }

  private clearInput() {
    this.userInput.set('');
    this.isLoading = false;
  }

  private updateMessages(content: string, type: ChatType = ChatType.USER) {
    this.messages.update((messages: ChatMessage[]) => [...messages, { content, type }]);
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
}
