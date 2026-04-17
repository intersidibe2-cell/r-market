import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search, Bell, ShoppingBag, Package, House, Settings, Heart, User, LogOut, Globe, DollarSign, Star, Truck, Lock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import { useCurrency, Currency } from '../context/CurrencyContext'
import { useAdultAccess } from '../context/AdultAccessContext'
import { languages, Language } from '../i18n'
import { categories } from '../data/products'
import { loadProducts } from '../lib/products'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts().then(data => setAllProducts(data))
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return }
    const q = searchQuery.toLowerCase()
    const results = allProducts
      .filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 6)
    setSearchResults(results)
  }, [searchQuery, allProducts])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchFocused(false)
      setSearchQuery('')
    }
  }

  const handleSelectProduct = (id: number) => {
    navigate(`/product/${id}`)
    setSearchFocused(false)
    setSearchQuery('')
  }
  
  const { totalItems } = useCart()
  const { totalFavorites } = useFavorites()
  const { user, isAuthenticated, logout } = useAuth()
  const { currency, setCurrency, currencies } = useCurrency()
  const { hasAccess } = useAdultAccess()
  const location = useLocation()

  const navLinks = [
    { label: 'Accueil', path: '/', icon: House },
    { label: 'Boutique', path: '/shop', icon: ShoppingBag },
    { label: 'Restaurant', path: 'https://r-chicken.com', icon: ShoppingBag, external: true },
    { label: 'Suivi', path: '/order-tracking', icon: Truck },
    { label: 'Fidélité', path: '/loyalty', icon: Star },
    { label: 'Mon Profil', path: '/account', icon: User },
  ]

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const currentLang = languages.find(l => l.code === 'fr') || languages[0]

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-white">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 text-white/90 hover:text-white text-sm"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.nativeName}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[150px] z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLangMenuOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-white/20 placeholder-white/70 text-white border border-white/30 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all"
              />
              {/* Autocomplete dropdown */}
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProduct(p.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                    >
                      {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-green-600 font-semibold">{p.price?.toLocaleString()} FCFA</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{p.category}</span>
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm text-center text-green-600 font-medium hover:bg-green-50 border-t border-gray-100"
                  >
                    Voir tous les résultats pour "{searchQuery}"
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Currency Selector */}
          <div className="relative">
            <button 
              onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
              className="flex items-center gap-1 text-white/90 hover:text-white text-sm"
            >
              <DollarSign className="w-4 h-4" />
              <span>{currency}</span>
            </button>
            {currencyMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[120px] z-50">
                {currencies.map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => { setCurrency(curr.code); setCurrencyMenuOpen(false) }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      currency === curr.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                    }`}
                  >
                    <span>{curr.flag}</span>
                    <span>{curr.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group min-w-0">
              <img src="/logo.svg" alt="R-Market" className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-200" />
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

              {/* Cart */}
              <Link to="/cart" className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-700">{user?.name[0]}</span>
                    </div>
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Link>
                )}

                {userMenuOpen && isAuthenticated && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px] z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">
                        {user?.role}
                      </span>
                    </div>
                    <Link 
                      to="/account" 
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Mon compte
                    </Link>
                    <Link 
                      to="/loyalty" 
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Programme fidélité
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Administration
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                const Icon = link.icon
                if (link.external) {
                  return (
                    <a
                      key={link.path}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </a>
                  )
                }
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
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
                <link.icon className="w-5 h-5" />
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
