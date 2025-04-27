// Image validation middleware for API routes
export interface ImageValidationOptions {
  maxSizeBytes?: number;  // Maximum file size in bytes
  allowedMimeTypes?: string[]; // List of allowed MIME types
}

const defaultOptions: ImageValidationOptions = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

export class ImageValidationError extends Error {
  status: number;
  
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'ImageValidationError';
    this.status = status;
  }
}

/**
 * Validates an image URL or Base64 string
 * @param imageData URL or Base64 string of an image
 * @param options Validation options
 */
export async function validateImage(
  imageData: string,
  options: ImageValidationOptions = defaultOptions
): Promise<boolean> {
  const opts = { ...defaultOptions, ...options };
  
  // Check if it's a URL or Base64
  if (imageData.startsWith('data:')) {
    return validateBase64Image(imageData, opts);
  } else if (imageData.startsWith('http')) {
    return validateImageUrl(imageData, opts);
  }
  
  throw new ImageValidationError('Invalid image format. Must be a URL or Base64 data.');
}

/**
 * Validates a Base64 encoded image
 */
async function validateBase64Image(
  base64Data: string,
  options: ImageValidationOptions
): Promise<boolean> {
  // Check MIME type from data URL
  const mimeMatch = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  
  if (!mimeMatch) {
    throw new ImageValidationError('Invalid Base64 image format');
  }
  
  const mimeType = mimeMatch[1];
  
  // Check if MIME type is allowed
  if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(mimeType)) {
    throw new ImageValidationError(
      `Invalid image type. Allowed types: ${options.allowedMimeTypes.join(', ')}`
    );
  }
  
  // Check file size
  const base64Content = base64Data.split(',')[1];
  const sizeInBytes = Math.ceil((base64Content.length * 3) / 4);
  
  if (options.maxSizeBytes && sizeInBytes > options.maxSizeBytes) {
    throw new ImageValidationError(
      `Image size exceeds maximum allowed size of ${options.maxSizeBytes / (1024 * 1024)}MB`
    );
  }
  
  return true;
}

/**
 * Validates an image from a URL
 */
async function validateImageUrl(
  url: string,
  options: ImageValidationOptions
): Promise<boolean> {
  try {
    // Fetch image headers
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      throw new ImageValidationError('Failed to validate image URL');
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || 
        (options.allowedMimeTypes && !options.allowedMimeTypes.includes(contentType))) {
      throw new ImageValidationError(
        `Invalid image type. Allowed types: ${options.allowedMimeTypes?.join(', ')}`
      );
    }
    
    // Check file size
    const contentLength = response.headers.get('content-length');
    if (contentLength && options.maxSizeBytes && 
        parseInt(contentLength, 10) > options.maxSizeBytes) {
      throw new ImageValidationError(
        `Image size exceeds maximum allowed size of ${options.maxSizeBytes / (1024 * 1024)}MB`
      );
    }
    
    return true;
  } catch (error) {
    if (error instanceof ImageValidationError) {
      throw error;
    }
    throw new ImageValidationError('Failed to validate image URL');
  }
}
