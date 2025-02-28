export default function ModelesPage() {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Modèles</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Nouveau Modèle
          </button>
        </div>
  
        {/* Liste des modèles */}
        <div className="grid grid-cols-1 gap-6">
          {/* Exemple d'un modèle */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">T-Shirt Creator</h2>
                <p className="text-gray-600">7 bases textiles • 2 éléments superposables</p>
              </div>
              <button className="text-blue-500 hover:text-blue-600">
                Éditer
              </button>
            </div>
  
            {/* Bases textiles */}
            <div className="mb-6">
            <h3 className="font-medium mb-3">Bases Textiles</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center">
                    <div>
                    <h4 className="font-medium">Bordeaux</h4>
                    <p className="text-sm text-gray-600">Base textile</p>
                    </div>
                    <div className="w-12 h-12 bg-[#800020] rounded"></div>
                </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center">
                    <div>
                    <h4 className="font-medium">Noir</h4>
                    <p className="text-sm text-gray-600">Base textile</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded"></div>
                </div>
                </div>
            </div>
            </div>
  
            {/* Éléments superposables */}
            <div>
              <h3 className="font-medium mb-3">Éléments Superposables</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Étiquette de col</h4>
                      <p className="text-sm text-gray-600">z-index: 10</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
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
        </div>
      </div>
    );
  }