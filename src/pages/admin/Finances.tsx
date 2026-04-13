import { Wallet, DollarSign, TrendingUp } from 'lucide-react'

export default function Finances() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Finances</h1><p className="text-gray-500 text-sm">Gestion financière</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white"><p className="text-sm opacity-80">Revenus du mois</p><p className="text-2xl font-bold">45,670,000 F</p></div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white"><p className="text-sm opacity-80">Dépenses</p><p className="text-2xl font-bold">12,340,000 F</p></div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white"><p className="text-sm opacity-80">Bénéfice</p><p className="text-2xl font-bold">33,330,000 F</p></div>
      </div>
      <div className="bg-white rounded-2xl p-6 border"><p className="text-gray-500 text-center py-8">Module en cours de développement</p></div>
    </div>
  )
}
