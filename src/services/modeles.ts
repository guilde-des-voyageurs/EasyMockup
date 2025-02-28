'use client';

import { supabase } from '@/lib/supabase';

export interface ElementSuperposable {
  id: string;
  nom: string;
  imageUrl?: string;
  positionX: number;
  positionY: number;
}

export interface Couleur {
  id: string;
  nom: string;
  imageUrl: string;
}

export interface Modele {
  id: string;
  nom: string;
  couleurs: Couleur[];
  elementsSuperposables: ElementSuperposable[];
}

export const modelesService = {
  // Récupérer tous les modèles avec leurs couleurs et éléments
  async getAllModeles(): Promise<Modele[]> {
    const { data, error } = await supabase
      .from('modeles')
      .select(`
        id,
        nom,
        couleurs (
          id,
          nom,
          image_url
        ),
        elements_superposables (
          id,
          nom,
          image_url,
          position_x,
          position_y
        )
      `);

    if (error) throw error;

    return data.map(modele => ({
      id: modele.id,
      nom: modele.nom,
      couleurs: modele.couleurs.map((c: any) => ({
        id: c.id,
        nom: c.nom,
        imageUrl: c.image_url
      })),
      elementsSuperposables: modele.elements_superposables.map((e: any) => ({
        id: e.id,
        nom: e.nom,
        imageUrl: e.image_url,
        positionX: e.position_x,
        positionY: e.position_y
      }))
    }));
  },

  // Créer un nouveau modèle
  async createModele(nom: string): Promise<string> {
    const { data, error } = await supabase
      .from('modeles')
      .insert({ nom })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  // Mettre à jour un modèle
  async updateModele(modeleId: string, nom: string): Promise<void> {
    const { error } = await supabase
      .from('modeles')
      .update({ nom })
      .eq('id', modeleId);

    if (error) throw error;
  },

  // Supprimer un modèle
  async deleteModele(modeleId: string): Promise<void> {
    const { error } = await supabase
      .from('modeles')
      .delete()
      .eq('id', modeleId);

    if (error) throw error;
  },

  // Ajouter une couleur à un modèle
  async addCouleur(modeleId: string, nom: string, imageFile: File): Promise<string> {
    try {
      // 1. Upload de l'image
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('bases-textiles')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 2. Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('bases-textiles')
        .getPublicUrl(fileName);

      // 3. Créer l'entrée dans la base de données
      const { data, error } = await supabase
        .from('couleurs')
        .insert({
          modele_id: modeleId,
          nom,
          image_url: publicUrl
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error in addCouleur:', error);
      throw error;
    }
  },

  // Supprimer une couleur
  async deleteCouleur(couleurId: string): Promise<void> {
    try {
      // 1. Récupérer l'URL de l'image
      const { data: couleur, error: selectError } = await supabase
        .from('couleurs')
        .select('image_url')
        .eq('id', couleurId)
        .single();

      if (selectError) throw selectError;

      // 2. Extraire le nom du fichier de l'URL
      if (couleur?.image_url) {
        const fileName = couleur.image_url.split('/').pop();
        if (fileName) {
          // 3. Supprimer l'image du bucket
          const { error: deleteStorageError } = await supabase.storage
            .from('bases-textiles')
            .remove([fileName]);

          if (deleteStorageError) {
            console.error('Error deleting image:', deleteStorageError);
          }
        }
      }

      // 4. Supprimer l'entrée de la base de données
      const { error: deleteError } = await supabase
        .from('couleurs')
        .delete()
        .eq('id', couleurId);

      if (deleteError) throw deleteError;
    } catch (error) {
      console.error('Error in deleteCouleur:', error);
      throw error;
    }
  },

  async updateCouleur(
    couleurId: string, 
    nom: string, 
    imageFile?: File
  ): Promise<void> {
    try {
      const updateData: { nom: string; image_url?: string } = { nom };

      if (imageFile) {
        // 1. Upload de la nouvelle image
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('bases-textiles')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // 2. Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('bases-textiles')
          .getPublicUrl(fileName);

        updateData.image_url = publicUrl;

        // 3. Supprimer l'ancienne image
        const { data: oldCouleur } = await supabase
          .from('couleurs')
          .select('image_url')
          .eq('id', couleurId)
          .single();

        if (oldCouleur?.image_url) {
          const oldFileName = oldCouleur.image_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('bases-textiles')
              .remove([oldFileName]);
          }
        }
      }

      // 4. Mettre à jour la base de données
      const { error } = await supabase
        .from('couleurs')
        .update(updateData)
        .eq('id', couleurId);

      if (error) throw error;
    } catch (error) {
      console.error('Error in updateCouleur:', error);
      throw error;
    }
  },

  // Ajouter un élément superposable
  async addElementSuperposable(
    modeleId: string,
    nom: string,
    imageFile: File,
    positionX: number = 0,
    positionY: number = 0
  ): Promise<string> {
    // 1. Upload de l'image
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('elements-superposables')
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    // 2. Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('elements-superposables')
      .getPublicUrl(fileName);

    // 3. Créer l'élément superposable
    const { data, error } = await supabase
      .from('elements_superposables')
      .insert({
        modele_id: modeleId,
        nom,
        image_url: publicUrl,
        position_x: positionX,
        position_y: positionY
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  // Mettre à jour la position d'un élément superposable
  async updateElementPosition(
    elementId: string,
    positionX: number,
    positionY: number
  ): Promise<void> {
    const { error } = await supabase
      .from('elements_superposables')
      .update({
        position_x: positionX,
        position_y: positionY
      })
      .eq('id', elementId);

    if (error) throw error;
  },

  // Supprimer un élément superposable
  async deleteElementSuperposable(elementId: string): Promise<void> {
    // 1. Récupérer l'URL de l'image
    const { data: element } = await supabase
      .from('elements_superposables')
      .select('image_url')
      .eq('id', elementId)
      .single();

    if (element?.image_url) {
      const fileName = element.image_url.split('/').pop();
      // 2. Supprimer l'image du storage
      await supabase.storage
        .from('elements-superposables')
        .remove([fileName]);
    }

    // 3. Supprimer l'élément
    const { error } = await supabase
      .from('elements_superposables')
      .delete()
      .eq('id', elementId);

    if (error) throw error;
  }
};
