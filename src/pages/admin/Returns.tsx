import { RefreshCw } from 'lucide-react'

export default function Returns() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Retours</h1><p className="text-gray-500 text-sm">Gestion des retours produits</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">En attente</p><p className="text-2xl font-bold text-yellow-600">3</p></div>
        <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">Approuvés</p><p className="text-2xl font-bold text-green-600">8</p></div>
        <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">Refusés</p><p className="text-2xl font-bold text-red-600">2</p></div>
      </div>
      <div className="bg-white rounded-2xl p-6 border"><p className="text-gray-500 text-center py-8">Module en cours de développement</p></div>
    </div>
  )
}
