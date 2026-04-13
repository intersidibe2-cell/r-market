import { useState } from 'react'
import { Search, Plus, Edit, Trash2, Package, Eye, X, Save } from 'lucide-react'

interface RussianProduct {
  id: number
  name: string
  nameRu: string
  price: number
  originalPrice: number
  image: string
  category: string
  description: string
  descriptionRu: string
  rating: number
  reviews: number
  stock: number
  sold: number
}

const initialProducts: RussianProduct[] = [
  { id: 1, name: 'Vodka Stolichnaya', nameRu: 'Водка Столичная', price: 15000, originalPrice: 18000, image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=500&h=500&fit=crop', category: 'alcohol', description: 'Vodka russe premium 0.5L', descriptionRu: 'Русская водка премиум 0.5л', rating: 4.8, reviews: 156, stock: 50, sold: 234 },
  { id: 2, name: 'Chocolat Alyonka', nameRu: 'Шоколад Алёнка', price: 5000, originalPrice: 6500, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=500&fit=crop', category: 'food', description: 'Chocolat au lait russe 90g', descriptionRu: 'Русский молочный шоколад 90г', rating: 4.6, reviews: 89, stock: 100, sold: 456 },
  { id: 3, name: 'Matryoshka 5 figures', nameRu: 'Матрёшка 5 фигур', price: 12000, originalPrice: 15000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', category: 'souvenirs', description: 'Poupée russe traditionnelle', descriptionRu: 'Традиционная русская кукла', rating: 4.9, reviews: 234, stock: 30, sold: 189 },
  { id: 4, name: 'Red Caviar', nameRu: 'Икра красная', price: 35000, originalPrice: 42000, image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=500&h=500&fit=crop', category: 'food', description: 'Caviar rouge 120g', descriptionRu: 'Красная икра 120г', rating: 4.7, reviews: 67, stock: 20, sold: 78 },
  { id: 5, name: 'Russian Tea Set', nameRu: 'Чайный набор', price: 25000, originalPrice: 30000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop', category: 'souvenirs', description: 'Set de thé traditionnel', descriptionRu: 'Традиционный чайный набор', rating: 4.5, reviews: 45, stock: 15, sold: 56 },
  { id: 6, name: 'Samovar Electric', nameRu: 'Самовар электрический', price: 85000, originalPrice: 95000, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', category: 'souvenirs', description: 'Samovar électrique moderne', descriptionRu: 'Современный электрический самовар', rating: 4.8, reviews: 23, stock: 8, sold: 34 },
]

const categories = [
  { id: 'all', name: 'Tous', emoji: '📦' },
  { id: 'souvenirs', name: 'Сувениры', emoji: '🎁' },
  { id: 'alcohol', name: 'Алкоголь', emoji: '🍷' },
  { id: 'food', name: 'Еда & Специи', emoji: '🍫' },
]

export default function RussianProducts() {
  const [products, setProducts] = useState<RussianProduct[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<RussianProduct | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '', nameRu: '', price: '', originalPrice: '', stock: '', image: '', description: '', descriptionRu: '', category: 'souvenirs'
  })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.nameRu.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const addProduct = () => {
    const product: RussianProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: newProduct.name,
      nameRu: newProduct.nameRu,
      price: parseFloat(newProduct.price),
      originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price) * 1.2,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: newProduct.category,
      description: newProduct.description,
      descriptionRu: newProduct.descriptionRu,
      rating: 4.5,
      reviews: 0,
      stock: parseInt(newProduct.stock) || 100,
      sold: 0,
    }
    setProducts([...products, product])
    setNewProduct({ name: '', nameRu: '', price: '', originalPrice: '', stock: '', image: '', description: '', descriptionRu: '', category: 'souvenirs' })
    setShowAddModal(false)
  }

  const deleteProduct = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const stats = {
    total: products.length,
    totalStock: products.reduce((s, p) => s + p.stock, 0),
    totalSold: products.reduce((s, p) => s + p.sold, 0),
    lowStock: products.filter(p => p.stock < 20).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🇷🇺</span>
            Produits Boutique Russe
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestion du catalogue russe</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-red-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Produits</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">En stock</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Vendus</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalSold}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Stock faible</p>
          <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
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
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                categoryFilter === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold">
                {categories.find(c => c.id === product.category)?.emoji} {categories.find(c => c.id === product.category)?.name}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 truncate">{product.nameRu}</p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="font-bold text-green-600">{product.price.toLocaleString()} F</p>
                  <p className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} F</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Stock: {product.stock}</p>
                  <p className="text-xs text-gray-500">Vendus: {product.sold}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                >
                  <Edit className="w-4 h-4" /> Modifier
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Nouveau produit russe</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom (FR) *</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Vodka Stolichnaya" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom (RU) *</label>
                  <input type="text" value={newProduct.nameRu} onChange={e => setNewProduct({...newProduct, nameRu: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Водка Столичная" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (CFA) *</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="15000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="https://..." />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={addProduct} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-red-700">
                Ajouter 🇷🇺
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
