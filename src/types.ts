export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  userId: string;
  author: string;
  authorRole?: string;
  authorEmail?: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'Engineering' | 'Design' | 'Systems' | 'Architecture' | 'Philosophy' | 'Culture';
  readTime: number; // minutes
  likes: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
}

export type ViewMode = 'feed' | 'read' | 'dashboard' | 'auth';
