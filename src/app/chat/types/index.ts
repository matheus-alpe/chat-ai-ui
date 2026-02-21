export interface Chat {
  id: string;
  description: string;
}

export interface ChatStartResponse {
  chatId: string;
  message: string;
  description: string;
}

export interface ChatMessage {
  content: string;
  type: ChatType;
}

export enum ChatType {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}
