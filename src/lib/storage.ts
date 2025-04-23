import { supabase } from './supabase';

/**
 * Uploads an image and returns a data URL
 * @param file The file to upload
 * @returns A data URL representation of the image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'reports',
  folder: string = 'report-photos'
): Promise<string | null> {
  try {
    // Always use data URL encoding for simplicity and to avoid permission issues
    // This stores the image directly in the database instead of as a separate file
    return convertToDataURL(file);
  } catch (error) {
    console.error("Image conversion failed:", error);
    return null;
  }
}

/**
 * Converts a file to a data URL
 * @param file The file to convert
 * @returns A Promise that resolves to the data URL
 */
async function convertToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
