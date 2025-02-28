'use client';

import { useState, useEffect } from 'react';
import Modal from '../Modal';
import { modelesService, type Modele, type Couleur, type ElementSuperposable } from '@/services/modeles';
import { generateTempId } from '@/utils/ids';

interface ModeleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  modeleInitial?: Modele;
}

export default function ModeleEditModal({ isOpen, onClose, onSuccess, modeleInitial }: ModeleEditModalProps) {
  const [nom, setNom] = useState(modeleInitial?.nom || '');
  const [couleurs, setCouleurs] = useState<Couleur[]>(modeleInitial?.couleurs || []);
  const [elements, setElements] = useState<ElementSuperposable[]>(modeleInitial?.elementsSuperposables || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  // Réinitialiser les états quand modeleInitial change
  useEffect(() => {
    setNom(modeleInitial?.nom || '');
    setCouleurs(modeleInitial?.couleurs || []);
    setElements(modeleInitial?.elementsSuperposables || []);
    setError(null);
  }, [modeleInitial]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Créer ou mettre à jour le modèle
      let modeleId = modeleInitial?.id;
      if (!modeleId) {
        modeleId = await modelesService.createModele(nom);
      } else {
        await modelesService.updateModele(modeleId, nom);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error submitting:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const ajouterCouleur = async () => {
    if (!newColorName.trim() || !newColorHex) {
      setError('Le nom et la couleur sont requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (modeleInitial?.id) {
        const couleurId = await modelesService.addCouleur(
          modeleInitial.id,
          newColorName,
          newColorHex
        );

        setCouleurs([
          ...couleurs,
          { id: couleurId, nom: newColorName, codeHex: newColorHex }
        ]);
      } else {
        // Pour un nouveau modèle, on stocke temporairement
        setCouleurs([
          ...couleurs,
          { 
            id: generateTempId('couleur'),
            nom: newColorName,
            codeHex: newColorHex
          }
        ]);
      }

      // Réinitialiser le formulaire
      setNewColorName('');
      setNewColorHex('#000000');
      setShowColorPicker(false);
    } catch (err) {
      console.error('Error adding color:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const supprimerCouleur = async (couleurId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!couleurId.startsWith('temp-')) {
        await modelesService.deleteCouleur(couleurId);
      }

      setCouleurs(couleurs.filter(c => c.id !== couleurId));
    } catch (err) {
      console.error('Error deleting color:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={modeleInitial ? 'Modifier le modèle' : 'Nouveau modèle'}
    >
      <div className="p-6">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {/* Nom du modèle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du modèle
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border rounded-md py-2 px-3"
            placeholder="Ex: T-Shirt Creator"
          />
        </div>

        {/* Couleurs */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Bases Textiles</h3>
            <button
              onClick={() => setShowColorPicker(true)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              + Ajouter une couleur
            </button>
          </div>

          {/* Liste des couleurs */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {couleurs.map(couleur => (
              <div key={couleur.id} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{couleur.nom}</h4>
                    <p className="text-sm text-gray-600">Base textile</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: couleur.codeHex }}
                    />
                    <button
                      onClick={() => supprimerCouleur(couleur.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire d'ajout de couleur */}
          {showColorPicker && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h4 className="font-medium mb-3">Nouvelle Base Textile</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="w-full border rounded-md py-1 px-2"
                    placeholder="Ex: Bordeaux"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-full h-10 p-1 rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowColorPicker(false);
                      setNewColorName('');
                      setNewColorHex('#000000');
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={ajouterCouleur}
                    disabled={!newColorName.trim() || !newColorHex}
                    className={`px-3 py-1 rounded ${
                      newColorName.trim() && newColorHex
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !nom.trim()}
            className={`px-4 py-2 rounded ${
              loading || !nom.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
