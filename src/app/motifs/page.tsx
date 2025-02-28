'use client';

import { useState, useEffect } from 'react';
import MotifEditModal from '../../components/motifs/MotifEditModal';
import { motifsService, type Motif } from '../../services/motifs';

export default function MotifsPage() {
  const [modalOuvert, setModalOuvert] = useState(false);
  const [motifEnEdition, setMotifEnEdition] = useState<Motif | undefined>();
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const chargerMotifs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await motifsService.getAllMotifs();
      setMotifs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des motifs');
    } finally {
      setLoading(false);
    }
  };

  const supprimerMotif = async (motifId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce motif et toutes ses variantes ?')) {
      return;
    }

    try {
      setSuppressionEnCours(true);
      await motifsService.deleteMotif(motifId);
      await chargerMotifs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du motif');
    } finally {
      setSuppressionEnCours(false);
    }
  };

  const supprimerVariante = async (varianteId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette variante ?')) {
      return;
    }

    try {
      setSuppressionEnCours(true);
      await motifsService.deleteVariante(varianteId);
      await chargerMotifs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la variante');
    } finally {
      setSuppressionEnCours(false);
    }
  };

  useEffect(() => {
    chargerMotifs();
  }, []);

  const ouvrirNouveauMotif = () => {
    setMotifEnEdition(undefined);
    setModalOuvert(true);
  };

  const ouvrirEditionMotif = (motif: Motif) => {
    setMotifEnEdition(motif);
    setModalOuvert(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-600">Chargement des motifs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Motifs</h1>
        <button
          onClick={ouvrirNouveauMotif}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={suppressionEnCours}
        >
          Nouveau Motif
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Liste des motifs */}
      <div className="grid grid-cols-1 gap-6">
        {motifs.map((motif) => (
          <div key={motif.id} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{motif.nom}</h2>
                <p className="text-gray-600">{motif.variantes.length} variantes</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => ouvrirEditionMotif(motif)}
                  className="text-blue-500 hover:text-blue-600"
                  disabled={suppressionEnCours}
                >
                  Éditer
                </button>
                <button
                  onClick={() => supprimerMotif(motif.id)}
                  className="text-red-500 hover:text-red-600"
                  disabled={suppressionEnCours}
                >
                  Supprimer
                </button>
              </div>
            </div>

            {/* Variantes */}
            <div className="space-y-3">
              {motif.variantes.map((variante) => (
                <div key={variante.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-medium">{variante.nom}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded">
                        {variante.imageUrl && (
                          <img
                            src={variante.imageUrl}
                            alt={variante.nom}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <button
                        onClick={() => supprimerVariante(variante.id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={suppressionEnCours}
                      >
                        Supprimer
                      </button>
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
        ))}
      </div>

      {/* Modal d'édition */}
      <MotifEditModal
        isOpen={modalOuvert}
        onClose={() => setModalOuvert(false)}
        motifInitial={motifEnEdition}
        onSuccess={chargerMotifs}
      />
    </div>
  );
}