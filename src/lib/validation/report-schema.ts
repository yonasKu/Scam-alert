import { z } from "zod";

// Define the schema for report validation
export const reportSchema = z.object({
  // Required fields
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be 100 characters or less"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be 1000 characters or less"),
  business_name: z.string().min(2, "Business name must be at least 2 characters").max(100, "Business name must be 100 characters or less"),
  location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location must be 100 characters or less"),
  
  // Optional fields with proper typing
  category: z.string().min(2).max(50).optional(),
  report_type: z.string().min(2).max(50).optional(),
  receipt_issue_type: z.string().max(50).optional(),
  
  // Price fields (if present, must be numbers)
  price_before: z.number().positive().optional(),
  price_after: z.number().positive().optional(),
  
  // Image URL field (optional)
  image_url: z.string().url("Must be a valid URL").optional(),
  photo_url: z.string().url("Must be a valid URL").optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  
  // Timestamps - handled by the database
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Export type based on the schema
export type ReportInput = z.infer<typeof reportSchema>;
