import { useState } from 'react'
import { Search, Eye, Check, X, Truck, Package, Clock, Filter } from 'lucide-react'

interface RussianOrder {
  id: string
  customer: string
  phone: string
  items: { name: string; qty: number; price: number }[]
  total: number
  totalEUR: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  address: string
  base: string
  paymentMethod: string
  orderCode: string
}

const initialOrders: RussianOrder[] = [
  { id: 'RU-001', customer: 'Иванов И.И.', phone: '+223 70 12 34 56', items: [{ name: 'Водка Столичная', qty: 2, price: 15000 }, { name: 'Шоколад Алёнка', qty: 3, price: 5000 }], total: 45000, totalEUR: 68.60, status: 'pending', date: '14/04/2026', address: 'Camp Alpha, Bâtiment 3', base: 'Camp Alpha', paymentMethod: 'Espèces', orderCode: 'RUS-7823' },
  { id: 'RU-002', customer: 'Петров А.В.', phone: '+223 66 78 90 12', items: [{ name: 'Икра красная', qty: 1, price: 35000 }], total: 35000, totalEUR: 53.36, status: 'confirmed', date: '14/04/2026', address: 'Hôtel Nord-Sud, Chambre 205', base: 'Hôtel Nord-Sud', paymentMethod: 'Carte', orderCode: 'RUS-4512' },
  { id: 'RU-003', customer: 'Сидоров К.М.', phone: '+223 77 34 56 78', items: [{ name: 'Матрёшка 5 фигур', qty: 2, price: 12000 }, { name: 'Чай русский', qty: 5, price: 3000 }], total: 39000, totalEUR: 59.45, status: 'shipped', date: '13/04/2026', address: 'Camp Echo, Zone B', base: 'Camp Echo', paymentMethod: 'Espèces', orderCode: 'RUS-9841' },
  { id: 'RU-004', customer: 'Козлов Д.С.', phone: '+223 65 90 12 34', items: [{ name: 'Set samovar', qty: 1, price: 85000 }], total: 85000, totalEUR: 129.58, status: 'delivered', date: '12/04/2026', address: 'Résidence Moderne, Villa 7', base: 'Résidence Moderne', paymentMethod: 'Virement', orderCode: 'RUS-2156' },
]

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  confirmed: { label: 'Confirmé', color: 'text-blue-700', bg: 'bg-blue-100', icon: Check },
  shipped: { label: 'Expédié', color: 'text-purple-700', bg: 'bg-purple-100', icon: Truck },
  delivered: { label: 'Livré', color: 'text-green-700', bg: 'bg-green-100', icon: Package },
  cancelled: { label: 'Annulé', color: 'text-red-700', bg: 'bg-red-100', icon: X },
}

export default function RussianOrders() {
  const [orders, setOrders] = useState<RussianOrder[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<RussianOrder | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: RussianOrder['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🇷🇺</span>
            Commandes Boutique Russe
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des commandes militaires</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Confirmées</p>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Expédiées</p>
          <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Livrées</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-red-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Revenus</p>
          <p className="text-xl font-bold">{stats.revenue.toLocaleString()} F</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, ID ou code commande..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'Toutes' : statusConfig[status]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="px-6 py-4">Code / Client</th>
                <th className="px-6 py-4">Base</th>
                <th className="px-6 py-4">Articles</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => {
                const StatusIcon = statusConfig[order.status]?.icon || Clock
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-blue-600">{order.orderCode}</p>
                        <p className="text-sm text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">{order.base}</span>
                      <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{order.items.length} article(s)</p>
                      <p className="text-xs text-gray-500">{order.items.map(i => i.name).slice(0, 2).join(', ')}...</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-600">{order.total.toLocaleString()} F</p>
                      <p className="text-xs text-gray-500">≈ {order.totalEUR} €</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200"
                          >
                            Confirmer
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200"
                          >
                            Expédier
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200"
                          >
                            Livré
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-red-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedOrder.orderCode}</h2>
                  <p className="text-white/80 text-sm">{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-semibold">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Base</p>
                  <p className="font-semibold">{selectedOrder.base}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paiement</p>
                  <p className="font-semibold">{selectedOrder.paymentMethod}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Adresse de livraison</p>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedOrder.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Articles</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qté: {item.qty}</p>
                      </div>
                      <p className="font-bold">{(item.price * item.qty).toLocaleString()} F</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold">Total</p>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{selectedOrder.total.toLocaleString()} F</p>
                    <p className="text-sm text-gray-500">≈ {selectedOrder.totalEUR} €</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
