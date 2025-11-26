import { Injectable, signal } from '@angular/core';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages = signal<ChatMessage[]>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: new Date()
    }
  ]);

  private unreadCount = signal(0);

  getMessages() {
    return this.messages.asReadonly();
  }

  getUnreadCount() {
    return this.unreadCount.asReadonly();
  }

  addMessage(text: string, sender: 'user' | 'support') {
    const newMessage: ChatMessage = {
      id: this.messages().length + 1,
      text,
      sender,
      timestamp: new Date()
    };

    this.messages.update(messages => [...messages, newMessage]);

    if (sender === 'support') {
      this.unreadCount.update(count => count + 1);
    }
  }

  markAsRead() {
    this.unreadCount.set(0);
  }

  simulateSupportResponse(userMessage: string) {
    setTimeout(() => {
      const responses = [
        'Thank you for your message. Our team will get back to you shortly.',
        'I understand your concern. Let me help you with that.',
        'That\'s a great question! Let me find the information for you.',
        'I\'m here to help. Could you provide more details?'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.addMessage(randomResponse, 'support');
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  }
}