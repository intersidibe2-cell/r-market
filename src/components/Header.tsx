import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search, Bell, ShoppingBag, Package, House, Settings, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { categories } from '../data/products'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems } = useCart()
  const { totalFavorites } = useFavorites()
  const location = useLocation()

  const navLinks = [
    { label: 'Accueil', path: '/', icon: House },
    { label: 'Boutique', path: '/shop', icon: ShoppingBag },
    { label: 'Guide', path: '/guide', icon: null, emoji: '📱' },
    { label: 'Mes Commandes', path: '/orders', icon: Package },
    { label: 'Mon Profil', path: '/account', icon: null, emoji: '👤' },
  ]

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-white">
      {/* Top Search Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex-1 relative group">
            <div className="relative flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Rechercher des produits, marques, catégories..."
                className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-transparent focus:border-white focus:ring-2 focus:ring-white/30 transition-all shadow-md text-gray-900 placeholder-gray-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 whitespace-nowrap leading-none truncate">R-Market</h1>
                <p className="hidden lg:block text-xs text-gray-500 whitespace-nowrap mt-0.5">Votre marketplace au Mali</p>
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Favorites */}
              <Link to="/favorites" className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 transition-colors relative">
                <Heart className="w-5 h-5" />
                {totalFavorites > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalFavorites}
                  </span>
                )}
              </Link>

              <button className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5" />
              </button>

              {/* Mobile search toggle */}
              <button
                className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu */}
              <button
                className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    {link.icon ? <link.icon className="w-4 h-4" /> : <span>{link.emoji}</span>}
                    {link.label}
                  </Link>
                )
              })}
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <Link
                to="/admin"
                className="px-3 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                {link.icon ? <link.icon className="w-5 h-5" /> : <span className="text-lg">{link.emoji}</span>}
                {link.label}
              </Link>
            ))}

            <div className="border-t pt-2 mt-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Catégories</p>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm"
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="font-medium text-gray-700">{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="border-t pt-2 mt-2">
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm text-green-600 font-medium">
                <Settings className="w-4 h-4" />
                Espace Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
