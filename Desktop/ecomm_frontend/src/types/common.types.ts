export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor';
  avatarUrl?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
}
