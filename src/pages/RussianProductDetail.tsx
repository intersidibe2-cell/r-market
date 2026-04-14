import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Minus, Plus, Check, Globe, Home } from 'lucide-react'
import { russianProducts } from '../data/russianProducts'

interface CartItem {
  id: number
  name: string
  nameRu: string
  price: number
  image: string
  quantity: number
}

export default function RussianProductDetail() {
  const { id } = useParams()
  const [lang, setLang] = useState<'ru' | 'fr'>('ru')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const product = russianProducts.find(p => p.id === Number(id))

  const t = (ru: string, fr: string) => lang === 'ru' ? ru : fr

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartTotalEUR = (cartTotal / 655.96).toFixed(2)
  const cartTotalUSD = (cartTotal / 600).toFixed(2)

  const addToCart = (product: typeof russianProducts[0], qty: number = 1) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item))
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        nameRu: product.nameRu,
        price: product.price,
        image: product.image,
        quantity: qty
      }])
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{lang === 'ru' ? 'Товар не найден' : 'Produit non trouvé'}</h1>
          <Link to="/russian" className="text-blue-400 hover:text-blue-300">
            {lang === 'ru' ? 'Вернуться в магазин' : 'Retour à la boutique'}
          </Link>
        </div>
      </div>
    )
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
          <Link to="/russian" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            {lang === 'ru' ? 'Назад в магазин' : 'Retour à la boutique'}
          </Link>

          <button onClick={() => setShowCart(true)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.badge && (
                <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  {product.badge}
                </span>
              )}
              <h1 className="text-3xl font-bold mb-2">
                {lang === 'ru' ? product.nameRu : product.name}
              </h1>
              <p className="text-gray-400">
                {lang === 'ru' ? product.descriptionRu : product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span className="font-bold">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews} {lang === 'ru' ? 'отзывов' : 'avis'})</span>
            </div>

            {/* Price */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green-400">
                  {product.price.toLocaleString()} F
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice.toLocaleString()} F
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span>€{(product.price / 655.96).toFixed(2)}</span>
                <span>${(product.price / 600).toFixed(2)}</span>
              </div>
              {product.originalPrice > product.price && (
                <div className="mt-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                {product.stock > 0 
                  ? (lang === 'ru' ? 'В наличии' : 'En stock')
                  : (lang === 'ru' ? 'Нет в наличии' : 'Rupture de stock')}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400">{lang === 'ru' ? 'Количество:' : 'Quantité:'}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-xl font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                addedToCart 
                  ? 'bg-green-600 text-white' 
                  : product.stock > 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-6 h-6" />
                  {lang === 'ru' ? 'Добавлено!' : 'Ajouté!'}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  {lang === 'ru' ? 'В корзину' : 'Ajouter au panier'}
                </>
              )}
            </button>

            {/* Info */}
            <div className="bg-gray-800 rounded-xl p-4 text-sm text-gray-400">
              <p>🚚 {lang === 'ru' ? 'Доставка по Бамако' : 'Livraison à Bamako'}</p>
              <p className="mt-1">📱 {lang === 'ru' ? 'Оплата при получении' : 'Paiement à la livraison'}</p>
            </div>
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
                ×
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
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 text-xs">
                            {lang === 'ru' ? 'Удалить' : 'Supprimer'}
                          </button>
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

                  <Link 
                    to="/russian"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center"
                  >
                    {lang === 'ru' ? 'Продолжить покупки' : 'Continuer les achats'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
