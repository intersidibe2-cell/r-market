import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, ShoppingCart, Users, TrendingUp, DollarSign, Truck, 
  Clock, CheckCircle, XCircle,
  Eye, Phone, MessageCircle, RefreshCw, Plus,
  Wallet, PackageCheck, PackageX, MapPin,
  ArrowRight, ShoppingBag, Receipt, Send, QrCode, AlertTriangle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  sentToSupplier: number
  pickedUp: number
  qrLabeled: number
  inDelivery: number
  deliveredOrders: number
  cancelledOrders: number
  unavailableOrders: number
  totalClients: number
  todayOrders: number
  todayRevenue: number
  totalProducts: number
}

interface RecentOrder {
  id: string
  order_number: string
  client_name: string
  client_phone: string
  total: number
  status: string
  type: string
  payment_method: string
  created_at: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  sent_to_supplier: { label: 'Chez fournisseur', color: 'text-orange-700', bg: 'bg-orange-100' },
  picked_up: { label: 'Recupere', color: 'text-blue-700', bg: 'bg-blue-100' },
  qr_labeled: { label: 'QR colle', color: 'text-purple-700', bg: 'bg-purple-100' },
  in_delivery: { label: 'En livraison', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  delivered: { label: 'Livre', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Annule', color: 'text-red-700', bg: 'bg-red-100' },
  unavailable: { label: 'Indisponible', color: 'text-gray-700', bg: 'bg-gray-200' },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0, totalRevenue: 0, pendingOrders: 0, sentToSupplier: 0,
    pickedUp: 0, qrLabeled: 0, inDelivery: 0, deliveredOrders: 0,
    cancelledOrders: 0, unavailableOrders: 0, totalClients: 0,
    todayOrders: 0, todayRevenue: 0, totalProducts: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => { loadDashboardData() }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    
    // Charger TOUTES les commandes (pas de limit!)
    const [ordersResult, clientsResult, productsResult] = await Promise.all([
      supabase.from('commandes').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      supabase.from('produits').select('id', { count: 'exact', head: true })
    ])

    const orders = ordersResult.data || []
    const today = new Date().toDateString()
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today)
    
    setStats({
      totalOrders: orders.length,
      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      sentToSupplier: orders.filter(o => o.status === 'sent_to_supplier').length,
      pickedUp: orders.filter(o => o.status === 'picked_up').length,
      qrLabeled: orders.filter(o => o.status === 'qr_labeled').length,
      inDelivery: orders.filter(o => o.status === 'in_delivery').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
      unavailableOrders: orders.filter(o => o.status === 'unavailable').length,
      totalClients: clientsResult.count || 0,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0),
      totalProducts: productsResult.count || 0,
    })

    setRecentOrders(orders.slice(0, 10))
    setLastUpdate(new Date())
    setLoading(false)
  }

  // Actions urgentes (commandes qui necessitent une action)
  const urgentCount = stats.pendingOrders + stats.sentToSupplier + stats.pickedUp

  return (
    <div className="space-y-6">
      {/* Lien rapide vers le panneau 双 administratif Mali+Russie */}
      <section className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Vue unifiée Admin</h2>
          <Link to="/admin/dual" className="px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Voir tout (Mali + Russie)</Link>
        </div>
        <p className="text-sm text-gray-600">Accèdez rapidement au panneau affichant Mali et Russie en une seule vue.</p>
      </section>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard R-Market</h1>
          <p className="text-gray-500 text-sm">Vue d'ensemble de votre e-commerce</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {lastUpdate.toLocaleTimeString('fr-FR')}
          </span>
          <button 
            onClick={loadDashboardData}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alerte actions urgentes */}
      {urgentCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-orange-800">
              {urgentCount} commande{urgentCount > 1 ? 's' : ''} necessitent votre attention
            </p>
            <p className="text-sm text-orange-600">
              {stats.pendingOrders > 0 && `${stats.pendingOrders} en attente`}
              {stats.sentToSupplier > 0 && ` | ${stats.sentToSupplier} chez fournisseur`}
              {stats.pickedUp > 0 && ` | ${stats.pickedUp} a etiqueter`}
            </p>
          </div>
          <Link to="/admin-panel/orders" className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 text-sm">
            Traiter
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/admin-panel/orders" className="bg-green-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium">Commandes</span>
        </Link>
        <Link to="/admin-panel/products" className="bg-purple-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Package className="w-5 h-5" />
          <span className="font-medium">Produits</span>
        </Link>
        <Link to="/admin-panel/suppliers" className="bg-orange-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Users className="w-5 h-5" />
          <span className="font-medium">Fournisseurs</span>
        </Link>
        <Link to="/admin-panel/customers" className="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Users className="w-5 h-5" />
          <span className="font-medium">Clients</span>
        </Link>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus du jour</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <Receipt className="w-8 h-8 opacity-80" />
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
          <p className="text-2xl font-bold">{urgentCount}</p>
          <p className="text-sm text-white/80">A traiter</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus global</p>
        </div>
      </div>

      {/* Workflow Pipeline - Vue des statuts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-green-600" />
          Pipeline des commandes
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <Link to="/admin-panel/orders" className="text-center p-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors">
            <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-yellow-700">{stats.pendingOrders}</p>
            <p className="text-xs text-yellow-600">En attente</p>
          </Link>
          <Link to="/admin-panel/orders" className="text-center p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
            <Send className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-orange-700">{stats.sentToSupplier}</p>
            <p className="text-xs text-orange-600">Fournisseur</p>
          </Link>
          <Link to="/admin-panel/orders" className="text-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
            <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{stats.pickedUp}</p>
            <p className="text-xs text-blue-600">Recupere</p>
          </Link>
          <Link to="/admin-panel/orders" className="text-center p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
            <QrCode className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-700">{stats.qrLabeled}</p>
            <p className="text-xs text-purple-600">QR colle</p>
          </Link>
          <Link to="/admin-panel/orders" className="text-center p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors">
            <Truck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-indigo-700">{stats.inDelivery}</p>
            <p className="text-xs text-indigo-600">Livraison</p>
          </Link>
          <Link to="/admin-panel/orders" className="text-center p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-700">{stats.deliveredOrders}</p>
            <p className="text-xs text-green-600">Livrees</p>
          </Link>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <ShoppingBag className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-xs text-gray-500">Total commandes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Package className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-xs text-gray-500">Produits</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Users className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.totalClients}</p>
          <p className="text-xs text-gray-500">Clients</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Wallet className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0} F</p>
          <p className="text-xs text-gray-500">Panier moyen</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageCheck className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">
            {stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500">Taux livraison</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageX className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.cancelledOrders + stats.unavailableOrders}</p>
          <p className="text-xs text-gray-500">Annulees</p>
        </div>
      </div>

      {/* Commandes recentes */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            Commandes recentes
          </h2>
          <Link to="/admin-panel/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Voir toutes →
          </Link>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">Chargement...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Aucune commande pour le moment</p>
            <Link to="/shop" className="text-green-600 font-medium mt-2 inline-block">
              Passer une commande test →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Commande</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Paiement</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{order.order_number}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.type === 'russian' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {order.type === 'russian' ? 'RU' : 'ML'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">{order.client_name}</p>
                      <p className="text-xs text-gray-500">{order.client_phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-green-600">{order.total?.toLocaleString()} F</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-500">{order.payment_method || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusConfig[order.status]?.bg || 'bg-gray-100'} ${statusConfig[order.status]?.color || 'text-gray-700'}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to="/admin-panel/orders" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <a 
                          href={`https://wa.me/${order.client_phone?.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a href={`tel:${order.client_phone}`} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/admin-panel/russian-orders" className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white hover:from-blue-700 hover:to-blue-800 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">RU</span>
            <div>
              <p className="font-bold">Commandes Russes</p>
              <p className="text-xs text-blue-200">Gerer les commandes</p>
            </div>
          </div>
        </Link>
        <Link to="/admin-panel/products" className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white hover:from-purple-700 hover:to-purple-800 transition-all">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <p className="font-bold">Produits</p>
              <p className="text-xs text-purple-200">Gerer le catalogue</p>
            </div>
          </div>
        </Link>
        <Link to="/admin-panel/suppliers" className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 text-white hover:from-orange-700 hover:to-orange-800 transition-all">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8" />
            <div>
              <p className="font-bold">Fournisseurs</p>
              <p className="text-xs text-orange-200">Gerer les fournisseurs</p>
            </div>
          </div>
        </Link>
        <Link to="/admin-panel/delivery-scan" className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl p-4 text-white hover:from-cyan-700 hover:to-cyan-800 transition-all">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8" />
            <div>
              <p className="font-bold">Livraisons</p>
              <p className="text-xs text-cyan-200">Scanner et livrer</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
