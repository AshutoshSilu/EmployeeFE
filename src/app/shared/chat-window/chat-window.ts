import { Component, HostListener, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.html',
  styleUrls: ['./chat-window.scss']
})
export class ChatWindowComponent {
  private chatService = inject(ChatService);
  
  isOpen = false;
  newMessage = '';
  messages = computed(() => this.chatService.getMessages()());
  unreadCount = computed(() => this.chatService.getUnreadCount()());
  
  constructor() {
    // Auto-scroll to bottom when new messages arrive
    effect(() => {
      this.messages();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.chatService.markAsRead();
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  closeChat() {
    this.isOpen = false;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageText = this.newMessage;
      this.chatService.addMessage(messageText, 'user');
      this.newMessage = '';
      
      // Simulate support response
      this.chatService.simulateSupportResponse(messageText);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const chatContainer = document.querySelector('.chat-container');
    const chatBubble = document.querySelector('.chat-bubble');
    
    if (this.isOpen && chatContainer && !chatContainer.contains(target) && !chatBubble?.contains(target)) {
      this.closeChat();
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
  
  private scrollToBottom() {
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
}