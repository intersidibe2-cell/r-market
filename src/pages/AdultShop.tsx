import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react'
import { products } from '../data/products'
import AgeGate from '../components/AgeGate'
import ProductCard from '../components/ProductCard'

export default function AdultShop() {
  const [showGate, setShowGate] = useState(true)

  // Vérifier si l'utilisateur a déjà vérifié son âge dans cette session
  useEffect(() => {
    const sessionAccess = sessionStorage.getItem('rmarket_age_verified')
    if (sessionAccess === 'true') {
      setShowGate(false)
    }
  }, [])

  const handleVerified = () => {
    sessionStorage.setItem('rmarket_age_verified', 'true')
    setShowGate(false)
  }

  const handleCancel = () => {
    window.history.back()
  }

  // Filtrer les produits adultes
  const adultProducts = products.filter(p => p.category === 'adulte' || p.isAdult)

  // Afficher le popup si pas encore vérifié
  if (showGate) {
    return <AgeGate onVerified={handleVerified} onCancel={handleCancel} />
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🔞</span>
            <div>
              <h1 className="text-3xl font-bold">Articles Adultes</h1>
              <p className="text-white/80 text-sm mt-1">{adultProducts.length} produits disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {adultProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {adultProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
            <p className="text-purple-700 font-medium">Section en cours de développement</p>
            <p className="text-gray-600 mt-2">Les produits seront bientôt disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}
