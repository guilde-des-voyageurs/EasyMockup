import { supabase } from '@/lib/supabase';

export interface Motif {
  id: string;
  nom: string;
  variantes: Variante[];
}

export interface Variante {
  id: string;
  nom: string;
  imageUrl?: string;
  file?: File;  // Pour l'upload temporaire
  associations: Association[];
}

export interface Association {
  id: string;
  modele: string;
  couleur: string;
}

export const motifsService = {
  // Récupérer tous les motifs avec leurs variantes et associations
  async getAllMotifs(): Promise<Motif[]> {
    const { data: motifs, error } = await supabase
      .from('motifs')
      .select(`
        id,
        nom,
        variantes (
          id,
          nom,
          image_url,
          associations (
            id,
            modele,
            couleur
          )
        )
      `);

    if (error) throw error;
    return motifs || [];
  },

  // Créer un nouveau motif
  async createMotif(nom: string): Promise<string> {
    const { data, error } = await supabase
      .from('motifs')
      .insert({ nom })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },
// Ajouter une variante à un motif
async addVariante(motifId: string, nom: string, imageFile: File): Promise<string> {
  try {
    // 1. Nettoyer le nom du fichier
    const fileExt = imageFile.name.split('.').pop();
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log('Uploading file:', cleanFileName);

    // 2. Upload de l'image
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('variantes-images')
      .upload(cleanFileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: imageFile.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', uploadData);

    // 3. Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('variantes-images')
      .getPublicUrl(cleanFileName);

    console.log('Public URL:', publicUrl);

    // 4. Créer la variante
    const { data, error } = await supabase
      .from('variantes')
      .insert({
        motif_id: motifId,
        nom,
        image_url: publicUrl
      })
      .select('id')
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Complete error:', error);
    throw error;
  }
},

  // Ajouter une association
  async addAssociation(varianteId: string, modele: string, couleur: string): Promise<void> {
    const { error } = await supabase
      .from('associations')
      .insert({
        variante_id: varianteId,
        modele,
        couleur
      });

    if (error) throw error;
  }
};