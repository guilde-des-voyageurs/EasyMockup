'use client';

import { useState } from 'react';
import MotifEditModal from '@/components/motifs/MotifEditModal';

interface Motif {
  id: string;
  nom: string;
  variantes: {
    id: string;
    nom: string;
    imageUrl?: string;
    associations: {
      modele: string;
      couleur: string;
    }[];
  }[];
}

export default function MotifsPage() {
  const [modalOuvert, setModalOuvert] = useState(false);
  const [motifEnEdition, setMotifEnEdition] = useState<Motif | undefined>();

  const ouvrirNouveauMotif = () => {
    setMotifEnEdition(undefined);
    setModalOuvert(true);
  };

  const ouvrirEditionMotif = (motif: Motif) => {
    setMotifEnEdition(motif);
    setModalOuvert(true);
  };

  // Exemple de motif pour démonstration
  const motifExemple: Motif = {
    id: '1',
    nom: 'AVALON',
    variantes: [
      {
        id: '1',
        nom: 'Version Noire',
        associations: [
          { modele: 'Creator', couleur: 'Bordeaux' },
          { modele: 'Urban', couleur: 'Gris' }
        ]
      }
    ]
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Motifs</h1>
        <button 
          onClick={ouvrirNouveauMotif}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Nouveau Motif
        </button>
      </div>

      {/* Liste des motifs */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{motifExemple.nom}</h2>
              <p className="text-gray-600">{motifExemple.variantes.length} variantes</p>
            </div>
            <button 
              onClick={() => ouvrirEditionMotif(motifExemple)}
              className="text-blue-500 hover:text-blue-600"
            >
              Éditer
            </button>
          </div>

          {/* Variantes */}
          <div className="space-y-3">
            {motifExemple.variantes.map((variante) => (
              <div key={variante.id} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium">{variante.nom}</h3>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded">
                    {variante.imageUrl && (
                      <img 
                        src={variante.imageUrl} 
                        alt={variante.nom}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                </div>

                {/* Associations */}
                <div className="mt-3 space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">S'applique sur :</h4>
                  <div className="flex flex-wrap gap-2">
                    {variante.associations.map((assoc, idx) => (
                      <div key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center">
                        <span>{assoc.modele} - {assoc.couleur}</span>
                        <button className="ml-2 text-blue-500 hover:text-blue-700">×</button>
                      </div>
                    ))}
                    <button className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 rounded border border-blue-200 hover:border-blue-300">
                      + Ajouter une association
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal d'édition */}
      <MotifEditModal
        isOpen={modalOuvert}
        onClose={() => setModalOuvert(false)}
        motifInitial={motifEnEdition}
      />
    </div>
  );
}