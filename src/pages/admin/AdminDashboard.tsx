import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Truck } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Revenus du jour', value: '2,450,000 F', change: '+12%', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'Commandes', value: '156', change: '+8%', icon: ShoppingCart, color: 'from-blue-500 to-cyan-500' },
    { label: 'Produits', value: '60', change: '+3', icon: Package, color: 'from-purple-500 to-pink-500' },
    { label: 'Clients', value: '1,234', change: '+45', icon: Users, color: 'from-orange-500 to-red-500' },
    { label: 'Livraisons en cours', value: '23', change: '', icon: Truck, color: 'from-yellow-500 to-orange-500' },
    { label: 'Ventes du mois', value: '45,670,000 F', change: '+18%', icon: TrendingUp, color: 'from-teal-500 to-green-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            {stat.change && (
              <p className="text-sm text-green-600 mt-1">{stat.change} vs hier</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-lg">Commandes récentes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: 'CMD-001', customer: 'Moussa Dembélé', total: '35,000 F', status: 'pending' },
              { id: 'CMD-002', customer: 'Aminata Koné', total: '125,000 F', status: 'delivered' },
              { id: 'CMD-003', customer: 'Ibrahim Touré', total: '85,500 F', status: 'shipped' },
            ].map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'delivered' ? 'Livré' : order.status === 'shipped' ? 'Expédié' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
