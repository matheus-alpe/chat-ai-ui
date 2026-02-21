import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'memory-chat',
    pathMatch: 'full',
  },
  {
    path: 'memory-chat',
    loadComponent: () =>
      import('./chat/memory-chat/chat-panel/chat-panel').then((m) => m.ChatPanel),
  },
  {
    path: '**',
    redirectTo: 'memory-chat',
  },
];
