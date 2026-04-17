import { useState, useEffect } from 'react'
import { Wallet, DollarSign, TrendingUp, TrendingDown, RefreshCw, Loader, ShoppingCart, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Finances() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ revenue: 0, orders: 0, avgOrder: 0, delivered: 0, deliveredRevenue: 0 })
  const [monthlyData, setMonthlyData] = useState<{ month: string; revenue: number; orders: number }[]>([])
  const [topProducts, setTopProducts] = useState<{ name: string; revenue: number; qty: number }[]>([])

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: orders } = await supabase.from('commandes').select('*').neq('status', 'cancelled')

    if (orders) {
      const delivered = orders.filter(o => o.status === 'delivered')
      setStats({
        revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
        orders: orders.length,
        avgOrder: orders.length ? Math.round(orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length) : 0,
        delivered: delivered.length,
        deliveredRevenue: delivered.reduce((s, o) => s + (o.total || 0), 0),
      })

      // Group by month
      const byMonth: Record<string, { revenue: number; orders: number }> = {}
      orders.forEach(o => {
        const month = new Date(o.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
        if (!byMonth[month]) byMonth[month] = { revenue: 0, orders: 0 }
        byMonth[month].revenue += o.total || 0
        byMonth[month].orders += 1
      })
      setMonthlyData(Object.entries(byMonth).slice(-6).map(([month, d]) => ({ month, ...d })))

      // Top products from items JSON
      const productMap: Record<string, { revenue: number; qty: number }> = {}
      orders.forEach(o => {
        try {
          const items = JSON.parse(o.items || '[]')
          items.forEach((item: any) => {
            if (!productMap[item.name]) productMap[item.name] = { revenue: 0, qty: 0 }
            productMap[item.name].revenue += (item.price || 0) * (item.quantity || 1)
            productMap[item.name].qty += item.quantity || 1
          })
        } catch {}
      })
      setTopProducts(
        Object.entries(productMap)
          .sort(([, a], [, b]) => b.revenue - a.revenue)
          .slice(0, 5)
          .map(([name, d]) => ({ name, ...d }))
      )
    }
    setLoading(false)
  }

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-green-600" /> Finances
          </h1>
          <p className="text-gray-500 text-sm">Données en temps réel depuis Supabase</p>
        </div>
        <button onClick={loadData} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader className="w-8 h-8 animate-spin text-green-500" /></div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
              <DollarSign className="w-7 h-7 opacity-80 mb-2" />
              <p className="text-2xl font-bold">{(stats.revenue / 1000).toFixed(0)}K F</p>
              <p className="text-sm opacity-80">CA Total</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white">
              <ShoppingCart className="w-7 h-7 opacity-80 mb-2" />
              <p className="text-2xl font-bold">{stats.orders}</p>
              <p className="text-sm opacity-80">Commandes</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-5 text-white">
              <TrendingUp className="w-7 h-7 opacity-80 mb-2" />
              <p className="text-2xl font-bold">{stats.avgOrder.toLocaleString()} F</p>
              <p className="text-sm opacity-80">Panier moyen</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
              <CheckCircle className="w-7 h-7 opacity-80 mb-2" />
              <p className="text-2xl font-bold">{stats.delivered}</p>
              <p className="text-sm opacity-80">Livrées</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart par mois */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5">Revenus par mois</h2>
              {monthlyData.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Pas encore de données</p>
              ) : (
                <div className="space-y-3">
                  {monthlyData.map(d => (
                    <div key={d.month} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-14 text-right flex-shrink-0">{d.month}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{ width: `${Math.max((d.revenue / maxRevenue) * 100, 5)}%` }}
                        >
                          <span className="text-white text-xs font-medium whitespace-nowrap">{(d.revenue/1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 w-8">{d.orders}cmd</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5">Top produits</h2>
              {topProducts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Pas encore de données</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'
                        }`}>{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.qty} vendus</p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600 text-sm">{p.revenue.toLocaleString()} F</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Résumé financier */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Résumé financier</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">CA confirmé (livré)</p>
                <p className="text-2xl font-bold text-green-700">{stats.deliveredRevenue.toLocaleString()} F</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CA en attente</p>
                <p className="text-2xl font-bold text-orange-600">{(stats.revenue - stats.deliveredRevenue).toLocaleString()} F</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taux de livraison</p>
                <p className="text-2xl font-bold text-blue-700">{stats.orders > 0 ? Math.round((stats.delivered / stats.orders) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
