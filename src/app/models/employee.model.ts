

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  image?: string;
}

export interface Menu {
  menuId: string;
  menuName: string;
  type: string;
  availability: string;
}

interface MenuItem {
  id: number;
  name: string;
  url: string;
  icon: string;
}


export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  autoClose?: boolean;
}


export interface AppState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}


interface MenuItem {
  id: number;
  name: string;
  url: string;
  icon: string;
}