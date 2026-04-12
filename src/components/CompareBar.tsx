import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { X, GitCompare, Trash2 } from 'lucide-react'

export default function CompareBar() {
  const { items, removeFromCompare, clearCompare, itemCount } = useCompare()

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg animate-slide-in">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Produits à comparer */}
          <div className="flex items-center gap-4 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 text-green-600 font-medium shrink-0">
              <GitCompare className="w-5 h-5" />
              <span>{itemCount}/4</span>
            </div>
            
            {items.map(item => (
              <div 
                key={item.id}
                className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 shrink-0"
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {item.name}
                </span>
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Vider</span>
            </button>
            <Link
              to="/compare"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              Comparer ({itemCount})
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
