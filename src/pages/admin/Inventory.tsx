import { useState, useEffect } from 'react'
import { Warehouse, Package, AlertTriangle, RefreshCw, Loader, TrendingDown, Search, Edit2, Save, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Product { id: number; name: string; category: string; stock: number; price: number; image?: string }

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStock, setEditStock] = useState(0)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('produits').select('id,name,category,stock,price,image').order('stock', { ascending: true })
    setProducts(data || [])
    setLoading(false)
  }

  const saveStock = async (id: number) => {
    setSaving(true)
    await supabase.from('produits').update({ stock: editStock }).eq('id', id)
    setProducts(products.map(p => p.id === id ? { ...p, stock: editStock } : p))
    setEditingId(null)
    setSaving(false)
  }

  const filtered = products
    .filter(p => {
      if (filter === 'low') return p.stock > 0 && p.stock <= 10
      if (filter === 'out') return p.stock === 0
      if (filter === 'ok') return p.stock > 10
      return true
    })
    .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: products.length,
    totalUnits: products.reduce((s, p) => s + (p.stock || 0), 0),
    low: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    out: products.filter(p => p.stock === 0).length,
    value: products.reduce((s, p) => s + ((p.stock || 0) * (p.price || 0)), 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-blue-600" /> Inventaire
          </h1>
          <p className="text-gray-500 text-sm">Stock en temps réel depuis Supabase</p>
        </div>
        <button onClick={loadProducts} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <Package className="w-6 h-6 opacity-80 mb-1" /><p className="text-2xl font-bold">{stats.totalUnits.toLocaleString()}</p><p className="text-sm opacity-80">Unités en stock</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <Warehouse className="w-6 h-6 opacity-80 mb-1" /><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm opacity-80">Produits</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <AlertTriangle className="w-5 h-5 text-orange-500 mb-1" /><p className="text-xl font-bold text-orange-600">{stats.low}</p><p className="text-xs text-gray-500">Stock faible (≤10)</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <TrendingDown className="w-5 h-5 text-red-500 mb-1" /><p className="text-xl font-bold text-red-600">{stats.out}</p><p className="text-xs text-gray-500">Rupture de stock</p>
        </div>
      </div>

      {/* Valeur totale */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-4">
        <p className="text-sm text-gray-600">Valeur totale du stock estimée</p>
        <p className="text-2xl font-bold text-green-700">{stats.value.toLocaleString()} FCFA</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white" />
        </div>
        <div className="flex gap-2">
          {[{id:'all',l:'Tous'},{id:'ok',l:'OK'},{id:'low',l:'Faible'},{id:'out',l:'Rupture'}].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${filter===f.id?'bg-blue-600 text-white':'bg-white border border-gray-200 text-gray-600'}`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>{['Produit','Catégorie','Stock','Prix','Valeur','Action'].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">Aucun produit trouvé</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className={`hover:bg-gray-50 ${p.stock === 0 ? 'bg-red-50/30' : p.stock <= 10 ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                        <span className="font-medium text-gray-900 text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{p.category}</span></td>
                    <td className="px-5 py-4">
                      {editingId === p.id ? (
                        <input type="number" value={editStock} onChange={e=>setEditStock(parseInt(e.target.value)||0)} min={0}
                          className="w-20 px-2 py-1 border border-blue-500 rounded-lg text-sm focus:outline-none" autoFocus />
                      ) : (
                        <span className={`font-bold text-lg ${p.stock===0?'text-red-600':p.stock<=10?'text-orange-600':'text-green-600'}`}>{p.stock}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{(p.price||0).toLocaleString()} F</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">{((p.stock||0)*(p.price||0)).toLocaleString()} F</td>
                    <td className="px-5 py-4">
                      {editingId === p.id ? (
                        <div className="flex gap-1">
                          <button onClick={()=>saveStock(p.id)} disabled={saving} className="p-1.5 bg-green-600 text-white rounded-lg"><Save className="w-3.5 h-3.5" /></button>
                          <button onClick={()=>setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button onClick={()=>{setEditingId(p.id);setEditStock(p.stock)}} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
