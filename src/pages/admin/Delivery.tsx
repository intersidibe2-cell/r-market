import { Truck, Package, Clock, CheckCircle } from 'lucide-react'

export default function Delivery() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Livraisons</h1>
        <p className="text-gray-500 text-sm">Suivi des livraisons</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Truck className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">En cours</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Clock className="w-8 h-8 text-yellow-500 mb-2" />
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">5</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-sm text-gray-500">Livrées aujourd'hui</p>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Package className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">25</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <p className="text-gray-500 text-center py-8">Module de livraison en cours de développement</p>
      </div>
    </div>
  )
}
