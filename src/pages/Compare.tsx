import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useCart } from '../context/CartContext'
import { useNotification } from '../context/NotificationContext'
import { X, ShoppingCart, Star, ArrowLeft, Trash2 } from 'lucide-react'

export default function Compare() {
  const { items, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()
  const { success } = useNotification()

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    } as any)
    success('Ajouté au panier', product.name)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📊</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit à comparer</h2>
          <p className="text-gray-600 mb-6">
            Ajoutez des produits à la comparaison depuis la boutique.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Aller à la boutique
          </Link>
        </div>
      </div>
    )
  }

  // Caractéristiques à comparer
  const features = [
    { key: 'price', label: 'Prix', format: (v: any) => `${Number(v).toLocaleString()} F` },
    { key: 'originalPrice', label: 'Prix initial', format: (v: any) => `${Number(v).toLocaleString()} F` },
    { key: 'category', label: 'Catégorie', format: (v: any) => String(v) },
    { key: 'rating', label: 'Note', format: (v: any) => `${v} ⭐` },
    { key: 'reviews', label: 'Avis', format: (v: any) => `${v} avis` },
    { key: 'stock', label: 'Stock', format: (v: any) => Number(v) > 0 ? `${v} unités` : 'Rupture' },
    { key: 'sold', label: 'Vendus', format: (v: any) => `${v} vendus` },
  ]

  // Calculer les meilleurs valeurs
  const getBestValue = (key: string) => {
    if (key === 'price' || key === 'originalPrice') {
      return Math.min(...items.map(p => (p as any)[key]))
    }
    if (key === 'rating' || key === 'stock' || key === 'sold') {
      return Math.max(...items.map(p => (p as any)[key]))
    }
    if (key === 'reviews') {
      return Math.max(...items.map(p => (p as any)[key]))
    }
    return null
  }

  const isBestValue = (key: string, value: any) => {
    const best = getBestValue(key)
    return best !== null && value === best
  }

  // Calculer le discount
  const getDiscount = (product: typeof items[0]) => {
    if (product.originalPrice > product.price) {
      return Math.round((1 - product.price / product.originalPrice) * 100)
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comparaison de produits</h1>
            <p className="text-gray-600 mt-1">{items.length} produits sélectionnés</p>
          </div>
          <button
            onClick={clearCompare}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <Trash2 className="w-5 h-5" />
            Tout supprimer
          </button>
        </div>

        {/* Tableau de comparaison */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-4 bg-gray-50 text-left text-sm font-medium text-gray-500 w-40">
                    Caractéristique
                  </th>
                  {items.map(product => (
                    <th key={product.id} className="p-4 bg-gray-50 min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-xl mx-auto mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 text-center">{product.name}</h3>
                        {getDiscount(product) > 0 && (
                          <span className="inline-block mt-2 text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            -{getDiscount(product)}%
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Prix */}
                {features.map(feature => (
                  <tr key={feature.key} className="hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-700">{feature.label}</td>
                    {items.map(product => {
                      const value = (product as any)[feature.key]
                      const isBest = isBestValue(feature.key, value)
                      return (
                        <td 
                          key={product.id} 
                          className={`p-4 text-center ${isBest ? 'bg-green-50' : ''}`}
                        >
                          <span className={`font-semibold ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                            {feature.format(value)}
                          </span>
                          {isBest && (
                            <span className="block text-xs text-green-600 mt-1">Meilleur</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Description */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Description</td>
                  {items.map(product => (
                    <td key={product.id} className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {(product as any).description || 'Pas de description'}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr className="bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-700">Actions</td>
                  {items.map(product => (
                    <td key={product.id} className="p-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Ajouter au panier
                        </button>
                        <Link
                          to={`/product/${product.id}`}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium text-center transition-colors"
                        >
                          Voir le produit
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ajouter plus de produits */}
        {items.length < 4 && (
          <div className="mt-8 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              + Ajouter d'autres produits à comparer
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
