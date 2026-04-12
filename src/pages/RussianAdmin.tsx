import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, ArrowRightLeft,
  TrendingUp, Truck, Search, Plus, Trash2, Edit, Eye, Download,
  Bell, Calendar, Package2, X, DollarSign, Wine, Gift, Globe, Menu, ArrowLeft, Home
} from 'lucide-react'
import { russianProducts, russianCategories, initialRussianOrders, type RussianProduct } from '../data/russianProducts'

const initialCustomers = [
  { id: 1, name: 'Иванов И.И.', email: 'ivanov@military.ru', phone: '+223 70 12 34 56', base: 'Camp Alpha', orders: 8, spent: 234000, lastOrder: '02/04/2026', status: 'active' },
  { id: 2, name: 'Петров А.В.', email: 'petrov@military.ru', phone: '+223 66 78 90 12', base: 'Hôtel Nord-Sud', orders: 5, spent: 89000, lastOrder: '01/04/2026', status: 'active' },
  { id: 3, name: 'Сидоров К.М.', email: 'sidorov@military.ru', phone: '+223 77 34 56 78', base: 'Camp Echo', orders: 12, spent: 456000, lastOrder: '31/03/2026', status: 'active' },
  { id: 4, name: 'Козлов Д.С.', email: 'kozlov@military.ru', phone: '+223 65 90 12 34', base: 'Résidence Moderne', orders: 3, spent: 67000, lastOrder: '30/03/2026', status: 'active' },
]

export default function RussianAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [orderFilter, setOrderFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [lang, setLang] = useState<'ru' | 'fr'>('ru')
  
  const [orders, setOrders] = useState(initialRussianOrders)
  const [products, setProducts] = useState(russianProducts)
  const [customers] = useState(initialCustomers)

  const [newProduct, setNewProduct] = useState({ 
    name: '', nameRu: '', price: '', originalPrice: '', stock: '', image: '', 
    description: '', descriptionRu: '', category: 'souvenirs' 
  })

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter)
  
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const totalSold = products.reduce((s, p) => s + p.sold, 0)
  const totalStock = products.reduce((s, p) => s + p.stock, 0)

  const addProduct = () => {
    const product: RussianProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: newProduct.name,
      nameRu: newProduct.nameRu,
      price: parseFloat(newProduct.price),
      originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price) * 1.3,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: newProduct.category,
      description: newProduct.description,
      descriptionRu: newProduct.descriptionRu,
      rating: 4.5,
      reviews: 0,
      stock: parseInt(newProduct.stock) || 100,
      sold: 0,
    }
    setProducts([...products, product])
    setNewProduct({ name: '', nameRu: '', price: '', originalPrice: '', stock: '', image: '', description: '', descriptionRu: '', category: 'souvenirs' })
    setShowAddProduct(false)
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const statusConfig: Record<string, { labelRu: string; labelFr: string; color: string; bg: string }> = {
    pending: { labelRu: 'Ожидает', labelFr: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    shipped: { labelRu: 'Отправлено', labelFr: 'Expédié', color: 'text-blue-700', bg: 'bg-blue-100' },
    delivered: { labelRu: 'Доставлено', labelFr: 'Livré', color: 'text-green-700', bg: 'bg-green-100' },
    completed: { labelRu: 'Завершено', labelFr: 'Complété', color: 'text-green-700', bg: 'bg-green-100' },
    cancelled: { labelRu: 'Отменено', labelFr: 'Annulé', color: 'text-red-700', bg: 'bg-red-100' },
  }

  const tabs = [
    { id: 'dashboard', labelRu: 'Панель', labelFr: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders', labelRu: 'Заказы', labelFr: 'Commandes', icon: ShoppingCart },
    { id: 'products', labelRu: 'Товары', labelFr: 'Produits', icon: Package },
    { id: 'exchange', labelRu: 'Обмен', labelFr: 'Échanges', icon: ArrowRightLeft },
    { id: 'customers', labelRu: 'Клиенты', labelFr: 'Clients', icon: Users },
    { id: 'settings', labelRu: 'Настройки', labelFr: 'Paramètres', icon: Settings },
  ]

  const t = (ru: string, fr: string) => lang === 'ru' ? ru : fr

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 to-gray-950 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🇷🇺</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Русский магазин</h1>
                <p className="text-xs text-gray-400">Administration</p>
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="p-4 border-b border-white/10">
            <button 
              onClick={() => setLang(lang === 'ru' ? 'fr' : 'ru')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm"
            >
              <Globe className="w-4 h-4" />
              {lang === 'ru' ? 'Passer en Français' : 'Переключить на Русский'}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {tabs.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {lang === 'ru' ? item.labelRu : item.labelFr}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-lg">🇷🇺</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('Администратор', 'Administrateur')}</p>
                  <p className="text-xs text-gray-400">{t('Русский магазин', 'Boutique Russe')} 🇲🇱</p>
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
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Page d'accueil">
              <Home className="w-5 h-5" />
            </Link>
            <Link to="/russian" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Boutique Russe">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇷🇺</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('Панель управления', 'Administration')} 🇷🇺🇲🇱</h2>
                <p className="text-sm text-gray-500">{t('Управление русским магазином', 'Gestion boutique russe')}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
              <Settings className="w-4 h-4" />
              Admin Mali
            </Link>
            <Link to="/russian" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
              🇷🇺 Boutique
            </Link>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{t('Доход (CFA)', 'Revenus (CFA)')}</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">≈ {(totalRevenue / 655.96).toFixed(2)} €</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{t('Заказы', 'Commandes')}</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{pendingOrders} {t('ожидает', 'en attente')}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{t('Товары', 'Produits')}</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                  <p className="text-sm text-gray-500 mt-1">{totalStock} {t('единиц', 'unités')}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{t('Клиенты', 'Clients')}</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('военных', 'militaires')}</p>
                </div>
              </div>

              {/* Exchange Rates */}
              <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4">{t('Курсы обмена', 'Taux de change')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm opacity-80">🇪🇺 EUR → 🇲🇱 CFA</p>
                    <p className="text-2xl font-bold">655.96</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm opacity-80">🇺🇸 USD → 🇲🇱 CFA</p>
                    <p className="text-2xl font-bold">600.00</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm opacity-80">🇪🇺 EUR → 🇺🇸 USD</p>
                    <p className="text-2xl font-bold">1.09</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg">{t('Последние заказы', 'Commandes récentes')}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">{t('Клиент', 'Client')}</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">{t('Статус', 'Statut')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold">{order.id}</td>
                          <td className="px-6 py-4">{order.customer}</td>
                          <td className="px-6 py-4 font-bold text-green-600">{order.total.toLocaleString()} F</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
                              {lang === 'ru' ? statusConfig[order.status].labelRu : statusConfig[order.status].labelFr}
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

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'shipped', 'delivered', 'completed', 'cancelled'].map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      orderFilter === f
                        ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {f === 'all' ? t('Все', 'Toutes') : lang === 'ru' ? statusConfig[f]?.labelRu || f : statusConfig[f]?.labelFr || f}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg">{t('Управление заказами', 'Gestion des commandes')}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">{t('Клиент', 'Client')}</th>
                        <th className="px-6 py-4 hidden lg:table-cell">{t('Телефон', 'Téléphone')}</th>
                        <th className="px-6 py-4">{t('Адрес', 'Adresse')}</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4 hidden md:table-cell">{t('Валюта', 'Devise')}</th>
                        <th className="px-6 py-4">{t('Статус', 'Statut')}</th>
                        <th className="px-6 py-4">{t('Действия', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="font-bold">{order.id}</span>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </td>
                          <td className="px-6 py-4 font-medium">{order.customer}</td>
                          <td className="px-6 py-4 hidden lg:table-cell text-gray-600">{order.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.deliveryAddress}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold">{order.total.toLocaleString()} F</p>
                            <p className="text-xs text-gray-500">{order.totalEUR} € / ${order.totalUSD}</p>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{order.paymentMethod}</span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                              className={`text-sm font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}
                            >
                              <option value="pending">{t('Ожидает', 'En attente')}</option>
                              <option value="shipped">{t('Отправлено', 'Expédié')}</option>
                              <option value="delivered">{t('Доставлено', 'Livré')}</option>
                              <option value="completed">{t('Завершено', 'Complété')}</option>
                              <option value="cancelled">{t('Отменено', 'Annulé')}</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
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

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                  {russianCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {/* filter by category */}}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:border-blue-500 transition-colors"
                    >
                      {cat.emoji} {lang === 'ru' ? cat.name : cat.nameFr}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> {t('Добавить', 'Ajouter')}
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                      <button onClick={() => deleteProduct(product.id)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400">{product.category}</p>
                      <h4 className="font-semibold truncate">{lang === 'ru' ? product.nameRu : product.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-green-600">{product.price.toLocaleString()} F</span>
                        <span className="text-xs text-gray-500">({(product.price / 655.96).toFixed(2)}€)</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{t('В наличии', 'Stock')}: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-xl font-bold">{t('Добавить товар', 'Ajouter un produit')} 🇷🇺</h3>
                      <button onClick={() => setShowAddProduct(false)} className="p-2 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Название (FR) *</label>
                          <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Masque Dogon" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Название (RU) *</label>
                          <input type="text" value={newProduct.nameRu} onChange={e => setNewProduct({...newProduct, nameRu: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Догонская маска" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Цена (CFA) *</label>
                          <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="25000" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                          <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                            {russianCategories.filter(c => c.id !== 'all').map(c => (
                              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Картинка (URL)</label>
                        <input type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="https://..." />
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex gap-3">
                      <button onClick={() => setShowAddProduct(false)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium">
                        {t('Отмена', 'Annuler')}
                      </button>
                      <button onClick={addProduct} className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 rounded-xl font-medium">
                        {t('Добавить', 'Ajouter')} 🇷🇺
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Exchange Tab */}
          {activeTab === 'exchange' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">{t('Управление обменом валюты', 'Gestion des échanges')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-xl p-6">
                    <p className="text-sm opacity-80 mb-2">🇪🇺 EUR → 🇲🇱 CFA</p>
                    <input type="number" defaultValue={655.96} className="w-full px-4 py-3 bg-white/20 rounded-lg text-xl font-bold" />
                  </div>
                  <div className="bg-white/10 rounded-xl p-6">
                    <p className="text-sm opacity-80 mb-2">🇺🇸 USD → 🇲🇱 CFA</p>
                    <input type="number" defaultValue={600} className="w-full px-4 py-3 bg-white/20 rounded-lg text-xl font-bold" />
                  </div>
                  <div className="bg-white/10 rounded-xl p-6">
                    <p className="text-sm opacity-80 mb-2">🇪🇺 EUR → 🇺🇸 USD</p>
                    <input type="number" defaultValue={1.09} className="w-full px-4 py-3 bg-white/20 rounded-lg text-xl font-bold" />
                  </div>
                </div>
                <button className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-xl font-bold">
                  {t('Сохранить курсы', 'Sauvegarder les taux')}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-4">{t('История обменов', 'Historique des échanges')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">{t('Клиент', 'Client')}</th>
                        <th className="px-6 py-4">{t('Направление', 'Direction')}</th>
                        <th className="px-6 py-4">{t('Сумма', 'Montant')}</th>
                        <th className="px-6 py-4">{t('Статус', 'Statut')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.filter(o => o.id.includes('RU-003')).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold">{order.id}</td>
                          <td className="px-6 py-4">{order.customer}</td>
                          <td className="px-6 py-4">{t('Европа → CFA', 'EUR → CFA')}</td>
                          <td className="px-6 py-4 font-bold">{order.totalEUR} €</td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                              {t('Завершено', 'Complété')}
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

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg">{t('Список клиентов', 'Liste des clients')}</h3>
                <p className="text-sm text-gray-500">{customers.length} {t('военных', 'militaires')}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                      <th className="px-6 py-4">{t('Имя', 'Nom')}</th>
                      <th className="px-6 py-4">{t('Телефон', 'Téléphone')}</th>
                      <th className="px-6 py-4">{t('База', 'Base')}</th>
                      <th className="px-6 py-4">{t('Заказы', 'Commandes')}</th>
                      <th className="px-6 py-4">{t('Потрачено', 'Dépensé')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.map(customer => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">🇷🇺</span>
                            </div>
                            <div>
                              <p className="font-semibold">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{customer.base}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{customer.orders}</td>
                        <td className="px-6 py-4 font-bold text-green-600">{customer.spent.toLocaleString()} F</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-6">⚙️ {t('Настройки магазина', 'Paramètres de la boutique')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('Название', 'Nom')}</label>
                    <input type="text" defaultValue="Русский магазин / Boutique Russe" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон / WhatsApp</label>
                    <input type="tel" defaultValue="+223 XX XX XX XX" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-6">🚚 {t('Настройки доставки', 'Paramètres de livraison')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('Стоимость доставки (CFA)', 'Frais livraison (CFA)')}</label>
                    <input type="number" defaultValue={500} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('Бесплатная доставка от (CFA)', 'Livraison gratuite à partir (CFA)')}</label>
                    <input type="number" defaultValue={10000} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg">
                {t('Сохранить', 'Sauvegarder')} 🇷🇺
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">{t('Детали заказа', 'Détails de la commande')}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold">{selectedOrder.customer}</p>
                <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                <p className="text-sm text-gray-500">{selectedOrder.deliveryAddress}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{t('Валюта', 'Devise')}</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-green-600">{selectedOrder.total.toLocaleString()} F</p>
                <p className="text-sm text-gray-500">{selectedOrder.totalEUR} € / ${selectedOrder.totalUSD}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

