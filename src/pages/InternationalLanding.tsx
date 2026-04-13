import { Link } from 'react-router-dom'
import { Globe, ArrowLeft, Clock, Check, Rocket, Star } from 'lucide-react'
import { internationalShops, getStatusLabel } from '../data/internationalShops'

export default function InternationalLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-green-400">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">R-Market</span>
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" />
            <span className="text-white font-bold">International</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            R-Market <span className="text-green-400">International</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Bientôt disponible dans plusieurs pays. Des produits du monde entier pour nos clients en Afrique.
          </p>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internationalShops.map(shop => {
            const statusInfo = getStatusLabel(shop.status)
            const isActive = shop.status === 'active'
            
            return (
              <div key={shop.id} className={`bg-gray-800 rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] ${
                isActive ? 'border-green-500/50' : 'border-gray-700'
              }`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${shop.gradient} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{shop.flag}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{shop.name}</h3>
                        <p className="text-white/80">{shop.nameLocal}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-gray-400">{shop.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">Devise</p>
                      <p className="text-white font-semibold">{shop.currency} {shop.currencySymbol}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">Taux</p>
                      <p className="text-white font-semibold">1 {shop.currencySymbol} = {(1/shop.exchangeRate).toFixed(0)} F</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs mb-2">Catégories</p>
                    <div className="flex flex-wrap gap-2">
                      {shop.categories.map((cat, i) => (
                        <span key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{cat}</span>
                      ))}
                    </div>
                  </div>

                  {isActive ? (
                    <Link
                      to={`/${shop.code === 'ru' ? 'russian' : shop.code}`}
                      className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
                    >
                      Accéder à la boutique →
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-700/50 text-gray-400 py-3 rounded-xl justify-center">
                      <Clock className="w-4 h-4" />
                      <span>Ouverture : {shop.launchDate || 'Bientôt'}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Newsletter */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Soyez informé du lancement</h2>
          <p className="text-white/80 mb-6">Recevez une notification quand une nouvelle boutique s'ouvre</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/20"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              S'inscrire
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Rocket className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Livraison rapide</h3>
            <p className="text-gray-400 text-sm">Livraison directe vers le Mali</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Star className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Produits authentiques</h3>
            <p className="text-gray-400 text-sm">Qualité garantie</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <span className="text-4xl mb-3 block">💱</span>
            <h3 className="text-white font-bold mb-2">Conversion automatique</h3>
            <p className="text-gray-400 text-sm">Paiement en FCFA</p>
          </div>
        </div>
      </div>
    </div>
  )
}
