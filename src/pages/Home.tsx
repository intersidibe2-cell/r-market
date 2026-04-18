import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RefreshCw, Star, Zap, TrendingUp, Clock, Globe, Users, Heart, MapPin, Phone, MessageCircle, Gift } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/HeroSlider'
import SEO from '../components/SEO'
import { categories as defaultCategories } from '../data/products'
import { loadProducts } from '../lib/products'
import { useState, useEffect } from 'react'

// Charger les catégories personnalisées depuis localStorage
function loadCustomCategories() {
  try {
    const saved = localStorage.getItem('rmarket_categories')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading categories:', e)
  }
  return null
}

// Flash sale timer — expire à minuit chaque jour
const getFlashTimer = () => {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 0)
  const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000))
  const h = Math.floor(diff / 3600).toString().padStart(2, '0')
  const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
  const s = (diff % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [flashTimer, setFlashTimer] = useState(getFlashTimer())
  const [customCategories, setCustomCategories] = useState<any[]>([])
  
  useEffect(() => {
    loadProducts().then(data => setProducts(data))
  }, [])

  useEffect(() => {
    const saved = loadCustomCategories()
    if (saved) {
      setCustomCategories(saved)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setFlashTimer(getFlashTimer()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Utiliser les catégories personnalisées si elles existent, sinon les catégories par défaut
  const categories = customCategories.length > 0 ? customCategories : defaultCategories
  
  const bestSellers = [...products].sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0)).slice(0, 8)
  const newProducts = products.filter(p => p.badge === 'Nouveau' || p.badge === 'Tendance').slice(0, 4)
  const promoProducts = products.filter(p => p.badge === 'Promo').slice(0, 4)

  return (
    <div>
      <SEO 
        title="R-Market - E-commerce Mali 🇲🇱"
        description="Votre boutique en ligne au Mali. Mode, électronique, santé, maison et plus encore. Livraison rapide à Bamako et dans tout le Mali."
        image="https://i.ibb.co/QnTr9zG/r-market-logo.png"
        url="https://r-market.shop"
      />
      
      {/* Hero Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <HeroSlider />
      </section>

      {/* Features bar - improved */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: "Livraison rapide", sub: "Tout le Mali", color: "text-green-100" },
              { icon: Shield, text: "Paiement sécurisé", sub: "OM / Moov / Wave", color: "text-green-100" },
              { icon: RefreshCw, text: "Retour gratuit", sub: "14 jours", color: "text-green-100" },
              { icon: TrendingUp, text: "Meilleurs prix", sub: "Garanti", color: "text-green-100" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.text}</p>
                  <p className={`text-xs ${f.color}`}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Catégories</h2>
            <Link to="/shop" className="text-green-400 text-sm font-medium hover:text-green-300 flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.filter(c => c.id !== 'all').map(cat => (
              <Link
                key={cat.id}
                to={
                  cat.id === 'adulte' ? '/adult' : 
                  cat.id === 'internationale' ? '/international' : 
                  `/shop?category=${cat.id}`
                }
                className="bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:ring-2 hover:ring-green-500/50 transition-all group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="text-white text-sm font-semibold">{cat.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-red-500 fill-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Ventes Flash</h2>
              </div>
              <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Clock className="w-3 h-3" />
                {flashTimer}
              </div>
            </div>
            <Link to="/shop" className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {promoProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Meilleures ventes</h2>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">TOP</span>
            </div>
            <Link to="/shop" className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-400 text-sm">Produits disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">11</div>
              <div className="text-gray-400 text-sm">Régions du Mali</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Support client</div>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Nouveautés</h2>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">NEW</span>
            </div>
            <Link to="/shop" className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative z-10">
                <span className="text-sm font-medium text-green-200">Collection spéciale</span>
                <h3 className="text-2xl font-bold mt-1 mb-3">Artisanat Malien 🇲🇱</h3>
                <p className="text-green-200 text-sm mb-4">Bazin, wax, bijoux et plus encore</p>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Découvrir <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/10 rounded-tl-full" />
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative z-10">
                <span className="text-sm font-medium text-yellow-100">Mode</span>
                <h3 className="text-2xl font-bold mt-1 mb-3">Vêtements Traditionnels 👗</h3>
                <p className="text-yellow-100 text-sm mb-4">Boubou, pagnes, robes bazin</p>
                <Link to="/shop?category=mode" className="inline-flex items-center gap-2 bg-white text-orange-600 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Voir collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/10 rounded-tl-full" />
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative z-10">
                <span className="text-sm font-medium text-blue-100">Tech</span>
                <h3 className="text-2xl font-bold mt-1 mb-3">Électronique 📱</h3>
                <p className="text-blue-100 text-sm mb-4">Smartphones, TV, accessoires</p>
                <Link to="/shop?category=electronique" className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Explorer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/10 rounded-tl-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ce que disent nos clients</h2>
            <p className="text-gray-600">Des milliers de clients satisfaits à travers le Mali</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Moussa D.", city: "Bamako", text: "Excellent service ! Livraison rapide et produits de qualité. Je recommande vivement.", rating: 5 },
              { name: "Fatou K.", city: "Ségou", text: "Très satisfaite de mes achats. Le paiement mobile est très pratique.", rating: 5 },
              { name: "Ibrahim T.", city: "Mopti", text: "Meilleur site e-commerce du Mali. Les prix sont imbattables !", rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {review.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Russian Shop Banner */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-4xl">🇲🇱</span>
            <ArrowRight className="w-6 h-6 text-white/50" />
            <span className="text-4xl">🇷🇺</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Boutique Russe</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Produits maliens au Mali. Souvenirs, artisanat, alimentation et plus encore.
          </p>
          <Link 
            to="/russian" 
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Visiter la boutique russe <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Gift className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Restez informé de nos offres</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Inscrivez-vous pour recevoir les meilleures promotions et nouveautés en avant-première
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Votre email" 
              className="flex-1 px-5 py-4 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" 
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Appelez-nous</h3>
              <p className="text-gray-600">+223 XX XX XX XX</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600">+223 XX XX XX XX</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-600">Bamako, Mali</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
