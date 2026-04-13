import { Package, Search, Plus, Edit, Trash2 } from 'lucide-react'
import { products, categories } from '../../data/products'

export default function ProductsMali() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits Mali</h1>
          <p className="text-gray-500 text-sm">{products.length} produits</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium">
          <Plus className="w-5 h-5" />
          Nouveau produit
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total produits</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">En stock</p>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 0).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Catégories</p>
          <p className="text-2xl font-bold text-blue-600">{categories.length - 1}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Stock faible</p>
          <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.stock < 20).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice(0, 12).map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-xs text-gray-500">{categories.find(c => c.id === product.category)?.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-bold text-green-600">{product.price.toLocaleString()} F</p>
                <p className="text-xs text-gray-500">Stock: {product.stock}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm"><Edit className="w-4 h-4 inline" /> Modifier</button>
                <button className="py-2 px-3 bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
