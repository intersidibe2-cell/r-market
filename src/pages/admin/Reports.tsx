import { useState, useEffect } from 'react'
import { FileText, TrendingUp, Download, RefreshCw, Loader, Calendar, Package, ShoppingCart, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Reports() {
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState('month')
  const [report, setReport] = useState<any>(null)

  useEffect(() => { generateReport() }, [period])

  const getPeriodFilter = () => {
    const now = new Date()
    if (period === 'week') { const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString() }
    if (period === 'month') { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d.toISOString() }
    if (period === '3months') { const d = new Date(now); d.setMonth(d.getMonth() - 3); return d.toISOString() }
    return new Date(now.getFullYear(), 0, 1).toISOString()
  }

  const generateReport = async () => {
    setLoading(true)
    const since = getPeriodFilter()

    const [ordersRes, clientsRes] = await Promise.all([
      supabase.from('commandes').select('*').gte('created_at', since),
      supabase.from('clients').select('*').gte('created_at', since)
    ])

    const orders = ordersRes.data || []
    const clients = clientsRes.data || []
    const delivered = orders.filter(o => o.status === 'delivered')
    const cancelled = orders.filter(o => o.status === 'cancelled')

    // Category breakdown
    const byCat: Record<string, number> = {}
    orders.forEach(o => {
      try {
        JSON.parse(o.items || '[]').forEach((item: any) => {
          byCat[item.category || 'Autre'] = (byCat[item.category || 'Autre'] || 0) + (item.price * item.quantity)
        })
      } catch {}
    })

    setReport({
      total_orders: orders.length,
      total_revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
      delivered: delivered.length,
      cancelled: cancelled.length,
      new_clients: clients.length,
      avg_order: orders.length ? Math.round(orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length) : 0,
      delivery_rate: orders.length ? Math.round((delivered.length / orders.length) * 100) : 0,
      by_category: Object.entries(byCat).sort(([, a], [, b]) => b - a).slice(0, 5),
      orders_list: orders.slice(0, 20),
    })
    setLoading(false)
  }

  const exportCSV = () => {
    if (!report) return
    const rows = [
      ['N° Commande', 'Client', 'Téléphone', 'Total (FCFA)', 'Statut', 'Date'],
      ...report.orders_list.map((o: any) => [
        o.order_number, o.client_name, o.client_phone, o.total, o.status,
        new Date(o.created_at).toLocaleDateString('fr-FR')
      ])
    ]
    const csv = rows.map(r => r.join(';')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `rapport_rmarket_${period}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> Rapports
          </h1>
          <p className="text-gray-500 text-sm">Données en temps réel depuis Supabase</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-500">
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="3months">3 derniers mois</option>
            <option value="year">Cette année</option>
          </select>
          <button onClick={generateReport} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={exportCSV} disabled={!report} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {loading || !report ? (
        <div className="flex items-center justify-center py-16"><Loader className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Commandes', value: report.total_orders, icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
              { label: 'CA (FCFA)', value: `${(report.total_revenue/1000).toFixed(0)}K`, icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
              { label: 'Taux livraison', value: `${report.delivery_rate}%`, icon: Package, color: 'from-purple-500 to-pink-600' },
              { label: 'Nvx clients', value: report.new_clients, icon: Users, color: 'from-orange-500 to-red-500' },
            ].map((k, i) => (
              <div key={i} className={`bg-gradient-to-br ${k.color} rounded-xl p-4 text-white`}>
                <k.icon className="w-6 h-6 opacity-80 mb-2" />
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-sm opacity-80">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Statuts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Répartition des statuts</h2>
              <div className="space-y-3">
                {[
                  { label: 'Livrées', value: report.delivered, color: 'bg-green-500' },
                  { label: 'En cours', value: report.total_orders - report.delivered - report.cancelled, color: 'bg-blue-500' },
                  { label: 'Annulées', value: report.cancelled, color: 'bg-red-500' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">{s.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: report.total_orders > 0 ? `${Math.max((s.value/report.total_orders)*100,2)}%` : '0%' }} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-8">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top catégories */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Top catégories (CA)</h2>
              {report.by_category.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Pas de données</p>
              ) : (
                <div className="space-y-2">
                  {report.by_category.map(([cat, rev]: [string, number], i: number) => (
                    <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm font-medium text-gray-700">{cat}</span>
                      <span className="font-bold text-green-600 text-sm">{rev.toLocaleString()} F</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dernières commandes */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Dernières commandes ({report.orders_list.length})</h2>
              <button onClick={exportCSV} className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Exporter CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr>{['N° Commande','Client','Total','Statut','Date'].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {report.orders_list.map((o: any) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-sm font-bold text-gray-800">{o.order_number}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{o.client_name}</td>
                      <td className="px-5 py-3 font-bold text-green-600 text-sm">{o.total?.toLocaleString()} F</td>
                      <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full ${o.status==='delivered'?'bg-green-100 text-green-700':o.status==='cancelled'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{o.status}</span></td>
                      <td className="px-5 py-3 text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
