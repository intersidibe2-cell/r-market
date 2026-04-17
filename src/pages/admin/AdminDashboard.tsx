import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, ShoppingCart, Users, TrendingUp, DollarSign, Truck, 
  ArrowUp, ArrowDown, Clock, CheckCircle, XCircle, AlertCircle,
  Eye, Phone, MessageCircle, Search, Filter, RefreshCw, Plus,
  BarChart3, Wallet, PackageCheck, PackageX, MapPin, Calendar,
  ArrowRight, ShoppingBag, Receipt
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  deliveredOrders: number
  totalClients: number
  todayOrders: number
  todayRevenue: number
}

interface RecentOrder {
  id: string
  order_number: string
  client_name: string
  client_phone: string
  total: number
  status: string
  type: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalClients: 0,
    todayOrders: 0,
    todayRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    
    // Load orders
    const { data: orders } = await supabase
      .from('commandes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Load clients
    const { data: clients } = await supabase
      .from('clients')
      .select('*')

    if (orders) {
      const today = new Date().toDateString()
      const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today)
      
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        totalClients: clients?.length || 0,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      })

      setRecentOrders(orders.slice(0, 8))
    }
    
    setLastUpdate(new Date())
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'confirmed': return 'bg-blue-100 text-blue-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'ready_for_delivery': return 'bg-indigo-100 text-indigo-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'confirmed': return 'Confirmé'
      case 'shipped': return 'Expédié'
      case 'ready_for_delivery': return 'Prêt'
      case 'delivered': return 'Livré'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  const quickActions = [
    { label: 'Nouvelle commande', icon: Plus, link: '/shop', color: 'bg-green-600' },
    { label: 'Commandes', icon: ShoppingCart, link: '/admin-panel/orders', color: 'bg-blue-600' },
    { label: 'Produits', icon: Package, link: '/admin-panel/products', color: 'bg-purple-600' },
    { label: 'Clients', icon: Users, link: '/admin-panel/customers', color: 'bg-orange-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard R-Market</h1>
          <p className="text-gray-500 text-sm">Gestion complète de votre e-commerce</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Mis à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </span>
          <button 
            onClick={loadDashboardData}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.link}
            className={`${action.color} text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <action.icon className="w-5 h-5" />
            <span className="font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus du jour</p>
        </div>

        {/* Today's Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <Receipt className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayOrders}</p>
          <p className="text-sm text-white/80">Commandes aujourd'hui</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Action requise</span>
          </div>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          <p className="text-sm text-white/80">Commandes en attente</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus global</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <ShoppingBag className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-xs text-gray-500">Total commandes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageCheck className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.deliveredOrders}</p>
          <p className="text-xs text-gray-500">Livrées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Users className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.totalClients}</p>
          <p className="text-xs text-gray-500">Clients</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Wallet className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.totalRevenue > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0} F</p>
          <p className="text-xs text-gray-500">Panier moyen</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageX className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">
            {stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500">Taux livraison</p>
        </div>
        <Link to="/admin-panel/orders" className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-400 mb-2" />
          <p className="text-xl font-bold text-gray-900">→</p>
          <p className="text-xs text-gray-500">Voir tout</p>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            Commandes récentes
          </h2>
          <Link 
            to="/admin-panel/orders" 
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Voir toutes les commandes →
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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Téléphone</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
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
                          {order.type === 'russian' ? '🇷🇺 RU' : '🇲🇱 ML'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{order.client_name}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{order.client_phone}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-green-600">{order.total?.toLocaleString()} F</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          to="/admin-panel/orders" 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <a 
                          href={`https://wa.me/${order.client_phone?.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a 
                          href={`tel:${order.client_phone}`}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Appeler"
                        >
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

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link 
          to="/admin-panel/russian-orders" 
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇷🇺</span>
            <div>
              <p className="font-bold">Commandes Russes</p>
              <p className="text-xs text-blue-200">Gérer les commandes</p>
            </div>
          </div>
        </Link>
        
        <Link 
          to="/admin-panel/products" 
          className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white hover:from-purple-700 hover:to-purple-800 transition-all"
        >
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <p className="font-bold">Produits</p>
              <p className="text-xs text-purple-200">Gérer le catalogue</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/admin-panel/suppliers" 
          className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 text-white hover:from-orange-700 hover:to-orange-800 transition-all"
        >
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <p className="font-bold">Fournisseurs</p>
              <p className="text-xs text-orange-200">Gérer les fournisseurs</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/admin-panel/delivery" 
          className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl p-4 text-white hover:from-cyan-700 hover:to-cyan-800 transition-all"
        >
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8" />
            <div>
              <p className="font-bold">Livraisons</p>
              <p className="text-xs text-cyan-200">Suivre les livraisons</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
