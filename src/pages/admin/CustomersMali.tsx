import { useState, useEffect } from 'react'
import { Users, ShoppingBag, Phone, MessageCircle, RefreshCw, Search, Eye, TrendingUp, DollarSign, Loader, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Customer {
  id: string
  name: string
  phone: string
  address?: string
  total_orders: number
  total_spent: number
  created_at: string
}

interface Order {
  id: string
  order_number: string
  total: number
  status: string
  created_at: string
  items: string
}

export default function CustomersMali() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  useEffect(() => { loadCustomers() }, [])

  const loadCustomers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('total_spent', { ascending: false })
    setCustomers(data || [])
    setLoading(false)
  }

  const loadOrders = async (phone: string) => {
    setLoadingOrders(true)
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .eq('client_phone', phone)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoadingOrders(false)
  }

  const openCustomer = async (c: Customer) => {
    setSelected(c)
    await loadOrders(c.phone)
  }

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  const stats = {
    total: customers.length,
    revenue: customers.reduce((s, c) => s + (c.total_spent || 0), 0),
    orders: customers.reduce((s, c) => s + (c.total_orders || 0), 0),
    avgSpent: customers.length > 0 ? Math.round(customers.reduce((s, c) => s + (c.total_spent || 0), 0) / customers.length) : 0,
  }

  const getStatusColor = (status: string) => {
    const c: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }
    return c[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" /> Clients Mali
          </h1>
          <p className="text-gray-500 text-sm">{stats.total} clients enregistrés</p>
        </div>
        <button onClick={loadCustomers} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <Users className="w-6 h-6 opacity-80 mb-2" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm opacity-80">Total clients</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <DollarSign className="w-6 h-6 opacity-80 mb-2" />
          <p className="text-xl font-bold">{(stats.revenue / 1000).toFixed(0)}K F</p>
          <p className="text-sm opacity-80">CA total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <ShoppingBag className="w-5 h-5 text-blue-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{stats.orders}</p>
          <p className="text-xs text-gray-500">Commandes totales</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <TrendingUp className="w-5 h-5 text-orange-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{stats.avgSpent.toLocaleString()} F</p>
          <p className="text-xs text-gray-500">Dépense moyenne</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou téléphone..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 bg-white" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader className="w-8 h-8 animate-spin text-purple-500" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Client', 'Commandes', 'Total dépensé', 'Panier moy.', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-500">Aucun client</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-700">{c.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-blue-600">{c.total_orders || 0}</td>
                    <td className="px-5 py-4 font-bold text-green-600">{(c.total_spent || 0).toLocaleString()} F</td>
                    <td className="px-5 py-4 text-gray-600">
                      {c.total_orders ? Math.round((c.total_spent || 0) / c.total_orders).toLocaleString() : 0} F
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openCustomer(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <a href={`tel:${c.phone}`} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"><Phone className="w-4 h-4" /></a>
                        <a href={`https://wa.me/${c.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><MessageCircle className="w-4 h-4" /></a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="font-bold text-lg">{selected.name}</h2>
                <p className="text-sm text-gray-500">{selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-700">{(selected.total_spent || 0).toLocaleString()} F</p>
                  <p className="text-xs text-gray-500">Total dépensé</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-700">{selected.total_orders || 0}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4" /> Appeler
                </a>
                <a href={`https://wa.me/${selected.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-100 rounded-xl text-sm font-medium text-green-700">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-700 mb-2">Historique des commandes</p>
                {loadingOrders ? (
                  <div className="text-center py-4"><Loader className="w-5 h-5 animate-spin mx-auto text-gray-400" /></div>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Aucune commande</p>
                ) : (
                  <div className="space-y-2">
                    {orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-sm">{o.order_number}</p>
                          <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 text-sm">{o.total?.toLocaleString()} F</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(o.status)}`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
