import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function uploadFile(file) {
    return new Promise((resolve, reject) => {
        // Validation
        if (!file) {
            reject(new Error("Please select a file to upload."));
            return;
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            reject(new Error(`Invalid file type: ${file.type}. Allowed: JPEG, PNG, GIF, WebP`));
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            reject(new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds 5MB limit`));
            return;
        }

        const timeStamp = new Date().getTime();
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const fileName = `${timeStamp}_${randomSuffix}_${file.name}`;

        console.log("🔼 Uploading:", fileName, "| Size:", (file.size / 1024).toFixed(2) + "KB");

        supabase.storage
            .from("images")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type
            })
            .then((response) => {
                console.log("✅ Upload response:", response);
                
                if (response.error) {
                    throw new Error(response.error.message);
                }

                // Get public URL
                const { data } = supabase.storage.from("images").getPublicUrl(fileName);
                
                if (!data || !data.publicUrl) {
                    throw new Error("Failed to get public URL");
                }

                console.log("🔗 Public URL:", data.publicUrl);
                resolve(data.publicUrl);
            })
            .catch((error) => {
                console.error("❌ Error uploading file:", error);
                
                let errorMessage = "Error uploading file: ";
                
                if (error.message.includes("Bucket not found")) {
                    errorMessage += "Storage bucket 'images' not found. Create it in Supabase.";
                } else if (error.message.includes("Unauthorized")) {
                    errorMessage += "Unauthorized. Check Supabase credentials.";
                } else if (error.message.includes("CORS")) {
                    errorMessage += "CORS error. Check Supabase CORS settings.";
                } else {
                    errorMessage += error.message;
                }
                
                reject(new Error(errorMessage));
            });
    });
}