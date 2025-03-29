
export interface FolderData {
  id: string;
  name: string;
  description?: string;
  owner: string;
  owner_email: string;
  owner_avatar?: string;
  created_at: string;
}

export interface FileData {
  id: string;
  name: string;
  type: 'video' | 'document' | 'image' | 'other';
  size: number;
  size_formatted: string;
  url: string;
  uploaded_by: string;
  created_at: string;
  folder_id: string;
  description?: string;
}

export interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
