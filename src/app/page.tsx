export default function GenerationPage() {
  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-6">Génération de Mockups</h1>
      
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
        {/* Panneau de gauche : Sélection */}
        <div className="col-span-3 bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Modèle</h2>
            <div className="bg-white p-4 rounded border">
              Sélection du modèle...
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Motif</h2>
            <div className="bg-white p-4 rounded border">
              Sélection du motif...
            </div>
          </div>
        </div>

        {/* Zone centrale : Prévisualisation */}
        <div className="col-span-6 bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Prévisualisation</h2>
          <div className="bg-white h-[calc(100%-40px)] rounded border flex items-center justify-center">
            Sélectionnez un modèle et un motif pour prévisualiser
          </div>
        </div>

        {/* Panneau de droite : Actions */}
        <div className="col-span-3 bg-gray-50 rounded-lg p-4">
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            Générer toutes les variantes
          </button>
        </div>
      </div>
    </div>
  );
}