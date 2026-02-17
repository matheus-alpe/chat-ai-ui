import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'simple-chat',
    pathMatch: 'full',
  },
  {
    path: 'simple-chat',
    loadComponent: () => import('./chat/simple-chat/simple-chat').then((m) => m.SimpleChat),
  },
  {
    path: '**',
    redirectTo: 'simple-chat',
  },
];
