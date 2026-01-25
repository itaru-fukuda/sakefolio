-- Add image_url to variants and brands
-- This allows storing manually collected or user-uploaded representative images

-- Add image_url to brands (fallback)
alter table public.brands 
add column if not exists image_url text;

-- Add image_url to variants (specific product image)
alter table public.variants 
add column if not exists image_url text;

-- Create storage bucket for brand images if it doesn't exist? (Assuming 'images' bucket exists from drink logs logic?)
-- If not, we might need to rely on external URLs for now or use the existing bucket.
-- Typically for "collected from internet", admins might paste URLs. 
-- But uploading is better for persistence. 
-- Let's assume we can store public images in a 'public-assets' or similar bucket, or just 'images'.
