import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, ArrowRightLeft, Gift, Wine, ShoppingBag, Phone, MapPin, Clock, Star, Truck, Globe, Home, Check, Send, MessageCircle } from 'lucide-react'
import { russianProducts, russianCategories } from '../data/russianProducts'
import SEO from '../components/SEO'
import CartAnimation from '../components/CartAnimation'
import { supabase } from '../lib/supabase'

interface CartItem {
  id: number
  name: string
  nameRu: string
  price: number
  image: string
  quantity: number
}

type Lang = 'ru' | 'fr' | 'en'

const translations: Record<string, Record<Lang, string>> = {
  'site_title': { ru: 'Магазин R-Market', fr: 'Boutique Mali pour Russes', en: 'Shop for Russians in Mali' },
  'site_subtitle': { ru: 'Товары и услуги', fr: 'Produits Mali pour militaires', en: 'Mali products for military' },
  'search': { ru: 'Поиск товаров...', fr: 'Rechercher...', en: 'Search products...' },
  'exchange': { ru: 'Обмен валюты', fr: 'Échange de devises', en: 'Currency exchange' },
  'cart': { ru: 'Корзина', fr: 'Panier', en: 'Cart' },
  'empty_cart': { ru: 'Корзина пуста', fr: 'Panier vide', en: 'Cart is empty' },
  'add_to_cart': { ru: 'В корзину', fr: 'Ajouter', en: 'Add to cart' },
  'order': { ru: 'Оформить заказ', fr: 'Commander', en: 'Place order' },
  'confirm_order': { ru: 'Подтвердить заказ', fr: 'Confirmer la commande', en: 'Confirm order' },
  'order_confirmed': { ru: 'Заказ подтверждён!', fr: 'Commande confirmée!', en: 'Order confirmed!' },
  'products_count': { ru: 'товаров', fr: 'produits', en: 'products' },
  'delivery': { ru: 'Доставка', fr: 'Livraison', en: 'Delivery' },
  'location': { ru: 'Локация', fr: 'Localisation', en: 'Location' },
  'contact': { ru: 'Контакт', fr: 'Contact', en: 'Contact' },
  'your_code': { ru: 'Ваш код (для доставки)', fr: 'Votre code (pour livraison)', en: 'Your code (for delivery)' },
  'whatsapp': { ru: 'WhatsApp', fr: 'WhatsApp', en: 'WhatsApp' },
  'telegram': { ru: 'Telegram', fr: 'Telegram', en: 'Telegram' },
  'optional': { ru: 'необязательно', fr: 'optionnel', en: 'optional' },
  'address': { ru: 'Адрес доставки', fr: 'Adresse de livraison', en: 'Delivery address' },
  'payment_currency': { ru: 'Валюта оплаты', fr: 'Devise de paiement', en: 'Payment currency' },
  'total': { ru: 'Итого', fr: 'Total', en: 'Total' },
  'close': { ru: 'Закрыть', fr: 'Fermer', en: 'Close' },
  'calculate': { ru: 'Рассчитать', fr: 'Calculer', en: 'Calculate' },
  'result': { ru: 'Результат', fr: 'Résultat', en: 'Result' },
  'exchange_note': { ru: 'Обмен наличных: Свяжитесь с нами для физического обмена', fr: 'Échange en espèces: Contactez-nous pour un échange physique', en: 'Cash exchange: Contact us for physical exchange' },
  'what_to_do': { ru: 'Что делать:', fr: 'Que faire:', en: 'What to do:' },
  'screenshot': { ru: 'Сделайте скриншот этого экрана', fr: 'Faites une capture d\'écran', en: 'Take a screenshot' },
  'print_qr': { ru: 'Или распечатайте QR-код', fr: 'Ou imprimez le QR-code', en: 'Or print the QR code' },
  'driver_contact': { ru: 'Ливрёр свяжется с вами по WhatsApp', fr: 'Le livreur vous contactera sur WhatsApp', en: 'The driver will contact you via WhatsApp' },
  'show_qr': { ru: 'Предъявите QR-код или номер при получении', fr: 'Présentez le QR-code ou le numéro à la réception', en: 'Show QR code or number at reception' },
  'anonymous_order': { ru: 'Анонимный заказ. Только код для доставки.', fr: 'Commande anonyme. Seul le code est utilisé pour la livraison.', en: 'Anonymous order. Only code for delivery.' },
  'services': { ru: 'Сервисы', fr: 'Services', en: 'Services' },
  'souvenirs': { ru: 'Сувениры', fr: 'Souvenirs', en: 'Souvenirs' },
  'alcohol': { ru: 'Алкоголь', fr: 'Alcool', en: 'Alcohol' },
  'food': { ru: 'Продукты', fr: 'Alimentation', en: 'Food' },
  'malian_products': { ru: 'Товары Мали', fr: 'Produits Mali', en: 'Mali Products' },
  'back_to_rmarket': { ru: 'R-Market', fr: 'R-Market', en: 'R-Market' },
  'delivery_info': { ru: 'Доставка по базам и отелям Бамако', fr: 'Livraison aux bases et hôtels de Bamako', en: 'Delivery to bases and hotels in Bamako' },
  'bamako_mali': { ru: 'Бамако, Мали', fr: 'Bamako, Mali', en: 'Bamako, Mali' },
  'footer_text': { ru: 'Товары из Мали', fr: 'Produits du Mali', en: 'Products from Mali' },
  // Product request
  'request_products': { ru: 'Заказать продукты питание из Бамако', fr: 'Commander produits alimentaires de Bamako', en: 'Order food products from Bamako' },
  'request_products_title': { ru: 'Что вам нужно?', fr: 'De quoi avez-vous besoin?', en: 'What do you need?' },
  'request_products_placeholder': { ru: 'Например: молоко, хлеб, яйца, кофе...', fr: 'Ex: lait, pain, œufs, café...', en: 'Ex: milk, bread, eggs, coffee...' },
  'request_products_help': { ru: 'Напишите список продуктов, которые вы хотите заказать', fr: 'Écrivez la liste des produits que vous souhaitez commander', en: 'Write the list of products you want to order' },
  'send_request': { ru: 'Отправить запрос', fr: 'Envoyer la demande', en: 'Send request' },
  'request_sent': { ru: 'Запрос отправлен!', fr: 'Demande envoyée!', en: 'Request sent!' },
  'your_contact': { ru: 'Ваш контакт', fr: 'Votre contact', en: 'Your contact' },
  'phone_required': { ru: 'Номер телефона *', fr: 'Numéro de téléphone *', en: 'Phone number *' },
  'confirm_call': { ru: 'Nous vous appellerons pour confirmer', fr: 'Nous vous appellerons pour confirmer', en: 'We will call you to confirm' },
  // Order from Russia
  'order_from_russia': { ru: 'Заказать из России', fr: 'Commander depuis la Russie', en: 'Order from Russia' },
  'order_from_russia_title': { ru: 'Заказ из России', fr: 'Commande depuis la Russie', en: 'Order from Russia' },
  'order_from_russia_desc': { ru: 'Доставка из России в Bamako', fr: 'Livraison depuis la Russie vers Bamako', en: 'Delivery from Russia to Bamako' },
  'order_from_russia_help': { ru: 'Опишите товары, которые вы хотите заказать из России. Мы купим и отправим их авиатранспортом.', fr: 'Décrivez les produits que vous souhaitez commander depuis la Russie. Nous les achèterons et enverrons par fret aérien.', en: 'Describe the products you want to order from Russia. We will purchase and send them by air freight.' },
  'order_from_russia_placeholder': { ru: 'Например: лекарства, консервы, одежда, электроника...', fr: 'Ex: médicaments, conserves, vêtements, électronique...', en: 'Ex: medicines, canned goods, clothing, electronics...' },
  'estimated_weight': { ru: 'Примерный вес (кг)', fr: 'Poids estimé (kg)', en: 'Estimated weight (kg)' },
  'shipping_cost': { ru: 'Стоимость доставки', fr: 'Frais de livraison', en: 'Shipping cost' },
  'per_kg': { ru: 'за кг', fr: 'par kg', en: 'per kg' },
  'delivery_time': { ru: 'Срок доставки', fr: 'Délai de livraison', en: 'Delivery time' },
  'days': { ru: 'дней', fr: 'jours', en: 'days' },
  'send_order': { ru: 'Отправить заказ', fr: 'Envoyer la commande', en: 'Send order' },
  'order_sent': { ru: 'Заказ отправлен!', fr: 'Commande envoyée!', en: 'Order sent!' },
  'russia_shipping': { ru: 'Доставка из России', fr: 'Livraison depuis la Russie', en: 'Russia Delivery' },
}

export default function RussianShop() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showExchange, setShowExchange] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showProductRequest, setShowProductRequest] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lang, setLang] = useState<Lang>('ru')
  const [showLangMenu, setShowLangMenu] = useState(false)

  const t = (key: string) => translations[key]?.[lang] || key

  const [exchangeFrom, setExchangeFrom] = useState('USD')
  const [exchangeAmount, setExchangeAmount] = useState('')
  const [exchangeResult, setExchangeResult] = useState('')
  const [exchangeContact, setExchangeContact] = useState('')
  const [exchangeCode, setExchangeCode] = useState('')

  const [orderForm, setOrderForm] = useState({
    code: '',
    whatsapp: '',
    telegram: '',
    address: '',
    payment: 'CFA'
  })
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderCode, setOrderCode] = useState('')
  
  // Cart animation
  const [showCartAnimation, setShowCartAnimation] = useState(false)
  const [animationProductImage, setAnimationProductImage] = useState('')

  const [productRequest, setProductRequest] = useState('')
  const [productRequestSent, setProductRequestSent] = useState(false)
  const [productRequestForm, setProductRequestForm] = useState({
    products: '',
    code: '',
    whatsapp: '',
    telegram: ''
  })

  // Order from Russia
  const [showOrderFromRussia, setShowOrderFromRussia] = useState(false)
  const [orderFromRussiaForm, setOrderFromRussiaForm] = useState({
    products: '',
    weight: '',
    code: '',
    contact: '',
    telegram: '',
    address: ''
  })
  const [orderFromRussiaSent, setOrderFromRussiaSent] = useState(false)

  // Exchange rates from localStorage (admin can change)
  const [exchangeRate, setExchangeRate] = useState(600)

  useEffect(() => {
    const savedRate = localStorage.getItem('rmarket_usd_rate')
    if (savedRate) {
      setExchangeRate(parseFloat(savedRate))
    }
  }, [])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartTotalUSD = (cartTotal / exchangeRate).toFixed(2)

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
    
    // Trigger cart animation
    setAnimationProductImage(product.image)
    setShowCartAnimation(true)
  }

  const handleAnimationComplete = useCallback(() => {
    setShowCartAnimation(false)
  }, [])

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
    if (exchangeFrom === 'USD') {
      setExchangeResult((amount * exchangeRate).toLocaleString())
    } else {
      setExchangeResult((amount / exchangeRate).toFixed(2))
    }
  }

  const categoryIcons: Record<string, any> = {
    all: ShoppingBag,
    souvenirs: Gift,
    alcohol: Wine,
    food: ShoppingBag,
    exchange: ArrowRightLeft
  }

  const getProductDisplay = (product: typeof russianProducts[0]) => {
    switch(lang) {
      case 'ru': return { name: product.nameRu, desc: product.descriptionRu }
      case 'fr': return { name: product.name, desc: product.description }
      case 'en': return { name: product.nameRu, desc: product.descriptionRu }
      default: return { name: product.nameRu, desc: product.descriptionRu }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SEO 
        title={t('site_title')}
        description={t('site_subtitle')}
        image="https://i.ibb.co/QnTr9zG/r-market-logo.png"
        url="https://r-market.shop/russian"
      />
      
      {/* Cart Animation */}
      <CartAnimation 
        show={showCartAnimation} 
        productImage={animationProductImage}
        onComplete={handleAnimationComplete}
      />
      
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="bg-blue-900">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇲🇱</span>
              <span className="text-sm font-medium text-blue-200">{t('malian_products')}</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)} 
                  className="text-sm text-blue-200 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-800"
                >
                  <Globe className="w-4 h-4" />
                  {lang === 'ru' ? '🇷🇺 RU' : lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                    <button 
                      onClick={() => { setLang('ru'); setShowLangMenu(false) }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                    >
                      🇷🇺 Русский
                    </button>
                    <button 
                      onClick={() => { setLang('fr'); setShowLangMenu(false) }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                    >
                      🇫🇷 Français
                    </button>
                    <button 
                      onClick={() => { setLang('en'); setShowLangMenu(false) }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                    >
                      🇬🇧 English
                    </button>
                  </div>
                )}
              </div>
              <Link to="/" className="text-sm text-blue-200 hover:text-white flex items-center gap-1">
                <Home className="w-4 h-4" />
                {t('back_to_rmarket')}
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
                {t('site_title')}
              </h1>
              <p className="text-sm text-gray-400">{t('site_subtitle')}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
<button onClick={() => setShowProductRequest(true)} className="flex items-center gap-2 px-4 py-2 bg-green-700 rounded-lg text-sm text-green-100 hover:bg-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                {t('request_products')}
              </button>
              <button onClick={() => setShowOrderFromRussia(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-700 rounded-lg text-sm text-purple-100 hover:bg-purple-600 transition-colors">
                <Truck className="w-4 h-4" />
                {t('order_from_russia')}
              </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search')}
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
          <button onClick={() => setShowCart(true)} className="md:hidden p-2 text-gray-400 relative">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700 p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('search')} 
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-sm" 
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setLang('ru'); setMobileMenuOpen(false) }}
              className={`flex-1 py-2 rounded-lg text-sm ${lang === 'ru' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              🇷🇺 RU
            </button>
            <button 
              onClick={() => { setLang('fr'); setMobileMenuOpen(false) }}
              className={`flex-1 py-2 rounded-lg text-sm ${lang === 'fr' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              🇫🇷 FR
            </button>
            <button 
              onClick={() => { setLang('en'); setMobileMenuOpen(false) }}
              className={`flex-1 py-2 rounded-lg text-sm ${lang === 'en' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              🇬🇧 EN
            </button>
          </div>
          <button onClick={() => { setShowProductRequest(true); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 bg-green-700 rounded-lg">
            <MessageCircle className="w-5 h-5 text-green-200" />
            <span>{t('request_products')}</span>
          </button>
          <button onClick={() => { setShowOrderFromRussia(true); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 bg-purple-700 rounded-lg">
            <Truck className="w-5 h-5 text-purple-200" />
            <span>{t('order_from_russia')}</span>
          </button>
          <button onClick={() => { setShowCart(true); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
            <span>{t('cart')} ({cart.length})</span>
          </button>
          <button onClick={() => { setShowExchange(true); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg">
            <ArrowRightLeft className="w-5 h-5 text-green-400" />
            <span>{t('exchange')}</span>
          </button>
          <button onClick={() => { setShowCart(true); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
            <span>{t('cart')} ({cart.length})</span>
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
      <div className="bg-gradient-to-r from-green-800 to-green-900 py-2 md:py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 text-green-300" />
            <div className="flex items-center gap-2 md:gap-6 text-xs md:text-sm">
              <span className="text-green-200">1 USD = <strong className="text-white">{exchangeRate.toLocaleString()} CFA</strong></span>
            </div>
          </div>
          <button onClick={() => setShowExchange(true)} className="text-xs md:text-sm text-green-300 hover:text-white flex items-center gap-1">
            {t('exchange')} <ArrowRightLeft className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Professional Banner - Services */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-red-900 rounded-2xl p-6 md:p-8 mb-8 text-white">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('site_title')}
            </h1>
            <p className="text-blue-200 text-sm md:text-base">
              {t('site_subtitle')} • {t('delivery_info')}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setShowExchange(true)} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all">
              <ArrowRightLeft className="w-5 h-5" />
              {t('exchange')}
            </button>
            <button onClick={() => setShowProductRequest(true)} className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-800 px-6 py-3 rounded-xl font-semibold hover:from-green-800 hover:to-green-900 transition-all">
              <MessageCircle className="w-5 h-5" />
              {t('request_products')}
            </button>
            <button onClick={() => setShowOrderFromRussia(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all">
              <Truck className="w-5 h-5" />
              {t('order_from_russia')}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {activeCategory !== 'exchange' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {lang === 'ru' 
                  ? russianCategories.find(c => c.id === activeCategory)?.name 
                  : russianCategories.find(c => c.id === activeCategory)?.nameFr}
              </h2>
              <span className="text-sm text-gray-400">{searchedProducts.length} {t('products_count')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchedProducts.map(product => {
                const display = getProductDisplay(product)
                return (
                  <Link 
                    key={product.id} 
                    to={`/russian/product/${product.id}`}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all group block"
                  >
                    <div className="relative">
                      <img src={product.image} alt={display.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white truncate">{display.name}</h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{display.desc}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-green-400">{product.price.toLocaleString()} F</span>
                        <span className="text-xs text-gray-500">(${(product.price / exchangeRate).toFixed(2)})</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        {product.rating}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('add_to_cart')}
                      </button>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <Truck className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">{t('delivery')}</h3>
            <p className="text-sm text-gray-400">{t('delivery_info')}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <MapPin className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">{t('location')}</h3>
            <p className="text-sm text-gray-400">{t('bamako_mali')}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <Phone className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">{t('contact')}</h3>
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
                {t('cart')}
              </h2>
              <button onClick={() => setShowCart(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  {t('empty_cart')}
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
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 text-xs">{lang === 'ru' ? 'Удалить' : lang === 'fr' ? 'Supprimer' : 'Remove'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">{t('total')} CFA:</span>
                      <span className="font-bold text-green-400">{cartTotal.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('total')} USD:</span>
                      <span className="font-bold">${cartTotalUSD}</span>
                    </div>
                  </div>

                  <button onClick={() => { setShowCart(false); setShowOrderForm(true) }} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors">
                    {t('order')}
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
                {t('exchange')}
              </h2>
              <button onClick={() => setShowExchange(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'От' : lang === 'fr' ? 'De' : 'From'}</label>
                  <select 
                    value={exchangeFrom}
                    onChange={e => setExchangeFrom(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg"
                  >
                    <option value="USD">🇺🇸 USD (Dollar)</option>
                    <option value="CFA">🇲🇱 CFA (Franc)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{lang === 'ru' ? 'Сумма' : lang === 'fr' ? 'Montant' : 'Amount'}</label>
                  <input 
                    type="number"
                    value={exchangeAmount}
                    onChange={e => setExchangeAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg"
                  />
                </div>
                <button onClick={handleExchange} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
                  {t('calculate')}
                </button>
                {exchangeResult && (
                  <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{exchangeResult} {exchangeFrom === 'CFA' ? 'USD' : 'CFA'}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                <h3 className="text-white font-medium">{t('your_contact')}</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t('your_code')} *</label>
                  <input 
                    type="text"
                    value={exchangeCode}
                    onChange={e => setExchangeCode(e.target.value.toUpperCase())}
                    placeholder={lang === 'ru' ? 'Например: RUS-7823' : lang === 'fr' ? 'Ex: RUS-7823' : 'Ex: RUS-7823'}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    {t('phone_required')}
                  </label>
                  <input 
                    type="tel"
                    value={exchangeContact}
                    onChange={e => setExchangeContact(e.target.value)}
                    placeholder="+223 XX XX XX XX"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (exchangeResult && exchangeCode && exchangeContact) {
                      const message = `${t('exchange')}:\n\n${exchangeAmount} ${exchangeFrom} = ${exchangeResult} ${exchangeFrom === 'CFA' ? 'USD' : 'CFA'}\n\nКод: ${exchangeCode}\nWhatsApp: ${exchangeContact}`
                      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
                    }
                  }}
                  disabled={!exchangeResult || !exchangeCode || !exchangeContact}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
                >
                  {t('send_request')}
                </button>
              </div>

              <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  {t('exchange_note')}
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
              <h2 className="text-xl font-bold">{lang === 'ru' ? 'Оформление заказа' : lang === 'fr' ? 'Commande' : 'Order'}</h2>
              <button onClick={() => setShowOrderForm(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('your_code')} *</label>
                <input 
                  type="text"
                  value={orderForm.code}
                  onChange={e => setOrderForm({...orderForm, code: e.target.value.toUpperCase()})}
                  placeholder={lang === 'ru' ? 'Например: RUS-7823' : lang === 'fr' ? 'Ex: RUS-7823' : 'Ex: RUS-7823'}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {lang === 'ru' 
                    ? 'Код для идентификации при доставке' 
                    : lang === 'fr' ? 'Code pour identification à la livraison' : 'Code for delivery identification'}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  {t('whatsapp')} *
                </label>
                <input 
                  type="tel"
                  value={orderForm.whatsapp}
                  onChange={e => setOrderForm({...orderForm, whatsapp: e.target.value})}
                  placeholder="+223 XX XX XX XX"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" />
                  {t('telegram')} ({t('optional')})
                </label>
                <input 
                  type="text"
                  value={orderForm.telegram}
                  onChange={e => setOrderForm({...orderForm, telegram: e.target.value})}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('address')} *</label>
                <input 
                  type="text"
                  value={orderForm.address}
                  onChange={e => setOrderForm({...orderForm, address: e.target.value})}
                  placeholder={lang === 'ru' ? 'База / Отель / Район' : lang === 'fr' ? 'Base / Hôtel / Quartier' : 'Base / Hotel / Area'}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('payment_currency')}</label>
                <select 
                  value={orderForm.payment}
                  onChange={e => setOrderForm({...orderForm, payment: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                >
                  <option value="CFA">🇲🇱 CFA</option>
                  <option value="USD">🇺🇸 USD</option>
                </select>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">{t('total')}:</span>
                  <span className="font-bold">
                    {orderForm.payment === 'CFA' ? `${cartTotal.toLocaleString()} F` :
                     `$${cartTotalUSD}`}
                  </span>
                </div>
              </div>

              <button 
                onClick={async () => {
                  const code = orderForm.code || `RUS-${Math.floor(1000 + Math.random() * 9000)}`
                  
                  // Sauvegarder commande dans Supabase
                  const orderData = {
                    order_number: code,
                    client_name: orderForm.whatsapp || 'Client Russe',
                    client_phone: orderForm.whatsapp || '',
                    client_address: orderForm.address,
                    items: JSON.stringify(cart.map(item => ({
                      name: item.nameRu || item.name,
                      price: item.price,
                      quantity: item.quantity
                    }))),
                    total: cartTotal,
                    status: 'pending',
                    type: 'russian',
                    created_at: new Date().toISOString()
                  }

                  const { error } = await supabase.from('commandes').insert(orderData)

                  if (error) {
                    console.error('Erreur:', error)
                  } else {
                    // Envoyer notification WhatsApp
                    const itemsList = cart.map(item => `• ${item.nameRu || item.name} x${item.quantity} = ${item.price} CFA`).join('%0A')
                    const message = `🛒 R-MARKET - NOUVELLE COMMANDE:%0A%0A${code}%0AClient: ${orderForm.whatsapp}%0AAdresse: ${orderForm.address}%0A%0AArticles:%0A${itemsList}%0A%0ATotal: ${cartTotal} CFA`
                    window.open(`https://wa.me/?text=${message}`, '_blank')
                  }

                  setOrderCode(code)
                  setOrderConfirmed(true)
                  setCart([])
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
              >
                {t('confirm_order')}
              </button>

              <p className="text-xs text-gray-400 text-center">
                {t('anonymous_order')}
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
                {t('order_confirmed')}
              </h2>
              <p className="text-gray-400 mb-4">
                {lang === 'ru' ? 'Ваш заказ принят!' : lang === 'fr' ? 'Votre commande est acceptée!' : 'Your order is accepted!'}
              </p>
               
              {/* QR Code */}
              <div className="bg-white rounded-2xl p-3 inline-block mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({orderCode, type: 'russian'}))}&bgcolor=ffffff&color=1a1a2e&margin=4`}
                  alt="QR Code Commande"
                  className="w-40 h-40 mx-auto"
                />
              </div>

              {/* Numéro de commande */}
              <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-xl p-4 mb-4">
                <p className="text-white/80 text-xs mb-1">{lang === 'ru' ? 'Номер заказа' : lang === 'fr' ? 'Numéro de commande' : 'Order number'}</p>
                <p className="text-3xl font-bold text-white font-mono tracking-wider">{orderCode}</p>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                📸 {lang === 'ru' ? 'Сохраните скриншот' : lang === 'fr' ? 'Faites une capture d\'écran' : 'Take a screenshot'}
              </p>

              <button
                onClick={() => { setShowOrderForm(false); setOrderConfirmed(false); setOrderForm({ code: '', whatsapp: '', telegram: '', address: '', payment: 'CFA' }) }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Request Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-5xl">🛒</span>
            <div>
              <h3 className="text-xl font-bold">{t('request_products_title')}</h3>
              <p className="text-green-200 text-sm">{t('request_products_help')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 md:ml-auto">
            <button onClick={() => setShowProductRequest(true)} className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
              📝 {t('request_products')}
            </button>
          </div>
        </div>
      </div>

      {/* Order from Russia Banner */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-5xl">✈️</span>
            <div>
              <h3 className="text-xl font-bold">{t('order_from_russia_title')}</h3>
              <p className="text-purple-200 text-sm">{t('order_from_russia_desc')}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:ml-auto">
            <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">
              <span className="font-bold">10$</span> {t('per_kg')} • 7-14 {t('days')}
            </div>
            <button onClick={() => setShowOrderFromRussia(true)} className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
              📦 {t('order_from_russia')}
            </button>
          </div>
        </div>
      </div>

      {/* Product Request Modal */}
      {showProductRequest && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
          <div className="bg-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-green-400" />
                {t('request_products')}
              </h2>
              <button onClick={() => setShowProductRequest(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-400 text-sm">
                {t('request_products_help')}
              </p>
              
              <textarea
                value={productRequestForm.products}
                onChange={e => setProductRequestForm({...productRequestForm, products: e.target.value})}
                placeholder={t('request_products_placeholder')}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
              />
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('your_code')} *</label>
                <input 
                  type="text"
                  value={productRequestForm.code}
                  onChange={e => setProductRequestForm({...productRequestForm, code: e.target.value.toUpperCase()})}
                  placeholder={lang === 'ru' ? 'Например: RUS-7823' : lang === 'fr' ? 'Ex: RUS-7823' : 'Ex: RUS-7823'}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  {t('phone_required')}
                </label>
                <input 
                  type="tel"
                  value={productRequestForm.whatsapp}
                  onChange={e => setProductRequestForm({...productRequestForm, whatsapp: e.target.value})}
                  placeholder="+223 XX XX XX XX"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" />
                  Telegram ({t('optional')})
                </label>
                <input 
                  type="text"
                  value={productRequestForm.telegram}
                  onChange={e => setProductRequestForm({...productRequestForm, telegram: e.target.value})}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              
              <p className="text-xs text-green-400 text-center">
                📞 {t('confirm_call')}
              </p>
              
              <button 
                onClick={() => {
                  if (productRequestForm.products.trim() && productRequestForm.code && productRequestForm.whatsapp) {
                    const message = `${t('request_products')}:\n\nПродукты: ${productRequestForm.products}\n\nКод: ${productRequestForm.code}\nWhatsApp: ${productRequestForm.whatsapp}\nTelegram: ${productRequestForm.telegram || 'N/A'}`
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
                    setProductRequestSent(true)
                    setTimeout(() => {
                      setShowProductRequest(false)
                      setProductRequestSent(false)
                      setProductRequestForm({ products: '', code: '', whatsapp: '', telegram: '' })
                    }, 2000)
                  }
                }}
                disabled={!productRequestForm.products.trim() || !productRequestForm.code || !productRequestForm.whatsapp}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {t('send_request')}
              </button>

              {productRequestSent && (
                <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-center">
                  <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 font-medium">{t('request_sent')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order from Russia Modal */}
      {showOrderFromRussia && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
          <div className="bg-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Truck className="w-6 h-6 text-purple-400" />
                {t('order_from_russia_title')}
              </h2>
              <button onClick={() => setShowOrderFromRussia(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-300 text-sm">{t('shipping_cost')}:</span>
                  <span className="text-white font-bold">10$ / kg</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-300 text-sm">{t('delivery_time')}:</span>
                  <span className="text-white font-bold">7-14 {t('days')}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {lang === 'ru' ? 'Товары' : lang === 'fr' ? 'Produits' : 'Products'} *
                </label>
                <textarea
                  value={orderFromRussiaForm.products}
                  onChange={e => setOrderFromRussiaForm({...orderFromRussiaForm, products: e.target.value})}
                  placeholder={t('order_from_russia_placeholder')}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('estimated_weight')} *</label>
                <input 
                  type="number"
                  value={orderFromRussiaForm.weight}
                  onChange={e => setOrderFromRussiaForm({...orderFromRussiaForm, weight: e.target.value})}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('your_code')} *</label>
                <input 
                  type="text"
                  value={orderFromRussiaForm.code}
                  onChange={e => setOrderFromRussiaForm({...orderFromRussiaForm, code: e.target.value.toUpperCase()})}
                  placeholder={lang === 'ru' ? 'Например: RUS-7823' : lang === 'fr' ? 'Ex: RUS-7823' : 'Ex: RUS-7823'}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  WhatsApp *
                </label>
                <input 
                  type="tel"
                  value={orderFromRussiaForm.contact}
                  onChange={e => setOrderFromRussiaForm({...orderFromRussiaForm, contact: e.target.value})}
                  placeholder="+223 XX XX XX XX"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" />
                  Telegram ({t('optional')})
                </label>
                <input 
                  type="text"
                  value={orderFromRussiaForm.telegram}
                  onChange={e => setOrderFromRussiaForm({...orderFromRussiaForm, telegram: e.target.value})}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('address')} *</label>
                <input 
                  type="text"
                  value={orderFromRussiaForm.address}
                  onChange={e => setOrderFromRussiaForm({...orderFromRussiaForm, address: e.target.value})}
                  placeholder={lang === 'ru' ? 'База / Отель / Район' : lang === 'fr' ? 'Base / Hôtel / Quartier' : 'Base / Hotel / Area'}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>

              {orderFromRussiaForm.weight && parseFloat(orderFromRussiaForm.weight) > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{t('shipping_cost')}:</span>
                    <span className="text-xl font-bold text-purple-400">${(parseFloat(orderFromRussiaForm.weight) * 10).toFixed(0)}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  if (orderFromRussiaForm.products.trim() && orderFromRussiaForm.weight && orderFromRussiaForm.contact && orderFromRussiaForm.address) {
                    const shippingCost = (parseFloat(orderFromRussiaForm.weight) * 10).toFixed(0)
                    const message = `${t('russia_shipping')}:\n\n${t('order_from_russia_title')}\n\nТовары / Produits: ${orderFromRussiaForm.products}\nВес / Poids: ${orderFromRussiaForm.weight} kg\nСтоимость доставки / Frais de livraison: ${shippingCost}$\n\nКод: ${orderFromRussiaForm.code}\nWhatsApp: ${orderFromRussiaForm.contact}\nTelegram: ${orderFromRussiaForm.telegram || 'N/A'}\nАдрес / Adresse: ${orderFromRussiaForm.address}`
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
                    setOrderFromRussiaSent(true)
                    setTimeout(() => {
                      setShowOrderFromRussia(false)
                      setOrderFromRussiaSent(false)
                      setOrderFromRussiaForm({ products: '', weight: '', code: '', contact: '', telegram: '', address: '' })
                    }, 3000)
                  }
                }}
                disabled={!orderFromRussiaForm.products.trim() || !orderFromRussiaForm.weight || !orderFromRussiaForm.code || !orderFromRussiaForm.contact || !orderFromRussiaForm.address}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {t('send_order')}
              </button>

              {orderFromRussiaSent && (
                <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-4 text-center">
                  <Check className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-300 font-medium">{t('order_sent')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🇲🇱</span>
                <span className="font-bold">{t('site_title')}</span>
              </div>
              <p className="text-sm text-gray-400">
                {t('footer_text')}
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('contact')}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +223 XX XX XX XX</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Bamako, Mali</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8:00 - 18:00</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('services')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>🎁 {t('souvenirs')}</li>
                <li>🍷 {t('alcohol')}</li>
                <li>🛒 {t('food')}</li>
                <li>💱 {t('exchange')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
            <p>🇷🇺 R-Market Russian • Bamako, Mali 🇲🇱 • {new Date().getFullYear()}</p>
            <Link to="/russian-login" className="text-gray-600 hover:text-gray-400 mt-2 inline-block">
              •••
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
