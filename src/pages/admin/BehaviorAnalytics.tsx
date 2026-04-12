import { useState } from 'react'
import { Eye, MousePointer, Clock, Users, ShoppingBag, ArrowRight, TrendingUp } from 'lucide-react'

// Mock data pour l'analyse comportementale
const behaviorData = {
  pageViews: [
    { page: 'Accueil', views: 12450, unique: 8900, avgTime: '2:30' },
    { page: 'Boutique', views: 8900, unique: 6200, avgTime: '4:15' },
    { page: 'Produit - Boubou', views: 3200, unique: 2800, avgTime: '3:45' },
    { page: 'Produit - iPhone', views: 2800, unique: 2400, avgTime: '5:20' },
    { page: 'Panier', views: 1500, unique: 1200, avgTime: '2:10' },
    { page: 'Checkout', views: 800, unique: 750, avgTime: '3:30' },
  ],
  conversionFunnel: [
    { stage: 'Visiteurs', count: 12450, percentage: 100 },
    { stage: 'Vus produits', count: 8900, percentage: 71 },
    { stage: 'Ajout panier', count: 2100, percentage: 17 },
    { stage: 'Checkout', count: 800, percentage: 6.4 },
    { stage: 'Achat', count: 650, percentage: 5.2 },
  ],
  topCategories: [
    { name: 'Mode', views: 4500, conversion: 8.2 },
    { name: 'Électronique', views: 3200, conversion: 6.5 },
    { name: 'Alcool', views: 2800, conversion: 12.3 },
    { name: 'Artisanat', views: 1950, conversion: 4.1 },
  ],
  abandonedProducts: [
    { name: 'iPhone 15 Pro Max', views: 450, added: 120, purchased: 12, rate: 90 },
    { name: 'Samsung Galaxy S24', views: 380, added: 95, purchased: 8, rate: 92 },
    { name: 'Boubou Homme Bazin', views: 290, added: 85, purchased: 25, rate: 71 },
  ],
  deviceStats: [
    { device: 'Mobile', percentage: 68 },
    { device: 'Desktop', percentage: 24 },
    { device: 'Tablette', percentage: 8 },
  ]
}

export default function BehaviorAnalytics() {
  const [period, setPeriod] = useState('week')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔍 Analyse Comportementale</h2>
          <p className="text-gray-500">Comprendre le comportement de vos visiteurs</p>
        </div>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vues totales</p>
              <p className="text-2xl font-bold text-gray-900">28,850</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Visiteurs uniques</p>
              <p className="text-2xl font-bold text-gray-900">18,250</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Temps moyen</p>
              <p className="text-2xl font-bold text-gray-900">3:45</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Taux rebond</p>
              <p className="text-2xl font-bold text-gray-900">32%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-6">Entonnoir de conversion</h3>
        <div className="space-y-4">
          {behaviorData.conversionFunnel.map((stage, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700">{stage.stage}</div>
              <div className="flex-1">
                <div className="h-10 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.percentage > 15 && (
                      <span className="text-white text-sm font-medium">{stage.count.toLocaleString()}</span>
                    )}
                  </div>
                  {stage.percentage <= 15 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">
                      {stage.count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-semibold text-gray-900">{stage.percentage}%</span>
              </div>
              {index < behaviorData.conversionFunnel.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Pages les plus vues</h3>
          <div className="space-y-3">
            {behaviorData.pageViews.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-700 font-bold rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{page.page}</p>
                    <p className="text-xs text-gray-500">{page.unique.toLocaleString()} visiteurs uniques</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{page.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{page.avgTime} moy.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Catégories populaires</h3>
          <div className="space-y-4">
            {behaviorData.topCategories.map((cat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{cat.views.toLocaleString()} vues</span>
                    <span className="text-sm font-medium text-green-600">{cat.conversion}% conv.</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${(cat.views / 4500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Abandoned Products */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Produits abandonnés fréquemment</h3>
        <p className="text-sm text-gray-500 mb-4">
          Ces produits sont ajoutés au panier mais rarement achetés. Envisagez des offres spéciales.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Vues</th>
                <th className="px-4 py-3">Ajoutés</th>
                <th className="px-4 py-3">Achetés</th>
                <th className="px-4 py-3">Taux abandon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {behaviorData.abandonedProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.views}</td>
                  <td className="px-4 py-3 text-gray-600">{product.added}</td>
                  <td className="px-4 py-3 text-gray-600">{product.purchased}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${product.rate > 85 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {product.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Stats */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Appareils utilisés</h3>
        <div className="flex items-center gap-8">
          <div className="flex-1 space-y-3">
            {behaviorData.deviceStats.map((device, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-20 text-sm text-gray-600">{device.device}</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right font-semibold text-gray-900">{device.percentage}%</span>
              </div>
            ))}
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-4xl font-bold text-green-600">68%</p>
            <p className="text-sm text-gray-500 mt-1">Mobile</p>
            <p className="text-xs text-gray-400 mt-2">Optimisez pour mobile !</p>
          </div>
        </div>
      </div>
    </div>
  )
}
