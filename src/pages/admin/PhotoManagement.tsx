import { useState } from 'react'
import { Camera, Check, X, Upload, Eye, Search, Filter, Image, AlertCircle, Package } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'

interface ProductPhoto {
  id: number
  name: string
  price: number
  category: string
  stock: number
  photos: string[]
  photoStatus: 'missing' | 'partial' | 'complete'
  createdAt: string
}

const initialProducts: ProductPhoto[] = [
  { id: 1, name: 'Robe bazin riche brodée', price: 25000, category: 'Mode', stock: 15, photos: [], photoStatus: 'missing', createdAt: '14/04/2026' },
  { id: 2, name: 'Collier perles Bambara', price: 15000, category: 'Mode', stock: 30, photos: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'], photoStatus: 'partial', createdAt: '13/04/2026' },
  { id: 3, name: 'Masque Dogon sculpté', price: 25000, category: 'Souvenirs', stock: 10, photos: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500', 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=500', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500'], photoStatus: 'complete', createdAt: '12/04/2026' },
  { id: 4, name: 'Tissu Bogolan', price: 12000, category: 'Mode', stock: 25, photos: [], photoStatus: 'missing', createdAt: '14/04/2026' },
  { id: 5, name: 'Statuette bronze', price: 45000, category: 'Souvenirs', stock: 8, photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'], photoStatus: 'partial', createdAt: '11/04/2026' },
  { id: 6, name: 'Boubou homme brodé', price: 35000, category: 'Mode', stock: 20, photos: [], photoStatus: 'missing', createdAt: '14/04/2026' },
  { id: 7, name: 'Chapeau traditionnel', price: 8000, category: 'Mode', stock: 40, photos: [], photoStatus: 'missing', createdAt: '14/04/2026' },
  { id: 8, name: 'Tambour Tam-tam', price: 28000, category: 'Souvenirs', stock: 5, photos: ['https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500', 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=500'], photoStatus: 'partial', createdAt: '10/04/2026' },
]

export default function PhotoManagement() {
  const [products, setProducts] = useState<ProductPhoto[]>(initialProducts)
  const [filter, setFilter] = useState<'all' | 'missing' | 'partial' | 'complete'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductPhoto | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || p.photoStatus === filter
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: products.length,
    missing: products.filter(p => p.photoStatus === 'missing').length,
    partial: products.filter(p => p.photoStatus === 'partial').length,
    complete: products.filter(p => p.photoStatus === 'complete').length,
    totalPhotos: products.reduce((sum, p) => sum + p.photos.length, 0),
  }

  const handlePhotoUpload = (productId: number, url: string) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newPhotos = [...p.photos, url].slice(0, 5)
        const status = newPhotos.length === 0 ? 'missing' : newPhotos.length < 5 ? 'partial' : 'complete'
        return { ...p, photos: newPhotos, photoStatus: status }
      }
      return p
    }))
  }

  const removePhoto = (productId: number, photoIndex: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newPhotos = p.photos.filter((_, i) => i !== photoIndex)
        const status = newPhotos.length === 0 ? 'missing' : newPhotos.length < 5 ? 'partial' : 'complete'
        return { ...p, photos: newPhotos, photoStatus: status }
      }
      return p
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'missing':
        return { label: 'Sans photo', color: 'bg-red-100 text-red-700', icon: AlertCircle }
      case 'partial':
        return { label: 'En cours', color: 'bg-yellow-100 text-yellow-700', icon: Camera }
      case 'complete':
        return { label: 'Complet', color: 'bg-green-100 text-green-700', icon: Check }
      default:
        return { label: '', color: '', icon: Package }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Gestion des Photos
          </h1>
          <p className="text-gray-500 text-sm">Gérez les photos de vos produits (5 par produit)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total produits</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-600">Sans photo</p>
          <p className="text-2xl font-bold text-red-600">{stats.missing}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-sm text-yellow-600">En cours</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.partial}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600">Complets</p>
          <p className="text-2xl font-bold text-green-600">{stats.complete}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-600">Total photos</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPhotos}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression photos</span>
          <span className="text-sm text-gray-500">{Math.round((stats.complete / stats.total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-green-500" style={{ width: `${(stats.complete / stats.total) * 100}%` }}></div>
            <div className="bg-yellow-500" style={{ width: `${(stats.partial / stats.total) * 100}%` }}></div>
            <div className="bg-red-500" style={{ width: `${(stats.missing / stats.total) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Complet</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> En cours</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Sans photo</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'missing', label: '🔴 Sans photo' },
            { id: 'partial', label: '🟡 En cours' },
            { id: 'complete', label: '🟢 Complet' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const statusInfo = getStatusBadge(product.photoStatus)
          return (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Photos Preview */}
              <div className="relative h-40 bg-gray-100">
                {product.photos.length > 0 ? (
                  <div className="grid grid-cols-5 h-full">
                    {product.photos.map((photo, i) => (
                      <div key={i} className="relative group">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePhoto(product.id, i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {Array(5 - product.photos.length).fill(null).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-gray-200 flex items-center justify-center">
                        <Image className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Aucune photo</p>
                    </div>
                  </div>
                )}
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${statusInfo.color}`}>
                  {product.photos.length}/5
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="font-bold text-green-600">{product.price.toLocaleString()} F</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Stock: {product.stock}</p>

                {/* Upload Button */}
                <button
                  onClick={() => { setSelectedProduct(product); setShowUploadModal(true) }}
                  className={`w-full mt-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    product.photoStatus === 'complete'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {product.photoStatus === 'complete' ? 'Modifier les photos' : 'Uploader des photos'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                <p className="text-sm text-gray-500">{selectedProduct.photos.length}/5 photos</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Photos */}
              <div>
                <h3 className="font-semibold mb-3">Photos actuelles ({selectedProduct.photos.length}/5)</h3>
                <div className="grid grid-cols-5 gap-2">
                  {selectedProduct.photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(selectedProduct.id, i)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {Array(5 - selectedProduct.photos.length).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Image className="w-6 h-6 text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload New Photo */}
              {selectedProduct.photos.length < 5 && (
                <div>
                  <h3 className="font-semibold mb-3">Ajouter une photo ({selectedProduct.photos.length + 1}/5)</h3>
                  <ImageUpload
                    onUpload={(url) => handlePhotoUpload(selectedProduct.id, url)}
                    type="both"
                    maxSizeMB={10}
                  />
                </div>
              )}

              {/* Photo Tips */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Conseils photo</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Photo 1 : Vue face (fond blanc)</li>
                  <li>• Photo 2 : Vue dos ou côté</li>
                  <li>• Photo 3 : Détail / texture</li>
                  <li>• Photo 4 : En situation / lifestyle</li>
                  <li>• Photo 5 : Vidéo 360° (optionnel)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
