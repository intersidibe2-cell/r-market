import { Link } from 'react-router-dom'
import { ArrowLeft, Globe } from 'lucide-react'
import SEO from '../components/SEO'

const countries = [
  { 
    id: "chine", 
    name: "Chine", 
    emoji: "🇨🇳", 
    color: "from-red-500 to-yellow-500", 
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop",
    description: "Électronique, mode, accessoires",
    comingSoon: true 
  },
  { 
    id: "turquie", 
    name: "Turquie", 
    emoji: "🇹🇷", 
    color: "from-red-600 to-red-400", 
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&h=400&fit=crop",
    description: "Décoration, textile, artisanat",
    comingSoon: true 
  },
  { 
    id: "dubai", 
    name: "Dubai", 
    emoji: "🇦🇪", 
    color: "from-green-600 to-green-400", 
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    description: "Parfums, luxe, cosmétiques",
    comingSoon: true 
  },
  { 
    id: "russie", 
    name: "Russie", 
    emoji: "🇷🇺", 
    color: "from-blue-600 to-red-600", 
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600&h=400&fit=crop",
    description: "Produits russes au Mali",
    comingSoon: true 
  },
]

export default function International() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO 
        title="Internationale - R-Market" 
        description="Produits du monde entier : Chine, Turquie, Dubai, Russie"
        url="https://r-market.shop/international"
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">🌍 Internationale</h1>
              <p className="text-white/80 mt-2">Découvrez les produits du monde entier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nos partenaires internationaux</h2>
          <p className="text-gray-600">Cliquez sur un pays pour voir les produits disponibles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {countries.map(country => (
            <div 
              key={country.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
            >
              {/* Image */}
              <div className={`relative h-48 overflow-hidden`}>
                <img 
                  src={country.image} 
                  alt={country.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${country.color} opacity-60`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl drop-shadow-lg">{country.emoji}</span>
                </div>
                {country.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      Bientôt disponible
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{country.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{country.description}</p>
                
                {country.comingSoon ? (
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-xl">
                    <span className="text-lg">⏳</span>
                    <span className="text-sm font-medium">Produits bientôt disponibles</span>
                  </div>
                ) : (
                  <Link 
                    to={`/international/${country.id}`}
                    className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Voir les produits
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Bientôt disponible</h3>
            <p className="text-gray-600 mb-6">
              Nous travaillons dur pour vous proposer des produits de qualité venus du monde entier. 
              Inscrivez-vous à notre newsletter pour être informé dès le lancement !
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1 px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
              />
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
