import { supabase } from './supabase';

/**
 * Uploads an image to Supabase storage
 * @param file The file to upload
 * @param bucket The bucket name to upload to
 * @param folder Optional folder path within the bucket
 * @returns The public URL of the uploaded file or null if upload failed
 */
export async function uploadImage(
  file: File,
  bucket: string = 'reports',
  folder: string = 'report-photos'
): Promise<string | null> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    // Create the bucket if it doesn't exist
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) {
        console.error("Error creating bucket:", error.message);
        return null;
      }
    }
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error("Storage operation failed:", error);
    return null;
  }
}

/**
 * Deletes an image from Supabase storage
 * @param url The public URL of the image to delete
 * @param bucket The bucket name
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteImage(
  url: string,
  bucket: string = 'reports'
): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
      
    if (error) {
      console.error("Error deleting file:", error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("File deletion failed:", error);
    return false;
  }
}
