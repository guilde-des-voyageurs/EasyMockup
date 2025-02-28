'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { modelesService, type Couleur } from '@/services/modeles';
import { supabase } from '@/lib/supabase';
import Modal from '../Modal';
import { generateTempId } from '@/utils/ids';

interface TempCouleur extends Couleur {
  tempFile?: File;
}

export default function ModeleEditModal({
  isOpen,
  onClose,
  onSuccess,
  modeleInitial
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  modeleInitial?: { id: string; nom: string; couleurs: Couleur[] };
}) {
  const [nom, setNom] = useState(modeleInitial?.nom || '');
  const [couleurs, setCouleurs] = useState<TempCouleur[]>(modeleInitial?.couleurs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddColor, setShowAddColor] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      let modeleId = modeleInitial?.id;
      if (!modeleId) {
        modeleId = await modelesService.createModele(nom);
        
        // Ajouter toutes les couleurs pour un nouveau modèle
        for (const couleur of couleurs) {
          if (couleur.tempFile) {
            await modelesService.addCouleur(
              modeleId,
              couleur.nom,
              couleur.tempFile
            );
          }
        }
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
    if (!newColorName.trim() || !selectedFile) {
      setError('Le nom et l\'image sont requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (modeleInitial?.id) {
        const couleurId = await modelesService.addCouleur(
          modeleInitial.id,
          newColorName,
          selectedFile
        );

        const { data: { publicUrl } } = supabase.storage
          .from('bases-textiles')
          .getPublicUrl(selectedFile.name);

        setCouleurs([
          ...couleurs,
          { id: couleurId, nom: newColorName, imageUrl: publicUrl }
        ]);
      } else {
        // Pour un nouveau modèle, on stocke temporairement
        const newCouleur = { 
          id: generateTempId('couleur'),
          nom: newColorName,
          imageUrl: URL.createObjectURL(selectedFile),
          tempFile: selectedFile
        };
        setCouleurs([...couleurs, newCouleur]);
      }

      // Réinitialiser le formulaire
      setNewColorName('');
      setSelectedFile(null);
      setShowAddColor(false);
    } catch (err) {
      console.error('Error adding color:', err);
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
            <h3 className="font-medium">Couleur</h3>
            <button
              onClick={() => setShowAddColor(true)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              + Ajouter
            </button>
          </div>

          {/* Liste des couleurs */}
          <div className="space-y-3">
            {couleurs.map(couleur => (
              <div key={couleur.id} className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{couleur.nom}</h4>
                    <p className="text-sm text-gray-600">Couleur</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img 
                      src={couleur.imageUrl}
                      alt={couleur.nom}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <button
                      onClick={() => {
                        setCouleurs(couleurs.filter(c => c.id !== couleur.id));
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire d'ajout de couleur */}
          {showAddColor && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h4 className="font-medium mb-3">Nouvelle couleur</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="w-full border rounded-md py-2 px-3"
                    placeholder="Ex: Rouge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <input {...getInputProps()} />
                    {selectedFile ? (
                      <div>
                        <p className="text-sm text-gray-600">{selectedFile.name}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="text-red-500 text-sm mt-2"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        {isDragActive ? 
                          'Déposez l\'image ici...' : 
                          'Cliquez ou déposez une image ici'
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddColor(false);
                      setNewColorName('');
                      setSelectedFile(null);
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={ajouterCouleur}
                    className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? 'Ajout...' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
