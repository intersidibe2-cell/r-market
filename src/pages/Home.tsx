import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RefreshCw, Star, Zap, TrendingUp, Clock, Globe } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/HeroSlider'
import { products, categories } from '../data/products'

export default function Home() {
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8)
  const newProducts = products.filter(p => p.badge === 'Nouveau' || p.badge === 'Tendance').slice(0, 4)
  const promoProducts = products.filter(p => p.badge === 'Promo').slice(0, 4)

  return (
    <div>
      {/* Hero Slider - Wildberries style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <HeroSlider />
      </section>

      {/* Features bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: "Livraison rapide", sub: "Tout le Mali" },
              { icon: Shield, text: "Paiement sécurisé", sub: "OM / Moov / Wave" },
              { icon: RefreshCw, text: "Retour gratuit", sub: "14 jours" },
              { icon: TrendingUp, text: "Meilleurs prix", sub: "Garanti" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.text}</p>
                  <p className="text-xs text-gray-500">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-6">Catégories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.filter(c => c.id !== 'all').map(cat => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-white text-sm font-semibold">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Ventes Flash</h2>
              </div>
              <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" />
                02:45:30
              </div>
            </div>
            <Link to="/shop" className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
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
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Meilleures ventes</h2>
            </div>
            <Link to="/shop" className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Nouveautés</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-sm font-medium text-green-200">Collection spéciale</span>
                <h3 className="text-2xl font-bold mt-1 mb-3">Artisanat Malien 🇲🇱</h3>
                <p className="text-green-200 text-sm mb-4">Bazin, wax, bijoux et plus encore</p>
                <Link to="/shop?category=malien" className="inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Découvrir <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/10 rounded-tl-full" />
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
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
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white relative overflow-hidden">
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

      {/* Newsletter */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Restez informé de nos offres</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">Inscrivez-vous pour recevoir les meilleures promotions</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Votre email" className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-green-500" />
            <button type="submit" className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all">
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
