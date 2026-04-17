import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Check, X, Truck, Package, Clock, Filter, Phone, MessageCircle, RefreshCw, TrendingUp, DollarSign, PackageCheck, PackageX, ShoppingCart } from 'lucide-react'
import { supabase } from '../../lib/supabase'

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

const initialOrders: RussianOrder[] = []

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  confirmed: { label: 'Confirmé', color: 'text-blue-700', bg: 'bg-blue-100', icon: Check },
  shipped: { label: 'Expédié', color: 'text-purple-700', bg: 'bg-purple-100', icon: Truck },
  delivered: { label: 'Livré', color: 'text-green-700', bg: 'bg-green-100', icon: Package },
  cancelled: { label: 'Annulé', color: 'text-red-700', bg: 'bg-red-100', icon: X },
}

export default function RussianOrders() {
  const [orders, setOrders] = useState<RussianOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<RussianOrder | null>(null)

  // Load orders from Supabase
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .eq('type', 'russian')
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data.map((order: any) => ({
        id: order.id,
        orderCode: order.order_number,
        customer: order.client_name,
        phone: order.client_phone,
        address: order.client_address || '',
        items: (JSON.parse(order.items || '[]') as any[]).map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        total: order.total,
        totalEUR: order.total / 650, // Approximate conversion
        status: order.status || 'pending',
        date: new Date(order.created_at).toLocaleDateString('fr-FR'),
        base: order.client_address?.split(',')[0] || '',
        paymentMethod: 'Espèces'
      })))
    }
    setLoading(false)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Update status in Supabase
  const updateOrderStatus = async (orderId: string, newStatus: RussianOrder['status']) => {
    await supabase
      .from('commandes')
      .update({ status: newStatus })
      .eq('order_number', orderId)
    
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  // Call client
  const callClient = (order: RussianOrder) => {
    window.open(`tel:${order.phone}`, '_blank')
  }

  // WhatsApp client
  const whatsappClient = (order: RussianOrder) => {
    window.open(`https://wa.me/${order.phone.replace(/\D/g, '')}`, '_blank')
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    todayOrders: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length,
    todayRevenue: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).reduce((s, o) => s + o.total, 0),
  }

  const quickActions = [
    { label: 'Produits', icon: Package, link: '/admin-panel/russian-products', color: 'bg-purple-600' },
    { label: 'Dashboard', icon: TrendingUp, link: '/admin-panel/dashboard', color: 'bg-blue-600' },
    { label: 'Analytics', icon: TrendingUp, link: '/admin-panel/analytics', color: 'bg-indigo-600' },
    { label: 'Mali Orders', icon: ShoppingCart, link: '/admin-panel/orders', color: 'bg-green-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🇷🇺</span>
            Commandes Boutique Russe
          </h1>
          <p className="text-gray-500 text-sm mt-1">{stats.total} commandes militaires</p>
        </div>
        <button 
          onClick={loadOrders}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center gap-2"
          title="Actualiser"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.link}
            className={`${action.color} text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <action.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus du jour</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <ShoppingCart className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayOrders}</p>
          <p className="text-sm text-white/80">Commandes aujourd'hui</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Action requise</span>
          </div>
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-sm text-white/80">En attente</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.revenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus global</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageCheck className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Check className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.confirmed}</p>
          <p className="text-xs text-gray-500">Confirmées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Truck className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.shipped}</p>
          <p className="text-xs text-gray-500">Expédiées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageCheck className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
          <p className="text-xs text-gray-500">Livrées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageX className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{orders.filter(o => o.status === 'cancelled').length}</p>
          <p className="text-xs text-gray-500">Annulées</p>
        </div>
        <Link to="/admin-panel/orders" className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-center">
          <span className="text-2xl">🇲🇱</span>
        </Link>
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
                        <button
                          onClick={() => callClient(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Appeler"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => whatsappClient(order)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="WhatsApp client"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const itemsList = order.items.map(item => `• ${item.name} x${item.qty} = ${item.price} CFA`).join('%0A')
                            const message = `🛒 R-MARKET COMMANDE - ${order.orderCode}%0A%0AClient: ${order.customer}%0AAdresse: ${order.address}%0A%0AArticles:%0A${itemsList}%0A%0ATotal: ${order.total} CFA`
                            window.open(`https://wa.me/?text=${message}`, '_blank')
                          }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                          title="Transmettre commande"
                        >
                          <Truck className="w-4 h-4" />
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
