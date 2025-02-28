'use client';

import { useState } from 'react';

interface AssociationSelectorProps {
  onAdd: (modele: string, couleur: string) => void;
  onCancel: () => void;
  error?: string | null;
}

// TODO: Ces données devraient venir de la page Modèles
const MODELES = [
  {
    nom: 'Creator',
    couleurs: ['Bordeaux', 'Noir', 'Marine', 'Blanc']
  },
  {
    nom: 'Urban',
    couleurs: ['Gris', 'Noir', 'Marine']
  }
];

export default function AssociationSelector({ onAdd, onCancel, error }: AssociationSelectorProps) {
  const [modeleSelectionne, setModeleSelectionne] = useState('');
  const [couleurSelectionnee, setCouleurSelectionnee] = useState('');

  const couleursDisponibles = MODELES.find(m => m.nom === modeleSelectionne)?.couleurs || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 absolute z-10 w-64">
      <h3 className="font-medium mb-4">Nouvelle Association</h3>
      
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Sélection du modèle */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modèle
        </label>
        <select
          value={modeleSelectionne}
          onChange={(e) => {
            setModeleSelectionne(e.target.value);
            setCouleurSelectionnee('');
          }}
          className="w-full border rounded-md py-1 px-2"
        >
          <option value="">Sélectionner un modèle</option>
          {MODELES.map(modele => (
            <option key={modele.nom} value={modele.nom}>
              {modele.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Sélection de la couleur */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Couleur
        </label>
        <select
          value={couleurSelectionnee}
          onChange={(e) => setCouleurSelectionnee(e.target.value)}
          disabled={!modeleSelectionne}
          className="w-full border rounded-md py-1 px-2"
        >
          <option value="">Sélectionner une couleur</option>
          {couleursDisponibles.map(couleur => (
            <option key={couleur} value={couleur}>
              {couleur}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-gray-600 hover:text-gray-800"
        >
          Annuler
        </button>
        <button
          onClick={() => {
            if (modeleSelectionne && couleurSelectionnee) {
              onAdd(modeleSelectionne, couleurSelectionnee);
            }
          }}
          disabled={!modeleSelectionne || !couleurSelectionnee}
          className={`px-3 py-1 rounded ${
            modeleSelectionne && couleurSelectionnee
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}