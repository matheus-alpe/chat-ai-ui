import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChatResponse {
  message: string;
  isBot?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API = '/v1/chat';
  private readonly http = inject(HttpClient);

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.API, { message });
  }
}
