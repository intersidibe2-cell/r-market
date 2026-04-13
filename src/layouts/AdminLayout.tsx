import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, Truck, RefreshCw, FileText, Wallet, Users2, Warehouse, Menu, X, Home, LogOut } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'inventory', label: 'Inventaire', icon: Warehouse },
  { id: 'delivery', label: 'Livraisons', icon: Truck },
  { id: 'returns', label: 'Retours', icon: RefreshCw },
  { id: 'reports', label: 'Rapports', icon: FileText },
  { id: 'finances', label: 'Finances', icon: Wallet },
  { id: 'suppliers', label: 'Fournisseurs', icon: Users2 },
  { id: 'customers', label: 'Clients', icon: Users },
  { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
  { id: 'settings', label: 'Paramètres', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-green-800 to-green-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-green-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h1 className="font-bold text-lg">R-Market</h1>
                  <p className="text-xs text-green-200">Administration</p>
                </div>
              </div>
              <button className="lg:hidden p-2 text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {tabs.map(item => {
              const isActive = location.pathname === `/admin-panel/${item.id}` || 
                              (location.pathname === '/admin-panel' && item.id === 'dashboard')
              return (
                <Link
                  key={item.id}
                  to={`/admin-panel/${item.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-green-800 shadow-lg'
                      : 'text-green-100 hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-100 hover:bg-white/10 transition-all">
              <Home className="w-5 h-5" />
              Retour au site
            </Link>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Administrateur</p>
                  <p className="text-xs text-green-300">Admin R-Market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Panel d'Administration</h2>
              <p className="text-sm text-gray-500">Gestion complète de R-Market</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇲🇱</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
