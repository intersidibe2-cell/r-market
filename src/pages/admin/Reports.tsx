import { FileText, TrendingUp, Download } from 'lucide-react'

export default function Reports() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Rapports</h1><p className="text-gray-500 text-sm">Rapports et analyses</p></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border"><FileText className="w-8 h-8 text-blue-500 mb-2"/><p className="font-semibold">Rapport ventes</p><p className="text-sm text-gray-500">Générer un rapport</p></div>
        <div className="bg-white rounded-xl p-6 border"><TrendingUp className="w-8 h-8 text-green-500 mb-2"/><p className="font-semibold">Rapport stock</p><p className="text-sm text-gray-500">État des stocks</p></div>
      </div>
      <div className="bg-white rounded-2xl p-6 border"><p className="text-gray-500 text-center py-8">Module en cours de développement</p></div>
    </div>
  )
}
