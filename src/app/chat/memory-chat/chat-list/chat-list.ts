import { Component, inject } from '@angular/core';
import { MemoryChatService } from '../../services/memory-chat-service';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { NgClass } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-chat-list',
  imports: [Toolbar, Button, NgClass, SelectButtonModule, FormsModule, DrawerModule],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css',
})
export class ChatList {
  readonly memoryChatService = inject(MemoryChatService);
  isDrawerVisible = false;

  chats = this.memoryChatService.listAllChats;

  selectChat(chatId: string) {
    this.memoryChatService.selectChat(chatId);
    this.isDrawerVisible = false;
  }

  createNewChat() {
    this.memoryChatService.clearSelection();
    this.isDrawerVisible = false;
  }

  deleteChat(chatId: string, event: Event) {
    event.stopPropagation();
    console.log(`Delete chat with ID: ${chatId}`);
  }
}
