import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, ArrowRightLeft, Gift, Wine, ShoppingBag, Phone, MapPin, Clock, Star, Truck, Globe, Home, BookOpen, Check, Lock } from 'lucide-react'
import { russianProducts, russianCategories } from '../data/russianProducts'

interface CartItem {
  id: number
  name: string
  nameRu: string
  price: number
  image: string
  quantity: number
}

export default function RussianShop() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showExchange, setShowExchange] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lang, setLang] = useState<'ru' | 'fr'>('ru')

  const t = (ru: string, fr: string) => lang === 'ru' ? ru : fr

  const [exchangeFrom, setExchangeFrom] = useState('EUR')
  const [exchangeAmount, setExchangeAmount] = useState('')
  const [exchangeResult, setExchangeResult] = useState('')

  const [orderForm, setOrderForm] = useState({
    code: '',
    phone: '',
    address: '',
    payment: 'CFA'
  })
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderCode, setOrderCode] = useState('')

  const exchangeRates: Record<string, Record<string, number>> = {
    EUR: { CFA: 655.96, USD: 1.09 },
    USD: { CFA: 600.00, EUR: 0.92 },
    CFA: { EUR: 0.001524, USD: 0.001667 }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartTotalEUR = (cartTotal / 655.96).toFixed(2)
  const cartTotalUSD = (cartTotal / 600).toFixed(2)

  const filteredProducts = activeCategory === 'all' 
    ? russianProducts 
    : russianProducts.filter(p => p.category === activeCategory)

  const searchedProducts = searchQuery
    ? filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameRu.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProducts

  const addToCart = (product: typeof russianProducts[0]) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        nameRu: product.nameRu,
        price: product.price,
        image: product.image,
        quantity: 1
      }])
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const handleExchange = () => {
    const amount = parseFloat(exchangeAmount)
    if (!amount || amount <= 0) return
    const to = exchangeFrom === 'EUR' ? 'CFA' : exchangeFrom === 'USD' ? 'CFA' : 'EUR'
    const rate = exchangeRates[exchangeFrom][to]
    setExchangeResult((amount * rate).toLocaleString())
  }

  const categoryIcons: Record<string, any> = {
    all: ShoppingBag,
    souvenirs: Gift,
    alcohol: Wine,
    food: ShoppingBag,
    adult: Lock,
    exchange: ArrowRightLeft
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="bg-blue-900">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇲🇱</span>
              <span className="text-sm font-medium text-blue-200">{t('Товары Мали для русских', 'Produits Mali pour Russes')}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setLang(lang === 'ru' ? 'fr' : 'ru')} className="text-sm text-blue-200 hover:text-white flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {lang === 'ru' ? 'FR' : 'RU'}
              </button>
              <Link to="/" className="text-sm text-blue-200 hover:text-white flex items-center gap-1">
                <Home className="w-4 h-4" />
                R-Market
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold">🇲🇱</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {t('Магазин для Русских в Мали', 'Boutique Mali pour Russes')}
              </h1>
              <p className="text-sm text-gray-400">{t('Товары Мали для военных', 'Produits Mali pour militaires')}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/bambara-course" className="flex items-center gap-2 px-4 py-2 bg-green-700 rounded-lg text-sm text-green-100 hover:bg-green-600 transition-colors">
              <BookOpen className="w-4 h-4" />
              📚 Bambara
            </Link>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'ru' ? 'Поиск товаров...' : 'Rechercher...'}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <button onClick={() => setShowExchange(true)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <ArrowRightLeft className="w-5 h-5 text-green-400" />
            </button>
            <button onClick={() => setShowCart(true)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700 p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Поиск..." className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-sm" />
          </div>
          <Link to="/bambara-course" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 bg-green-700 rounded-lg">
            <BookOpen className="w-5 h-5 text-green-200" />
            <span>📚 {lang === 'ru' ? 'Изучить бамбара' : 'Apprendre Bambara'}</span>
          </Link>
          <button onClick={() => { setShowExchange(true); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg">
            <ArrowRightLeft className="w-5 h-5 text-green-400" />
            <span>Обмен валюты</span>
          </button>
          <button onClick={() => { setShowCart(true); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
            <span>Корзина ({cart.length})</span>
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="bg-gray-800 border-b border-gray-700 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2">
          {russianCategories.map(cat => {
            const Icon = categoryIcons[cat.id] || ShoppingBag
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'ru' ? cat.name : cat.nameFr}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Exchange Rate Banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ArrowRightLeft className="w-5 h-5 text-green-300" />
            <div className="flex items-center gap-6 text-sm">
              <span className="text-green-200">1 EUR = <strong className="text-white">656 CFA</strong></span>
              <span className="text-green-200">1 USD = <strong className="text-white">600 CFA</strong></span>
            </div>
          </div>
          <button onClick={() => setShowExchange(true)} className="text-sm text-green-300 hover:text-white flex items-center gap-1">
            {lang === 'ru' ? 'Обменять' : 'Échanger'} <ArrowRightLeft className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Products Grid */}
        {activeCategory !== 'exchange' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {lang === 'ru' 
                  ? russianCategories.find(c => c.id === activeCategory)?.name 
                  : russianCategories.find(c => c.id === activeCategory)?.nameFr}
              </h2>
              <span className="text-sm text-gray-400">{searchedProducts.length} товаров</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchedProducts.map(product => (
                <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all group">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white truncate">{lang === 'ru' ? product.nameRu : product.name}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{lang === 'ru' ? product.descriptionRu : product.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-green-400">{product.price.toLocaleString()} F</span>
                      <span className="text-xs text-gray-500">({(product.price / 655.96).toFixed(2)}€)</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-yellow-400 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      {product.rating}
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {lang === 'ru' ? 'В корзину' : 'Ajouter'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Exchange Section */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-6 h-6 text-green-400" />
                {lang === 'ru' ? 'Обмен валюты' : 'Échange de devises'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {['EUR', 'USD', 'CFA'].map(cur => (
                  <div key={cur} className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">{cur === 'EUR' ? '🇪🇺' : cur === 'USD' ? '🇺🇸' : '🇲🇱'}</div>
                    <p className="font-bold">{cur}</p>
                    <p className="text-sm text-gray-400">
                      {cur === 'EUR' ? 'Euro' : cur === 'USD' ? 'Dollar' : 'Franc CFA'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">De</label>
                    <select 
                      value={exchangeFrom}
                      onChange={e => setExchangeFrom(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-green-500"
                    >
                      <option value="EUR">🇪🇺 EUR</option>
                      <option value="USD">🇺🇸 USD</option>
                      <option value="CFA">🇲🇱 CFA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Vers</label>
                    <div className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg">
                      {exchangeFrom === 'EUR' ? '🇲🇱 CFA' : exchangeFrom === 'USD' ? '🇲🇱 CFA' : '🇪🇺 EUR'}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Montant</label>
                  <input 
                    type="number"
                    value={exchangeAmount}
                    onChange={e => setExchangeAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
                <button onClick={handleExchange} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">
                  {lang === 'ru' ? 'Рассчитать' : 'Calculer'}
                </button>
                {exchangeResult && (
                  <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-300">{lang === 'ru' ? 'Результат' : 'Résultat'}</p>
                    <p className="text-2xl font-bold text-white">{exchangeResult} {exchangeFrom === 'CFA' ? 'EUR' : 'CFA'}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {lang === 'ru' ? 'Точность курса: 1.00. Для фактического обмена свяжитесь с нами.' : 'Taux indicatif. Pour un échange réel, contactez-nous.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold mb-4">{lang === 'ru' ? 'Часы работы обмена' : 'Horaires d\'échange'}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Lundi - Vendredi</p>
                    <p className="text-sm text-gray-400">08:00 - 18:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Samedi</p>
                    <p className="text-sm text-gray-400">09:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <Truck className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">{lang === 'ru' ? 'Доставка' : 'Livraison'}</h3>
            <p className="text-sm text-gray-400">{lang === 'ru' ? 'Доставка по базам и отелям Бамако' : 'Livraison aux bases et hôtels de Bamako'}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <MapPin className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">{lang === 'ru' ? 'Локация' : 'Localisation'}</h3>
            <p className="text-sm text-gray-400">{lang === 'ru' ? 'Бамако, Мали' : 'Bamako, Mali'}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <Phone className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">{lang === 'ru' ? 'Контакт' : 'Contact'}</h3>
            <p className="text-sm text-gray-400">+223 XX XX XX XX</p>
          </div>
        </div>
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
          <div className="bg-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                {lang === 'ru' ? 'Корзина' : 'Panier'}
              </h2>
              <button onClick={() => setShowCart(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  {lang === 'ru' ? 'Корзина пуста' : 'Panier vide'}
                </p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-700 rounded-lg p-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{lang === 'ru' ? item.nameRu : item.name}</h3>
                        <p className="text-green-400 font-bold">{item.price.toLocaleString()} F</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">-</button>
                          <span className="text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 text-xs">Supprimer</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Total CFA:</span>
                      <span className="font-bold text-green-400">{cartTotal.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Total EUR:</span>
                      <span className="font-bold">{cartTotalEUR} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total USD:</span>
                      <span className="font-bold">${cartTotalUSD}</span>
                    </div>
                  </div>

                  <button onClick={() => { setShowCart(false); setShowOrderForm(true) }} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors">
                    {lang === 'ru' ? 'Оформить заказ' : 'Commander'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exchange Modal */}
      {showExchange && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
          <div className="bg-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ArrowRightLeft className="w-6 h-6 text-green-400" />
                {lang === 'ru' ? 'Обмен валюты' : 'Échange de devises'}
              </h2>
              <button onClick={() => setShowExchange(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'От' : 'De'}</label>
                  <select 
                    value={exchangeFrom}
                    onChange={e => setExchangeFrom(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg"
                  >
                    <option value="EUR">🇪🇺 EUR (Euro)</option>
                    <option value="USD">🇺🇸 USD (Dollar)</option>
                    <option value="CFA">🇲🇱 CFA (Franc)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'Сумма' : 'Montant'}</label>
                  <input 
                    type="number"
                    value={exchangeAmount}
                    onChange={e => setExchangeAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg"
                  />
                </div>
                <button onClick={handleExchange} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
                  {lang === 'ru' ? 'Рассчитать' : 'Calculer'}
                </button>
                {exchangeResult && (
                  <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{exchangeResult} {exchangeFrom === 'CFA' ? 'EUR' : 'CFA'}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  {lang === 'ru' 
                    ? 'Обмен наличных: Свяжитесь с нами для физического обмена' 
                    : 'Échange en espèces: Contactez-nous pour un échange physique'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && !orderConfirmed && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
          <div className="bg-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">{lang === 'ru' ? 'Оформление заказа' : 'Commande'}</h2>
              <button onClick={() => setShowOrderForm(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'Ваш код (для доставки)' : 'Votre code (pour livraison)'} *</label>
                <input 
                  type="text"
                  value={orderForm.code}
                  onChange={e => setOrderForm({...orderForm, code: e.target.value.toUpperCase()})}
                  placeholder={lang === 'ru' ? 'Например: RUS-7823' : 'Ex: RUS-7823'}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {lang === 'ru' 
                    ? 'Код для идентификации при доставке' 
                    : 'Code pour identification à la livraison'}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'Телефон (WhatsApp)' : 'Téléphone (WhatsApp)'} *</label>
                <input 
                  type="tel"
                  value={orderForm.phone}
                  onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                  placeholder="+223 XX XX XX XX"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'Адрес доставки' : 'Adresse de livraison'} *</label>
                <input 
                  type="text"
                  value={orderForm.address}
                  onChange={e => setOrderForm({...orderForm, address: e.target.value})}
                  placeholder={lang === 'ru' ? 'База / Отель / Район' : 'Base / Hôtel / Quartier'}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'Валюта оплаты' : 'Devise de paiement'}</label>
                <select 
                  value={orderForm.payment}
                  onChange={e => setOrderForm({...orderForm, payment: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                >
                  <option value="CFA">🇲🇱 CFA</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="USD">🇺🇸 USD</option>
                </select>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-bold">
                    {orderForm.payment === 'CFA' ? `${cartTotal.toLocaleString()} F` :
                     orderForm.payment === 'EUR' ? `${cartTotalEUR} €` :
                     `$${cartTotalUSD}`}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => {
                  const code = orderForm.code || `RUS-${Math.floor(1000 + Math.random() * 9000)}`
                  setOrderCode(code)
                  setOrderConfirmed(true)
                  setCart([])
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
              >
                {lang === 'ru' ? 'Подтвердить заказ' : 'Confirmer la commande'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                {lang === 'ru' 
                  ? 'Анонимный заказ. Только код для доставки.' 
                  : 'Commande anonyme. Seul le code est utilisé pour la livraison.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
          <div className="bg-gray-800 w-full max-w-md rounded-t-2xl md:rounded-2xl">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {lang === 'ru' ? 'Заказ подтверждён!' : 'Commande confirmée!'}
              </h2>
              <p className="text-gray-400 mb-6">
                {lang === 'ru' 
                  ? 'Ваш заказ принят. Сохраните QR-код для получения.' 
                  : 'Votre commande est acceptée. Gardez le QR-code pour la réception.'}
              </p>
              
              {/* QR Code */}
              <div className="bg-white rounded-2xl p-4 mb-6 inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({orderCode, type: 'russian'}))}&bgcolor=ffffff&color=1a1a2e&margin=4`}
                  alt="QR Code Commande"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-xl p-6 mb-6">
                <p className="text-white/80 text-sm mb-2">{lang === 'ru' ? 'Ваш номер заказа' : 'Votre numéro de commande'}</p>
                <p className="text-4xl font-bold text-white font-mono">{orderCode}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
                <p className="text-gray-400 text-sm mb-2">{lang === 'ru' ? 'Что делать:' : 'Que faire:'}</p>
                <ul className="text-sm text-white space-y-1">
                  <li>📸 {lang === 'ru' ? 'Сделайте скриншот этого экрана' : 'Faites une capture d\'écran'}</li>
                  <li>🖨️ {lang === 'ru' ? 'Или распечатайте QR-код' : 'Ou imprimez le QR-code'}</li>
                  <li>📱 {lang === 'ru' ? 'Ливрёр свяжется с вами по WhatsApp' : 'Le livreur vous contactera sur WhatsApp'}</li>
                  <li>🎁 {lang === 'ru' ? 'Предъявите QR-код или номер при получении' : 'Présentez le QR-code ou le numéro à la réception'}</li>
                </ul>
              </div>

              <button 
                onClick={() => { setShowOrderForm(false); setOrderConfirmed(false); setOrderForm({ code: '', phone: '', address: '', payment: 'CFA' }) }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold"
              >
                {lang === 'ru' ? 'Закрыть' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bambara Course Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-5xl">📚</span>
            <div>
              <h3 className="text-xl font-bold">{t('Изучите Бамбара!', 'Apprenez le Bambara!')}</h3>
              <p className="text-green-200 text-sm">{t('Базовый язык Мали для общения с местными', 'Langue de base du Mali pour communiquer')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 md:ml-auto">
            <Link to="/bambara-course" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
              📖 {t('Начать учить', 'Commencer le cours')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🇲🇱</span>
                <span className="font-bold">{t('Магазин для Русских в Мали', 'Boutique Mali pour Russes')}</span>
              </div>
              <p className="text-sm text-gray-400">
                {lang === 'ru' 
                  ? 'Товары Мали для русских военных и гостей' 
                  : 'Produits maliens pour les militaires et visiteurs russes'}
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">{lang === 'ru' ? 'Контакт' : 'Contact'}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +223 XX XX XX XX</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Bamako, Mali</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8:00 - 18:00</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">{lang === 'ru' ? 'Сервисы' : 'Services'}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>🎁 {lang === 'ru' ? 'Сувениры' : 'Souvenirs'}</li>
                <li>🍷 {lang === 'ru' ? 'Алкоголь' : 'Alcool'}</li>
                <li>🛒 {lang === 'ru' ? 'Продукты' : 'Alimentation'}</li>
                <li>💱 {lang === 'ru' ? 'Обмен валюты' : 'Échange de devises'}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
            <p>🇷🇺 R-Market Russian • Bamako, Mali 🇲🇱 • {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
