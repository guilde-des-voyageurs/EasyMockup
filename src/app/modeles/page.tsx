'use client';

import { useEffect, useState } from 'react';
import { modelesService, type Modele } from '@/services/modeles';
import ModeleEditModal from '@/components/modeles/ModeleEditModal';

export default function ModelesPage() {
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modeleEnEdition, setModeleEnEdition] = useState<Modele | null>(null);
  const [showNewModeleModal, setShowNewModeleModal] = useState(false);
  const [modeleASupprimer, setModeleASupprimer] = useState<Modele | null>(null);

  useEffect(() => {
    loadModeles();
  }, []);

  const loadModeles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modelesService.getAllModeles();
      setModeles(data);
    } catch (err) {
      console.error('Error loading modeles:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModele = async (modele: Modele) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${modele.nom}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await modelesService.deleteModele(modele.id);
      await loadModeles();
    } catch (err) {
      console.error('Error deleting modele:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modèles</h1>
        <button 
          onClick={() => setShowNewModeleModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Nouveau Modèle
        </button>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Liste des modèles */}
      <div className="grid grid-cols-1 gap-6">
        {modeles.map(modele => (
          <div key={modele.id} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{modele.nom}</h2>
                <p className="text-gray-600">
                  {modele.couleurs.length} bases textiles • {modele.elementsSuperposables.length} éléments superposables
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setModeleEnEdition(modele)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Éditer
                </button>
                <button 
                  onClick={() => handleDeleteModele(modele)}
                  className="text-red-500 hover:text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>

            {/* Bases textiles */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Bases Textiles</h3>
              <div className="grid grid-cols-2 gap-3">
                {modele.couleurs.map(couleur => (
                  <div key={couleur.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{couleur.nom}</h4>
                        <p className="text-sm text-gray-600">Base textile</p>
                      </div>
                      <div 
                        className="w-12 h-12 rounded" 
                        style={{ backgroundColor: couleur.codeHex }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Éléments superposables */}
            <div>
              <h3 className="font-medium mb-3">Éléments Superposables</h3>
              <div className="space-y-3">
                {modele.elementsSuperposables.map(element => (
                  <div key={element.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{element.nom}</h4>
                        <p className="text-sm text-gray-600">
                          Position: {element.positionX}, {element.positionY}
                        </p>
                      </div>
                      {element.imageUrl ? (
                        <img 
                          src={element.imageUrl} 
                          alt={element.nom}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <button className="text-sm text-blue-500 hover:text-blue-600">
                + Ajouter une base textile
              </button>
              <button className="text-sm text-blue-500 hover:text-blue-600 ml-4">
                + Ajouter un élément superposable
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      <ModeleEditModal
        isOpen={showNewModeleModal}
        onClose={() => setShowNewModeleModal(false)}
        onSuccess={() => {
          loadModeles();
          setShowNewModeleModal(false);
        }}
      />

      <ModeleEditModal
        isOpen={!!modeleEnEdition}
        onClose={() => setModeleEnEdition(null)}
        onSuccess={() => {
          loadModeles();
          setModeleEnEdition(null);
        }}
        modeleInitial={modeleEnEdition || undefined}
      />
    </div>
  );
}