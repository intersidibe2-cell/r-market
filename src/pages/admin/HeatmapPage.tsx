import { useState } from 'react'
import { MousePointer, Eye, Clock, Download, Calendar } from 'lucide-react'

// Mock data pour la carte thermique
const heatmapData = {
  homepage: {
    sections: [
      { name: 'Header/Navigation', clicks: 4500, percentage: 100 },
      { name: 'Hero Banner', clicks: 3200, percentage: 71 },
      { name: 'Catégories', clicks: 2800, percentage: 62 },
      { name: 'Produits vedettes', clicks: 2100, percentage: 47 },
      { name: 'Promotions', clicks: 1800, percentage: 40 },
      { name: 'Nouveautés', clicks: 1500, percentage: 33 },
      { name: 'Footer', clicks: 800, percentage: 18 },
    ],
    hotZones: [
      { x: 10, y: 5, width: 80, height: 8, intensity: 'high', label: 'Navigation' },
      { x: 20, y: 15, width: 60, height: 25, intensity: 'high', label: 'Hero Banner' },
      { x: 10, y: 45, width: 80, height: 15, intensity: 'medium', label: 'Catégories' },
      { x: 10, y: 65, width: 80, height: 25, intensity: 'medium', label: 'Produits' },
    ]
  },
  productPage: {
    sections: [
      { name: 'Image produit', clicks: 5200, percentage: 100 },
      { name: 'Prix', clicks: 4800, percentage: 92 },
      { name: 'Bouton Ajouter panier', clicks: 3500, percentage: 67 },
      { name: 'Description', clicks: 2800, percentage: 54 },
      { name: 'Avis clients', clicks: 2200, percentage: 42 },
      { name: 'Produits similaires', clicks: 1500, percentage: 29 },
    ]
  },
  clickHeatmap: [
    { x: 50, y: 20, clicks: 2500, label: 'Logo' },
    { x: 75, y: 20, clicks: 1800, label: 'Panier' },
    { x: 25, y: 35, clicks: 1200, label: 'Catégorie Mode' },
    { x: 50, y: 35, clicks: 980, label: 'Catégorie Électronique' },
    { x: 75, y: 35, clicks: 850, label: 'Catégorie Alcool' },
    { x: 30, y: 60, clicks: 650, label: 'Produit A' },
    { x: 50, y: 60, clicks: 720, label: 'Produit B' },
    { x: 70, y: 60, clicks: 580, label: 'Produit C' },
  ]
}

export default function HeatmapPage() {
  const [selectedPage, setSelectedPage] = useState('homepage')
  const [period, setPeriod] = useState('week')

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-red-500/40'
      case 'medium': return 'bg-yellow-500/40'
      case 'low': return 'bg-green-500/40'
      default: return 'bg-gray-500/40'
    }
  }

  const getClickColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500'
    if (percentage >= 60) return 'bg-orange-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔥 Carte Thermique</h2>
          <p className="text-gray-500">Visualisez les zones les plus cliquées</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          >
            <option value="homepage">Page d'accueil</option>
            <option value="productPage">Page produit</option>
          </select>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clics totaux</p>
              <p className="text-2xl font-bold text-gray-900">16,700</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Zones chaudes</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Temps moyen</p>
              <p className="text-2xl font-bold text-gray-900">2:45</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Période</p>
              <p className="text-2xl font-bold text-gray-900">7 jours</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Visualization */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            {selectedPage === 'homepage' ? 'Page d\'accueil' : 'Page produit'}
          </h3>
          
          {/* Mock Heatmap */}
          <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ paddingBottom: '60%' }}>
            {/* Background mockup */}
            <div className="absolute inset-0 p-4">
              {/* Header */}
              <div className="h-12 bg-white rounded-lg mb-4 flex items-center px-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                <div className="ml-4 flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="ml-4 w-20 h-8 bg-gray-200 rounded-lg"></div>
              </div>
              
              {/* Content */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 h-32 bg-white rounded-lg"></div>
                <div className="h-24 bg-white rounded-lg"></div>
                <div className="h-24 bg-white rounded-lg"></div>
                <div className="h-24 bg-white rounded-lg"></div>
              </div>
            </div>

            {/* Heatmap overlay */}
            {selectedPage === 'homepage' && heatmapData.homepage.hotZones.map((zone, index) => (
              <div
                key={index}
                className={`absolute ${getIntensityColor(zone.intensity)} rounded-lg transition-all`}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800">
                  {zone.label}
                </span>
              </div>
            ))}

            {/* Click points */}
            {selectedPage === 'homepage' && heatmapData.clickHeatmap.map((point, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500/50 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-8 h-8 bg-red-500/70 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{(point.clicks / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/40 rounded"></div>
              <span className="text-sm text-gray-600">Zone chaude</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/40 rounded"></div>
              <span className="text-sm text-gray-600">Zone moyenne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/40 rounded"></div>
              <span className="text-sm text-gray-600">Zone froide</span>
            </div>
          </div>
        </div>

        {/* Section Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Clics par section</h3>
          <div className="space-y-4">
            {(selectedPage === 'homepage' 
              ? heatmapData.homepage.sections 
              : heatmapData.productPage.sections
            ).map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{section.name}</span>
                  <span className="text-sm text-gray-500">{section.clicks.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${getClickColor(section.percentage)}`}
                    style={{ width: `${section.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-4">💡 Recommandations basées sur la carte thermique</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-medium mb-2">Zone à améliorer</p>
            <p className="text-sm text-green-100">
              Le footer génère peu de clics. Ajoutez des liens vers les catégories populaires.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-medium mb-2">Opportunité</p>
            <p className="text-sm text-green-100">
              Le Hero Banner est très cliqué. Testez différentes promotions ici.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-medium mb-2">Optimisation mobile</p>
            <p className="text-sm text-green-100">
              68% des clics viennent du mobile. Vérifiez l'ergonomie responsive.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
