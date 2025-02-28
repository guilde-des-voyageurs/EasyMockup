'use client';

import { useState } from 'react';
import Modal from '../Modal';
import ImageUpload from '../ImageUpload';
import { motifsService, type Motif, type Variante } from '@/services/motifs'; 

interface MotifEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  motifInitial?: Motif;
}

export default function MotifEditModal({ isOpen, onClose, onSuccess, motifInitial }: MotifEditModalProps) {
  const [nom, setNom] = useState(motifInitial?.nom || '');
  const [variantes, setVariantes] = useState<Variante[]>(motifInitial?.variantes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ajouterVariante = () => {
    const nouvelleVariante: Variante = {
      id: `temp-${Date.now()}`, // ID temporaire
      nom: `Variante ${variantes.length + 1}`,
      associations: []
    };
    setVariantes([...variantes, nouvelleVariante]);
  };

  const supprimerVariante = (id: string) => {
    setVariantes(variantes.filter(v => v.id !== id));
  };

  const handleImageChange = (varianteId: string, file: File) => {
    // Créer une URL temporaire pour la prévisualisation
    const imageUrl = URL.createObjectURL(file);
    
    const newVariantes = variantes.map(v =>
      v.id === varianteId ? { ...v, imageUrl, file } : v
    );
    setVariantes(newVariantes);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Créer ou mettre à jour le motif
      let motifId = motifInitial?.id;
      if (!motifId) {
        motifId = await motifsService.createMotif(nom);
      }

      // 2. Pour chaque variante
      for (const variante of variantes) {
        // Si la variante a un fichier, on l'upload
        if (variante.file) {
          await motifsService.addVariante(motifId, variante.nom, variante.file);
        }

        // Pour chaque association de la variante
        for (const assoc of variante.associations) {
          await motifsService.addAssociation(variante.id, assoc.modele, assoc.couleur);
        }
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={motifInitial ? 'Éditer le Motif' : 'Nouveau Motif'}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {/* Nom du motif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du motif
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: AVALON"
          />
        </div>

        {/* Liste des variantes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Variantes</h3>
            <button
              onClick={ajouterVariante}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              + Ajouter une variante
            </button>
          </div>

          <div className="space-y-4">
            {variantes.map((variante) => (
              <div key={variante.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={variante.nom}
                    onChange={(e) => {
                      const newVariantes = variantes.map(v =>
                        v.id === variante.id ? { ...v, nom: e.target.value } : v
                      );
                      setVariantes(newVariantes);
                    }}
                    className="px-2 py-1 border rounded"
                    placeholder="Nom de la variante"
                    disabled={loading}
                  />
                  <button
                    onClick={() => supprimerVariante(variante.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    Supprimer
                  </button>
                </div>

                {/* Upload d'image */}
                <div className="mb-3">
                  <ImageUpload
                    imageUrl={variante.imageUrl}
                    onImageChange={(file) => handleImageChange(variante.id, file)}
                  />
                </div>

                {/* Associations */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Associations</h4>
                  <div className="flex flex-wrap gap-2">
                    {variante.associations.map((assoc, idx) => (
                      <div key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm flex items-center">
                        <span>{assoc.modele} - {assoc.couleur}</span>
                        <button
                          onClick={() => {
                            const newAssociations = variante.associations.filter((_, i) => i !== idx);
                            const newVariantes = variantes.map(v =>
                              v.id === variante.id ? { ...v, associations: newAssociations } : v
                            );
                            setVariantes(newVariantes);
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      className="text-sm text-blue-500 hover:text-blue-700 px-2 py-1 rounded border border-blue-200 hover:border-blue-300"
                      disabled={loading}
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </Modal>
  );
}