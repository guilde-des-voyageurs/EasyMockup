'use client';

import { useState } from 'react';
import Modal from '../Modal';
import ImageUpload from '../ImageUpload';

interface Variante {
  id: string;
  nom: string;
  imageUrl?: string;
  file?: File;  // Ajout du champ pour stocker le fichier
  associations: {
    modele: string;
    couleur: string;
  }[];
}

interface MotifEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  motifInitial?: {
    id?: string;
    nom: string;
    variantes: Variante[];
  };
}

export default function MotifEditModal({ isOpen, onClose, motifInitial }: MotifEditModalProps) {
  const [nom, setNom] = useState(motifInitial?.nom || '');
  const [variantes, setVariantes] = useState<Variante[]>(motifInitial?.variantes || []);
  
  const ajouterVariante = () => {
    const nouvelleVariante: Variante = {
      id: Date.now().toString(),
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={motifInitial ? 'Éditer le Motif' : 'Nouveau Motif'}>
      <div className="space-y-6">
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
                  />
                  <button
                    onClick={() => supprimerVariante(variante.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>

                {/* Upload d'image avec le nouveau composant */}
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
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button className="text-sm text-blue-500 hover:text-blue-700 px-2 py-1 rounded border border-blue-200 hover:border-blue-300">
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
          >
            Annuler
          </button>
          <button
            onClick={() => {
              // TODO: Sauvegarder les modifications
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}