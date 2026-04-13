import { useState } from 'react'
import { Globe, Plus, Edit, Trash2, Eye, Settings, Check, X, Clock, Calendar } from 'lucide-react'
import { internationalShops, InternationalShop, getStatusLabel } from '../../data/internationalShops'

export default function InternationalShops() {
  const [shops, setShops] = useState<InternationalShop[]>(internationalShops)
  const [selectedShop, setSelectedShop] = useState<InternationalShop | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingShop, setEditingShop] = useState<InternationalShop | null>(null)

  const stats = {
    total: shops.length,
    active: shops.filter(s => s.status === 'active').length,
    comingSoon: shops.filter(s => s.status === 'coming_soon').length,
    planned: shops.filter(s => s.status === 'planned').length,
  }

  const updateShopStatus = (id: string, status: InternationalShop['status']) => {
    setShops(shops.map(s => s.id === id ? { ...s, status } : s))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Boutiques Internationales
          </h1>
          <p className="text-gray-500 text-sm">Gérez les boutiques par pays</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Bientôt</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.comingSoon}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Planifiés</p>
          <p className="text-2xl font-bold text-blue-600">{stats.planned}</p>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shops.map(shop => {
          const statusInfo = getStatusLabel(shop.status)
          return (
            <div key={shop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${shop.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{shop.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold">{shop.name}</h3>
                      <p className="text-white/80 text-sm">{shop.nameLocal}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">{shop.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Devise</p>
                    <p className="font-semibold">{shop.currency} ({shop.currencySymbol})</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Taux de change</p>
                    <p className="font-semibold">1 {shop.currencySymbol} = {(1/shop.exchangeRate).toFixed(0)} FCFA</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lancement</p>
                    <p className="font-semibold">{shop.launchDate || 'En cours'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Catégories</p>
                    <p className="font-semibold">{shop.categories.length} catégories</p>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Catégories prévues</p>
                  <div className="flex flex-wrap gap-2">
                    {shop.categories.map((cat, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{cat}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => setSelectedShop(shop)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Eye className="w-4 h-4" /> Voir
                  </button>
                  <button
                    onClick={() => { setEditingShop(shop); setShowEditModal(true) }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
                  >
                    <Edit className="w-4 h-4" /> Modifier
                  </button>
                  {shop.status === 'coming_soon' && (
                    <button
                      onClick={() => updateShopStatus(shop.id, 'active')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Check className="w-4 h-4" /> Activer
                    </button>
                  )}
                  {shop.status === 'planned' && (
                    <button
                      onClick={() => updateShopStatus(shop.id, 'coming_soon')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                    >
                      <Clock className="w-4 h-4" /> Bientôt
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Planning de déploiement
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {shops.sort((a, b) => {
              const order = { 'active': 0, 'coming_soon': 1, 'planned': 2 }
              return order[a.status] - order[b.status]
            }).map((shop, i) => (
              <div key={shop.id} className="relative pl-12">
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  shop.status === 'active' ? 'bg-green-500' :
                  shop.status === 'coming_soon' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  <span className="text-white text-sm">{shop.flag}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{shop.name}</h4>
                      <p className="text-sm text-gray-500">{shop.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      shop.status === 'active' ? 'bg-green-100 text-green-700' :
                      shop.status === 'coming_soon' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {shop.launchDate || 'En cours'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedShop(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-r ${selectedShop.gradient} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{selectedShop.flag}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedShop.name}</h2>
                    <p className="text-white/80">{selectedShop.nameLocal}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedShop(null)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Pays</p><p className="font-semibold">{selectedShop.country}</p></div>
                <div><p className="text-sm text-gray-500">Devise</p><p className="font-semibold">{selectedShop.currency} ({selectedShop.currencySymbol})</p></div>
                <div><p className="text-sm text-gray-500">Taux</p><p className="font-semibold">1 {selectedShop.currencySymbol} = {(1/selectedShop.exchangeRate).toFixed(0)} F</p></div>
                <div><p className="text-sm text-gray-500">Lancement</p><p className="font-semibold">{selectedShop.launchDate || 'En cours'}</p></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700">{selectedShop.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Catégories</p>
                <div className="flex flex-wrap gap-2">
                  {selectedShop.categories.map((cat, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{cat}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
