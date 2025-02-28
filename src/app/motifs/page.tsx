export default function MotifsPage() {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Motifs</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Nouveau Motif
          </button>
        </div>
  
        {/* Liste des motifs */}
        <div className="grid grid-cols-1 gap-6">
          {/* Exemple d'un motif avec ses variantes */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">AVALON</h2>
                <p className="text-gray-600">3 variantes</p>
              </div>
              <button className="text-blue-500 hover:text-blue-600">
                Éditer
              </button>
            </div>
  
            {/* Variantes */}
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Version Noire</h3>
                    <p className="text-sm text-gray-600">
                      Utilisé sur : Creator (Bordeaux), Urban (Gris)
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded">
                    {/* Preview de l'image */}
                  </div>
                </div>
              </div>
  
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Version Blanche</h3>
                    <p className="text-sm text-gray-600">
                      Utilisé sur : Creator (Noir), Urban (Marine)
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded">
                    {/* Preview de l'image */}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Actions */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <button className="text-sm text-blue-500 hover:text-blue-600">
                + Ajouter une variante
              </button>
              <button className="text-sm text-blue-500 hover:text-blue-600 ml-4">
                Gérer les associations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }