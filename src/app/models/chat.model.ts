interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  userId: number;
}