import { useState } from 'react'
import { TrendingUp, TrendingDown, Package, AlertTriangle, Calendar, Download } from 'lucide-react'

// Mock data pour les prédictions
const salesData = {
  current: {
    revenue: 365000,
    orders: 7,
    average: 52143
  },
  predictions: [
    { period: 'Avril 2026', revenue: 420000, confidence: 85, trend: 'up' },
    { period: 'Mai 2026', revenue: 485000, confidence: 78, trend: 'up' },
    { period: 'Juin 2026', revenue: 520000, confidence: 72, trend: 'up' },
    { period: 'Juillet 2026', revenue: 380000, confidence: 65, trend: 'down' },
  ],
  topProducts: [
    { name: 'Boubou Homme Bazin', predicted: 45, current: 35, growth: 28 },
    { name: 'iPhone 15 Pro Max', predicted: 18, current: 8, growth: 125 },
    { name: 'Vodka Absolut 700ml', predicted: 85, current: 75, growth: 13 },
    { name: 'Masque Dogon', predicted: 28, current: 22, growth: 27 },
  ],
  restockAlerts: [
    { product: 'Samsung Galaxy S24', current: 0, suggested: 15, urgency: 'high' },
    { product: 'Bijoux Artisanaux', current: 8, suggested: 25, urgency: 'medium' },
    { product: 'iPhone 15 Pro Max', current: 8, suggested: 20, urgency: 'medium' },
  ]
}

export default function PredictiveAnalytics() {
  const [period, setPeriod] = useState('month')

  const formatCurrency = (value: number) => {
    return `${(value / 1000).toFixed(0)}k F`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📊 Analyse Prédictive</h2>
          <p className="text-gray-500">Prévisions de ventes et recommandations</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Current Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenus actuels</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.current.revenue.toLocaleString()} F</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12.5% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commandes</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.current.orders}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+8 vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Panier moyen</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.current.average.toLocaleString()} F</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+5.2% vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-6">Prévisions de ventes</h3>
        <div className="space-y-4">
          {salesData.predictions.map((pred, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900">{pred.period}</p>
                  <div className="flex items-center gap-2">
                    {pred.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-bold text-gray-900">{pred.revenue.toLocaleString()} F</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${pred.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{pred.confidence}% confiance</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restock Alerts */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h3 className="font-bold text-lg text-gray-900">Alertes de réapprovisionnement</h3>
        </div>
        <div className="space-y-4">
          {salesData.restockAlerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl border-l-4 ${
                alert.urgency === 'high' 
                  ? 'bg-red-50 border-red-500' 
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{alert.product}</p>
                  <p className="text-sm text-gray-600">
                    Stock actuel: <span className="font-medium">{alert.current}</span> → 
                    Suggéré: <span className="font-medium">{alert.suggested}</span>
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  alert.urgency === 'high' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {alert.urgency === 'high' ? 'Urgent' : 'À surveiller'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products Prediction */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-6">Prédiction par produit</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Stock actuel</th>
                <th className="px-4 py-3">Prédiction</th>
                <th className="px-4 py-3">Croissance</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salesData.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.current} unités</td>
                  <td className="px-4 py-3 text-gray-600">{product.predicted} unités</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      +{product.growth}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      Réapprovisionner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
