import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, Truck, RefreshCw, FileText, Wallet, Users2, Warehouse, Menu, X, Home, LogOut, UserCog, Flag, PackageCheck, Image, Globe, Camera, QrCode, Calendar, ScanLine, ArrowRightLeft } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, section: 'main' },
  { id: 'orders', label: 'Commandes Mali', icon: ShoppingCart, section: 'main' },
  { id: 'products', label: 'Produits Mali', icon: Package, section: 'main' },
  { id: 'photos', label: '📸 Photos', icon: Camera, section: 'main' },
  { id: 'qrcodes', label: '📱 QR Codes', icon: QrCode, section: 'main' },
  { id: 'photo-planning', label: '📅 Planning Photos', icon: Calendar, section: 'main' },
  { id: 'inventory', label: 'Inventaire', icon: Warehouse, section: 'main' },
  { id: 'delivery', label: 'Livraisons', icon: Truck, section: 'main' },
  { id: 'delivery-scan', label: '📱 Scan Livraison', icon: ScanLine, section: 'main' },
  { id: 'returns', label: 'Retours', icon: RefreshCw, section: 'main' },
  { id: 'reports', label: 'Rapports', icon: FileText, section: 'main' },
  { id: 'finances', label: 'Finances', icon: Wallet, section: 'main' },
  { id: 'suppliers', label: 'Fournisseurs', icon: Users2, section: 'main' },
  { id: 'customers', label: 'Clients Mali', icon: Users, section: 'main' },
  { id: 'russian-orders', label: 'Commandes Russes', icon: Flag, section: 'russian' },
  { id: 'russian-products', label: 'Produits Russes', icon: PackageCheck, section: 'russian' },
  { id: 'exchange-rates', label: '💱 Taux de Change', icon: ArrowRightLeft, section: 'russian' },
  { id: 'content', label: 'Images & Slider', icon: Image, section: 'settings' },
  { id: 'users', label: 'Comptes & Accès', icon: UserCog, section: 'settings' },
  { id: 'analytics', label: 'Statistiques', icon: BarChart3, section: 'settings' },
  { id: 'settings', label: 'Paramètres', icon: Settings, section: 'settings' },
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
                <img src="/logo.svg" alt="R-Market" className="w-12 h-12 rounded-xl shadow-lg" />
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
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Main Section */}
            <div>
              <p className="text-xs text-green-300 uppercase tracking-wider mb-2 px-4">🇲🇱 Mali</p>
              <div className="space-y-1">
                {tabs.filter(t => t.section === 'main').map(item => {
                  const isActive = location.pathname === `/admin-panel/${item.id}` || 
                                  (location.pathname === '/admin-panel' && item.id === 'dashboard')
                  return (
                    <Link
                      key={item.id}
                      to={`/admin-panel/${item.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-green-800 shadow-lg'
                          : 'text-green-100 hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Russian Section */}
            <div>
              <p className="text-xs text-green-300 uppercase tracking-wider mb-2 px-4">🇷🇺 Boutique Russe</p>
              <div className="space-y-1">
                {tabs.filter(t => t.section === 'russian').map(item => {
                  const isActive = location.pathname === `/admin-panel/${item.id}`
                  return (
                    <Link
                      key={item.id}
                      to={`/admin-panel/${item.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-green-800 shadow-lg'
                          : 'text-green-100 hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <p className="text-xs text-green-300 uppercase tracking-wider mb-2 px-4">⚙️ Configuration</p>
              <div className="space-y-1">
                {tabs.filter(t => t.section === 'settings').map(item => {
                  const isActive = location.pathname === `/admin-panel/${item.id}`
                  return (
                    <Link
                      key={item.id}
                      to={`/admin-panel/${item.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-green-800 shadow-lg'
                          : 'text-green-100 hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
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
