import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, X, Grid2X2, List } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [priceMax, setPriceMax] = useState(200000)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categoryParam = searchParams.get('category') || 'all'

  const handleCategoryClick = (categoryId: string) => {
    // Si c'est la catégorie adulte, rediriger vers /adult (avec popup)
    if (categoryId === 'adulte') {
      navigate('/adult')
    } else {
      setSearchParams({ category: categoryId })
    }
    setShowFilters(false)
  }

  const filteredProducts = products
    .filter(p => categoryParam === 'all' || p.category === categoryParam)
    .filter(p => p.price <= priceMax)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'popular') return b.sold - a.sold
      if (sortBy === 'discount') {
        const dA = 1 - a.price / a.originalPrice
        const dB = 1 - b.price / b.originalPrice
        return dB - dA
      }
      return 0
    })

  const currentCategory = categories.find(c => c.id === categoryParam)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Header */}
      {categoryParam !== 'all' && currentCategory && (
        <div className={`bg-gradient-to-r ${currentCategory.color} text-white py-8`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{currentCategory.emoji}</span>
              <div>
                <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
                <p className="text-white/80 text-sm mt-1">{filteredProducts.length} produits disponibles</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {categoryParam === 'all' && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tous les produits</h1>
            <p className="text-gray-500 text-sm">{filteredProducts.length} produits</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'}`}>
            <div className={`bg-white rounded-xl shadow-lg lg:shadow-sm border border-gray-100 p-5 lg:sticky lg:top-24 h-full lg:h-auto overflow-y-auto ${showFilters ? 'w-80 mx-auto mt-16' : ''}`}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </h2>
                <button className="lg:hidden p-1 text-gray-500" onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-5">
                <h3 className="font-medium text-gray-900 mb-3 text-sm">Catégories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`relative overflow-hidden rounded-xl transition-all ${
                        categoryParam === cat.id
                          ? 'ring-2 ring-green-500'
                          : 'hover:ring-2 hover:ring-gray-200'
                      }`}
                    >
                      <img src={cat.image} alt={cat.name} className="w-full h-20 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-1 left-0 right-0 text-center text-xs text-white font-medium">{cat.emoji} {cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h3 className="font-medium text-gray-900 mb-3 text-sm">
                  Prix max: {priceMax.toLocaleString()} FCFA
                </h3>
                <input
                  type="range"
                  min="500"
                  max="200000"
                  step="500"
                  value={priceMax}
                  onChange={e => setPriceMax(parseInt(e.target.value))}
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>500 FCFA</span>
                  <span>200 000 FCFA</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3 text-sm">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 bg-white"
                >
                  <option value="default">Pertinence</option>
                  <option value="popular">Plus populaires</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="discount">Plus grandes remises</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> produits
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filtres
                </button>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                <button
                  onClick={() => { setSearchParams({}); setPriceMax(200000) }}
                  className="mt-4 text-green-600 font-medium hover:text-green-700"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
