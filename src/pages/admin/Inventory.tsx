import { Warehouse, Package, AlertTriangle } from 'lucide-react'

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventaire</h1>
        <p className="text-gray-500 text-sm">Gestion des stocks</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Package className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">Total unités</p>
          <p className="text-2xl font-bold text-gray-900">2,450</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Warehouse className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-sm text-gray-500">En stock</p>
          <p className="text-2xl font-bold text-green-600">2,180</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <AlertTriangle className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-sm text-gray-500">Stock faible</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Package className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-500">Rupture</p>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <p className="text-gray-500 text-center py-8">Module d'inventaire en cours de développement</p>
      </div>
    </div>
  )
}
