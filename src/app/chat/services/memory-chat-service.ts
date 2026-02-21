import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Chat, ChatMessage, ChatStartResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MemoryChatService {
  private readonly API_URL = '/v1/chat-memory';
  private readonly http = inject(HttpClient);

  selectedChatId = signal<string | null>(null);

  listAllChats = httpResource<Chat[]>(() => this.API_URL);

  chatMessagesResource = httpResource<ChatMessage[]>(() => {
    const chatId = this.selectedChatId();
    return chatId ? `${this.API_URL}/${chatId}` : undefined;
  });

  startNewChat(message: string) {
    return this.http.post<ChatStartResponse>(`${this.API_URL}/start`, { message });
  }

  continueChat(chatId: string, message: string) {
    return this.http.post<ChatMessage>(`${this.API_URL}/${chatId}`, { message });
  }

  selectChat(chatId: string) {
    this.selectedChatId.set(chatId);
  }

  clearSelection() {
    this.selectedChatId.set(null);
  }
}
