import { BarChart3, TrendingUp, Eye, Users } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Statistiques</h1><p className="text-gray-500 text-sm">Analyses et statistiques</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border"><Eye className="w-6 h-6 text-blue-500 mb-2"/><p className="text-sm text-gray-500">Visites</p><p className="text-2xl font-bold">12,456</p></div>
        <div className="bg-white rounded-xl p-4 border"><Users className="w-6 h-6 text-green-500 mb-2"/><p className="text-sm text-gray-500">Visiteurs</p><p className="text-2xl font-bold">3,234</p></div>
        <div className="bg-white rounded-xl p-4 border"><TrendingUp className="w-6 h-6 text-purple-500 mb-2"/><p className="text-sm text-gray-500">Conversions</p><p className="text-2xl font-bold">4.8%</p></div>
        <div className="bg-white rounded-xl p-4 border"><BarChart3 className="w-6 h-6 text-orange-500 mb-2"/><p className="text-sm text-gray-500">Panier moyen</p><p className="text-2xl font-bold">45,000 F</p></div>
      </div>
      <div className="bg-white rounded-2xl p-6 border"><p className="text-gray-500 text-center py-8">Module en cours de développement</p></div>
    </div>
  )
}
