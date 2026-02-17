import { computed, Injectable, signal } from '@angular/core';

export const ChatStrategy = {
  Local: {
    label: 'Local',
    value: 'local',
  },
  Server: {
    label: 'Server',
    value: 'server',
  },
} as const;

export type ChatStrategyType = (typeof ChatStrategy)[keyof typeof ChatStrategy];
export type ChatStrategyKey = ChatStrategyType['value'];

@Injectable({
  providedIn: 'root',
})
export class ChatStrategyStore {
  strategy = signal<ChatStrategyType>(ChatStrategy.Local);
  options = Object.values(ChatStrategy);
  isLocal = computed(() => this.strategy() === ChatStrategy.Local);
}
