import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Star, Truck, Shield, RefreshCw, ArrowLeft, Minus, Plus, Heart, Share2, Check, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [quantity, setQuantity] = useState(1)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const product = products.find(p => p.id === Number(id))
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <Link to="/shop" className="text-green-600 font-medium hover:text-green-700">
          Retour à la boutique
        </Link>
      </div>
    )
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)
  const liked = isFavorite(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  const handleFavoriteClick = () => {
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-green-600">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-green-600">Boutique</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gray-50 p-6">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-80 lg:h-[500px] object-cover rounded-xl" 
                />
                
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase">
                    {product.badge}
                  </span>
                )}
                
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  -{discount}%
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <button 
                  onClick={handleFavoriteClick}
                  className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all ${
                    liked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
                </button>
                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Thumbnail images (simulated) */}
              <div className="flex gap-2 mt-4">
                {[0, 1, 2, 3].map(i => (
                  <div 
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === i ? 'border-green-500' : 'border-transparent'
                    }`}
                  >
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 lg:p-10">
              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-green-600 font-semibold uppercase tracking-wide bg-green-50 px-2 py-1 rounded-md">
                  {product.category}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  Réf: PRD-{product.id.toString().padStart(4, '0')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating & Sold */}
              <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-200'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({product.reviews} avis)</span>
                <span className="text-sm text-green-600 font-medium">{product.sold} vendus</span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-100">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-green-700">{product.price.toLocaleString()} FCFA</span>
                  <span className="text-lg text-gray-400 line-through">{product.originalPrice.toLocaleString()} FCFA</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-md">-{discount}%</span>
                </div>
                <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Économisez {(product.originalPrice - product.price).toLocaleString()} FCFA
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${product.stock > 20 ? 'bg-green-500' : product.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.stock > 20 ? 'text-green-600' : product.stock > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.stock > 20 ? 'En stock' : product.stock > 5 ? `Plus que ${product.stock} en stock` : `Dernières ${product.stock} pièces`}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantité:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-semibold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    addedFeedback
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-200'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addedFeedback ? '✓ Ajouté au panier !' : `Ajouter au panier — ${(product.price * quantity).toLocaleString()} FCFA`}
                </button>

                <button
                  onClick={handleFavoriteClick}
                  className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all border-2 ${
                    liked
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
                  {liked ? 'Retiré des favoris' : 'Ajouter aux favoris'}
                </button>

                <Link
                  to="/checkout"
                  className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
                >
                  Acheter maintenant
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-gray-100">
                {[
                  { icon: Truck, text: "Livraison rapide", sub: "2-5 jours", color: "text-blue-500" },
                  { icon: Shield, text: "Garantie", sub: "1 an", color: "text-green-500" },
                  { icon: RefreshCw, text: "Retour", sub: "14 jours", color: "text-orange-500" },
                ].map((f, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                    <f.icon className={`w-6 h-6 ${f.color} mx-auto mb-2`} />
                    <p className="text-xs font-medium text-gray-700">{f.text}</p>
                    <p className="text-[10px] text-gray-500">{f.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Produits similaires</h2>
              <Link to={`/shop?category=${product.category}`} className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
