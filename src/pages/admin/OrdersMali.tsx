import { ShoppingCart, Search, Eye, Check, X, Truck } from 'lucide-react'

const orders = [
  { id: 'CMD-001', customer: 'Moussa Dembélé', phone: '+223 70 12 34 56', total: 35000, status: 'pending', date: '14/04/2026', items: 3 },
  { id: 'CMD-002', customer: 'Aminata Koné', phone: '+223 66 78 90 12', total: 125000, status: 'delivered', date: '13/04/2026', items: 5 },
  { id: 'CMD-003', customer: 'Ibrahim Touré', phone: '+223 77 34 56 78', total: 85500, status: 'shipped', date: '14/04/2026', items: 2 },
  { id: 'CMD-004', customer: 'Fatou Sangaré', phone: '+223 65 90 12 34', total: 42000, status: 'pending', date: '14/04/2026', items: 4 },
]

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  confirmed: { label: 'Confirmée', color: 'text-blue-700', bg: 'bg-blue-100' },
  shipped: { label: 'Expédiée', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Livrée', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Annulée', color: 'text-red-700', bg: 'bg-red-100' },
}

export default function OrdersMali() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes Mali</h1>
          <p className="text-gray-500 text-sm">{orders.length} commandes</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Livrées</p>
          <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Chiffre d'affaires</p>
          <p className="text-2xl font-bold text-green-600">{orders.reduce((s, o) => s + o.total, 0).toLocaleString()} F</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Articles</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-bold">{order.id}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.phone}</p>
                </td>
                <td className="px-6 py-4">{order.items} article(s)</td>
                <td className="px-6 py-4 font-bold text-green-600">{order.total.toLocaleString()} F</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}>
                    {statusConfig[order.status]?.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
