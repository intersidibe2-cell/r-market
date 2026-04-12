import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart, Percent, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { Product } from '../data/products'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)
  const liked = isFavorite(product.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      rating: product.rating,
      sold: product.sold
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 relative">
      <div className="relative overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {product.badge && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        
        <span className="absolute top-2 right-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-0.5">
          <Percent className="w-3 h-3" />-{discount}%
        </span>

        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all ${
            liked 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
        </button>

        <Link 
          to={`/product/${product.id}`}
          className="absolute bottom-2 left-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-green-50 hover:text-green-600"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </Link>

        {product.sold > 500 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
            <div className="text-white text-[10px] font-medium">{product.sold}+ vendus</div>
          </div>
        )}
      </div>

      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 text-sm mb-1.5 hover:text-green-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()} FCFA</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} FCFA</span>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg text-xs font-semibold hover:from-green-700 hover:to-green-800 transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>
    </div>
  )
}
