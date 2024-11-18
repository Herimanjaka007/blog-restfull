import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload un fichier vers Supabase Storage.
 * @param {Buffer} fileBuffer - Le contenu du fichier sous forme de Buffer.
 * @param {string} fileName - Le nom unique du fichier.
 * @param {string} mimeType - Le type MIME du fichier.
 * @returns {Promise<string>} - URL publique du fichier.
 */
const uploadFileToSupabase = async (fileBuffer, fileName, mimeType) => {
  const bucket = "blog";
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
    });

  if (error) {
    throw new Error(`Erreur lors de l'upload vers Supabase : ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};

export default uploadFileToSupabase;