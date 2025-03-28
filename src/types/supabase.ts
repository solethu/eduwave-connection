
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
