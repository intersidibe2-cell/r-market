import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowLeft, ChevronRight } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()

  if (favorites.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-red-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Aucun favori</h1>
          <p className="text-gray-500 mb-6">Ajoutez des produits à vos favoris pour les retrouver ici</p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all"
          >
            Parcourir la boutique
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/shop" className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                Mes Favoris
              </h1>
              <p className="text-sm text-gray-500">{favorites.length} produit{favorites.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
              <div className="relative">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button 
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()} FCFA</span>
                  <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} FCFA</span>
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Voir
                  </Link>
                  <button
                    onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
