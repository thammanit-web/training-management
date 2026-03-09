import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are not fully configured in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const cleanEnvVar = (val: string | undefined, fallback: string) => {
    if (!val) return fallback;
    return val.replace(/^['"]|['"]$/g, '');
};

const bucketName = cleanEnvVar(process.env.BUCKET, 'training');
const folderName = cleanEnvVar(process.env.Folder, 'uploads');

/**
 * Uploads a file to Supabase Storage.
 * @param file The file to upload.
 * @returns The public URL of the uploaded file.
 */
export async function uploadFile(file: File | Blob, fileName: string): Promise<string> {
    const cleanFileName = fileName.replace(/\s+/g, '_');
    const filePath = `${folderName}/${Date.now()}-${cleanFileName}`;

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Supabase Upload Error:', error);
        throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return publicUrl;
}

/**
 * Deletes a file from Supabase Storage.
 * @param fileUrl The public URL of the file to delete.
 */
export async function deleteFile(fileUrl: string): Promise<void> {
    try {
        // Extract path from public URL
        // Public URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[folder]/[filename]
        const urlParts = fileUrl.split(`/storage/v1/object/public/${bucketName}/`);
        if (urlParts.length < 2) {
            console.warn('Could not extract file path from URL:', fileUrl);
            return;
        }

        const filePath = urlParts[1];
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            console.error('Supabase Delete Error:', error);
        }
    } catch (err) {
        console.error('Error in deleteFile service:', err);
    }
}
