import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3,
  TrendingUp, Truck, Search, Plus, Trash2, Edit, Eye, Download,
  Bell, Calendar, Package2, X, DollarSign, ArrowLeft, Home
} from 'lucide-react'
import { products as initialProducts, categories, paymentMethods } from '../data/products'

const initialOrders = [
  { id: 'CMD-001', customer: 'Moussa Dembélé', phone: '+223 70 12 34 56', total: 65000, status: 'pending', date: '02/04/2026', items: 2, payment: 'Orange Money', address: 'Bamako, Quartier ACI' },
  { id: 'CMD-002', customer: 'Fatima Zohra', phone: '+223 66 78 90 12', total: 25800, status: 'shipped', date: '01/04/2026', items: 3, payment: 'Wave', address: 'Kayes, Rue 12' },
  { id: 'CMD-003', customer: 'Alpha Oumar', phone: '+223 77 34 56 78', total: 58000, status: 'pending', date: '31/03/2026', items: 1, payment: 'Orange Money', address: 'Kati, Hamdallaye' },
  { id: 'CMD-004', customer: 'Amina Diallo', phone: '+223 65 90 12 34', total: 48000, status: 'delivered', date: '30/03/2026', items: 1, payment: 'Moov Money', address: 'Ségou, Centre ville' },
  { id: 'CMD-005', customer: 'Mamadou Traoré', phone: '+223 78 45 67 89', total: 45000, status: 'shipped', date: '29/03/2026', items: 1, payment: 'Cash', address: 'Bamako, Badalabougou' },
  { id: 'CMD-006', customer: 'Ibrahim Koné', phone: '+223 79 23 45 67', total: 25000, status: 'pending', date: '28/03/2026', items: 1, payment: 'Wave', address: 'Mopti, Rue principale' },
  { id: 'CMD-007', customer: 'Aïssata Cissé', phone: '+223 71 56 78 90', total: 89000, status: 'delivered', date: '27/03/2026', items: 2, payment: 'Orange Money', address: 'Bamako, Djélibougou' },
]

const initialCustomers = [
  { id: 1, name: 'Moussa Dembélé', email: 'moussa@email.com', phone: '+223 70 12 34 56', city: 'Bamako', orders: 5, spent: 234000, lastOrder: '02/04/2026', status: 'active' },
  { id: 2, name: 'Fatima Zohra', email: 'fatima@email.com', phone: '+223 66 78 90 12', city: 'Kayes', orders: 3, spent: 89000, lastOrder: '01/04/2026', status: 'active' },
  { id: 3, name: 'Alpha Oumar', email: 'alpha@email.com', phone: '+223 77 34 56 78', city: 'Kati', orders: 8, spent: 456000, lastOrder: '31/03/2026', status: 'active' },
  { id: 4, name: 'Amina Diallo', email: 'amina@email.com', phone: '+223 65 90 12 34', city: 'Ségou', orders: 2, spent: 67000, lastOrder: '30/03/2026', status: 'inactive' },
  { id: 5, name: 'Mamadou Traoré', email: 'mamadou@email.com', phone: '+223 78 45 67 89', city: 'Bamako', orders: 4, spent: 178000, lastOrder: '29/03/2026', status: 'active' },
  { id: 6, name: 'Ibrahim Koné', email: 'ibrahim@email.com', phone: '+223 79 23 45 67', city: 'Mopti', orders: 1, spent: 25000, lastOrder: '28/03/2026', status: 'new' },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [orderFilter, setOrderFilter] = useState('all')
  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  const [orders, setOrders] = useState(initialOrders)
  const [products, setProducts] = useState(initialProducts)
  const [customers] = useState(initialCustomers)

  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', originalPrice: '', stock: '', image: '', description: '', category: 'mode' 
  })

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter)
  const searchedProducts = productSearch 
    ? products.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
    : products
  const searchedCustomers = customerSearch 
    ? customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch))
    : customers

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const totalSold = products.reduce((s, p) => s + (p.sold || 0), 0)
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0)
  const lowStock = products.filter((p) => p.stock < 20).length

  const addProduct = () => {
    const product: any = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price) * 1.3,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: newProduct.category || 'mode',
      description: newProduct.description,
      rating: 4.5,
      reviews: 0,
      stock: parseInt(newProduct.stock) || 100,
      sold: 0,
    }
    setProducts([...products, product])
    setNewProduct({ name: '', price: '', originalPrice: '', stock: '', image: '', description: '', category: 'mode' })
    setShowAddProduct(false)
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    shipped: { label: 'Expédié', color: 'text-blue-700', bg: 'bg-blue-100' },
    delivered: { label: 'Livré', color: 'text-green-700', bg: 'bg-green-100' },
    cancelled: { label: 'Annulé', color: 'text-red-700', bg: 'bg-red-100' },
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-green-800 to-green-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-green-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">R-Market</h1>
                <p className="text-xs text-green-200">Administration Mali</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {tabs.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-green-800 shadow-lg'
                    : 'text-green-100 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Administrateur</p>
                  <p className="text-xs text-green-200">Mali 🇲🇱</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setMobileSidebarOpen(true)}>
              <Package className="w-5 h-5" />
            </button>
            <Link to="/" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Page d'accueil">
              <Home className="w-5 h-5" />
            </Link>
            <Link to="/shop" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Boutique">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇲🇱</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Administration Mali</h2>
                <p className="text-sm text-gray-500">Gérez votre boutique R-Market</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/russian-admin" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
              Admin Russe 🇷🇺
            </Link>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
              🛒 Boutique
            </Link>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Revenus totaux</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">FCFA</p>
                  <div className="flex items-center gap-1 mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+12.5% ce mois</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Commandes</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-sm text-gray-500 mt-1">commandes</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{pendingOrders} en attente</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{shippedOrders} expédiées</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Produits</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                  <p className="text-sm text-gray-500 mt-1">produits en stock</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{totalStock} unités</span>
                    {lowStock > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{lowStock} bas stock</span>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Clients</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                  <p className="text-sm text-gray-500 mt-1">clients enregistrés</p>
                  <div className="flex items-center gap-1 mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+8 nouveaux ce mois</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button onClick={() => { setShowAddProduct(true); setActiveTab('products') }} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Ajouter produit</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Voir commandes</span>
                </button>
                <button onClick={() => setActiveTab('analytics')} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Statistiques</span>
                </button>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Commandes récentes</h3>
                    <p className="text-sm text-gray-500">Dernières commandes enregistrées</p>
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                    Voir tout <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                        <th className="px-6 py-4">Commande</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4 hidden sm:table-cell">Paiement</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <span className="font-semibold text-gray-900">{order.id}</span>
                              <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{order.customer[0]}</span>
                              </div>
                              <span className="font-medium text-gray-900">{order.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell text-gray-600 text-sm">{order.payment}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">{order.total.toLocaleString()} F</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
                              {statusConfig[order.status].label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Toutes', count: orders.length },
                    { id: 'pending', label: 'En attente', count: pendingOrders },
                    { id: 'shipped', label: 'Expédiées', count: shippedOrders },
                    { id: 'delivered', label: 'Livrées', count: deliveredOrders },
                    { id: 'cancelled', label: 'Annulées', count: orders.filter(o => o.status === 'cancelled').length },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setOrderFilter(f.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        orderFilter === f.id
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {f.label}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${orderFilter === f.id ? 'bg-white/20' : 'bg-gray-100'}`}>{f.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="font-bold text-lg text-gray-900">Gestion des commandes</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 w-full sm:w-64" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                        <th className="px-6 py-4 font-medium">Commande</th>
                        <th className="px-6 py-4 font-medium">Client</th>
                        <th className="px-6 py-4 font-medium hidden lg:table-cell">Téléphone</th>
                        <th className="px-6 py-4 font-medium hidden md:table-cell">Paiement</th>
                        <th className="px-6 py-4 font-medium">Total</th>
                        <th className="px-6 py-4 font-medium">Statut</th>
                        <th className="px-6 py-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-900">{order.id}</span>
                            <p className="text-xs text-gray-500">{order.date}</p>
                            <p className="text-xs text-gray-400">{order.items} article(s)</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{order.customer[0]}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{order.customer}</p>
                                <p className="text-xs text-gray-500">{order.address}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">{order.phone}</td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="text-sm text-gray-600">{order.payment}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-lg text-gray-900">{order.total.toLocaleString()} F</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                              className={`text-sm font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}
                            >
                              <option value="pending">En attente</option>
                              <option value="shipped">Expédié</option>
                              <option value="delivered">Livré</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher un produit..." 
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" 
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
                    <option>Toutes catégories</option>
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
              </div>

              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Ajouter un produit 🇲🇱</h3>
                        <p className="text-sm text-gray-500">Nouveaux produits pour le Mali</p>
                      </div>
                      <button onClick={() => setShowAddProduct(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                        <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Ex: Boubou Malien" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                          <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ancien prix</label>
                          <input type="number" value={newProduct.originalPrice} onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="0" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                          <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                          <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
                            {categories.filter(c => c.id !== 'all').map(c => (
                              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none" placeholder="Description du produit..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL de l'image</label>
                        <input type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="https://..." />
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-3xl">
                      <button onClick={() => setShowAddProduct(false)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                        Annuler
                      </button>
                      <button onClick={addProduct} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium transition-all shadow-lg">
                        Ajouter le produit 🇲🇱
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                      <button onClick={() => deleteProduct(product.id)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-green-600">{product.price.toLocaleString()} F</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()} F</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-sm">
                        <span className={`font-medium ${product.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                          Stock: {product.stock}
                        </span>
                        <span className="text-gray-500">{product.sold} vendus</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher un client..." 
                    value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" 
                  />
                </div>
                <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                  <Download className="w-4 h-4" /> Exporter
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900">Liste des clients</h3>
                  <p className="text-sm text-gray-500">{customers.length} clients enregistrés</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                        <th className="px-6 py-4 font-medium">Client</th>
                        <th className="px-6 py-4 font-medium">Contact</th>
                        <th className="px-6 py-4 font-medium hidden sm:table-cell">Ville</th>
                        <th className="px-6 py-4 font-medium hidden md:table-cell">Commandes</th>
                        <th className="px-6 py-4 font-medium hidden lg:table-cell">Total dépensé</th>
                        <th className="px-6 py-4 font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {searchedCustomers.map(customer => (
                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-base font-bold text-white">{customer.name[0]}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{customer.name}</p>
                                <p className="text-xs text-gray-500">{customer.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                          <td className="px-6 py-4 hidden sm:table-cell text-gray-600">{customer.city}</td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="font-semibold text-gray-900">{customer.orders}</span>
                            <p className="text-xs text-gray-500">Dernière: {customer.lastOrder}</p>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell font-bold text-green-600">{customer.spent.toLocaleString()} F</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                              customer.status === 'active' ? 'bg-green-100 text-green-700' :
                              customer.status === 'new' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {customer.status === 'active' ? 'Actif' : customer.status === 'new' ? 'Nouveau' : 'Inactif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Revenus mensuels</h3>
                  <div className="h-64 flex items-end justify-around gap-2">
                    {[65, 45, 78, 52, 90, 68, 85, 72, 95, 60, 88, 75].map((val, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg" style={{ height: `${val}%` }}>
                        <span className="text-xs text-white font-medium block text-center pt-1">{val}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-around mt-2 text-xs text-gray-500">
                    <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
                    <span>Jul</span><span>Aoû</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Top produits vendus</h3>
                  <div className="space-y-3">
                    {products.slice(0, 8).map((product, i) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <span className="w-8 h-8 bg-green-100 text-green-700 font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sold} vendus</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{product.price.toLocaleString()} F</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                  <h4 className="font-medium opacity-80">Revenus du mois</h4>
                  <p className="text-3xl font-bold mt-2">{totalRevenue.toLocaleString()} F</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                  <h4 className="font-medium opacity-80">Commandes livrées</h4>
                  <p className="text-3xl font-bold mt-2">{deliveredOrders}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
                  <h4 className="font-medium opacity-80">Clients actifs</h4>
                  <p className="text-3xl font-bold mt-2">{customers.filter(c => c.status === 'active').length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6">🏪 Informations de la boutique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la boutique</label>
                    <input type="text" defaultValue="R-Market" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" defaultValue="contact@r-market.ml" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input type="tel" defaultValue="+223 XX XX XX XX" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <input type="tel" defaultValue="+223 XX XX XX XX" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <textarea defaultValue="Bamako, Mali" rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6">🚚 Paramètres de livraison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frais livraison standard (F)</label>
                    <input type="number" defaultValue={400} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Livraison gratuite à partir de (F)</label>
                    <input type="number" defaultValue={5000} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Délai livraison (jours)</label>
                    <input type="text" defaultValue="2-5" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6">💳 Moyens de paiement acceptés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10">{method.logo}</div>
                      <span className="font-medium text-gray-700">{method.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
                Sauvegarder tous les paramètres 🇲🇱
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Détails de la commande</h3>
                <p className="text-sm text-gray-500">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{selectedOrder.customer[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Articles</p>
                  <p className="font-medium">{selectedOrder.items}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Paiement</p>
                  <p className="font-medium">{selectedOrder.payment}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Statut</p>
                  <span className={`font-medium ${statusConfig[selectedOrder.status].color}`}>{statusConfig[selectedOrder.status].label}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Adresse de livraison</p>
                <p className="font-medium">{selectedOrder.address}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-2xl font-bold text-green-600">{selectedOrder.total.toLocaleString()} FCFA</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modifier le statut</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => { updateOrderStatus(selectedOrder.id, e.target.value); setSelectedOrder({...selectedOrder, status: e.target.value}) }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].color}`}
                >
                  <option value="pending">En attente</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
