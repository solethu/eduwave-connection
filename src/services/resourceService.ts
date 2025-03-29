
import { supabase } from "@/integrations/supabase/client";
import { formatFileSize } from "@/lib/utils"; // Using utils from the existing utils file
import { FileData, FolderData } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Get all folders
export async function getFolders() {
  try {
    const { data: folders, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return folders as FolderData[];
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
}

// Create a new folder
export async function createFolder(name: string, description: string, user: { name: string; email: string; avatar?: string }) {
  try {
    const newFolder = {
      id: uuidv4(),
      name,
      description,
      owner: user.name,
      owner_email: user.email,
      owner_avatar: user.avatar || null,
      created_at: new Date().toISOString(),
    };
    
    const { error } = await supabase
      .from('folders')
      .insert(newFolder);
    
    if (error) throw error;
    
    return { success: true, folder: newFolder };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { success: false, error };
  }
}

// Get files in a folder
export async function getFilesInFolder(folderId: string) {
  try {
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return files as FileData[];
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

// Upload a file to Supabase storage and add record to files table
export async function uploadFile(file: File, folderId: string, description: string, user: { name: string; email: string }) {
  try {
    // Generate unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folderId}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('resources')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('resources')
      .getPublicUrl(filePath);
    
    // Determine file type based on MIME type
    let fileType: 'video' | 'document' | 'image' | 'other' = 'other';
    if (file.type.startsWith('video/')) fileType = 'video';
    else if (file.type.startsWith('image/')) fileType = 'image';
    else if (file.type.includes('pdf') || file.type.includes('doc') || file.type.includes('txt')) fileType = 'document';
    
    // Create file record in database
    const fileRecord = {
      id: uuidv4(),
      name: file.name,
      type: fileType,
      size: file.size,
      size_formatted: formatFileSize(file.size),
      url: publicUrl,
      uploaded_by: user.name,
      created_at: new Date().toISOString(),
      folder_id: folderId,
      description: description || null,
    };
    
    const { error: dbError } = await supabase
      .from('files')
      .insert(fileRecord);
    
    if (dbError) throw dbError;
    
    return { success: true, file: fileRecord };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error };
  }
}

// Delete a file
export async function deleteFile(fileId: string, storagePath: string) {
  try {
    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from('resources')
      .remove([storagePath]);
    
    if (storageError) throw storageError;
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);
    
    if (dbError) throw dbError;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error };
  }
}
