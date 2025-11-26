import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule],
  templateUrl: './chatWindow.html',
  styleUrls: ['./chatWindow.scss']
})
export class ChatWindowComponent implements OnInit {
  chatUsers = signal<ChatUser[]>([]);
  selectedUser = signal<ChatUser | null>(null);

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadChatUsers();
  }

  loadChatUsers() {
    const mockUsers: ChatUser[] = [
      {
        id: 1,
        name: 'John Doe',
        avatar: 'assets/UserImage/1.png',
        lastMessage: 'Hi, I need help with my order',
        timestamp: new Date(Date.now() - 5 * 60000),
        unreadCount: 2,
        isOnline: true
      },
      {
        id: 2,
        name: 'Sarah Wilson',
        avatar: 'assets/UserImage/1.png',
        lastMessage: 'Thank you for your help!',
        timestamp: new Date(Date.now() - 15 * 60000),
        unreadCount: 0,
        isOnline: true
      },
      {
        id: 3,
        name: 'Mike Johnson',
        avatar: 'assets/UserImage/1.png',
        lastMessage: 'When will my food arrive?',
        timestamp: new Date(Date.now() - 30 * 60000),
        unreadCount: 1,
        isOnline: false
      },
      {
        id: 4,
        name: 'Emma Brown',
        avatar: 'assets/UserImage/1.png',
        lastMessage: 'Can I change my delivery address?',
        timestamp: new Date(Date.now() - 45 * 60000),
        unreadCount: 3,
        isOnline: true
      }
    ];
    
    this.chatUsers.set(mockUsers);
  }

  selectUser(user: ChatUser) {
    this.selectedUser.set(user);
    // Mark messages as read
    this.chatUsers.update(users => 
      users.map(u => u.id === user.id ? { ...u, unreadCount: 0 } : u)
    );
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  }

  logout() {
    this.router.navigate(['/support']);
  }
}