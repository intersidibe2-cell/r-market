import { Users, ShoppingBag, Phone } from 'lucide-react'

const customers = [
  { id: 1, name: 'Moussa Dembélé', phone: '+223 70 12 34 56', orders: 12, spent: 456000 },
  { id: 2, name: 'Aminata Koné', phone: '+223 66 78 90 12', orders: 8, spent: 234000 },
  { id: 3, name: 'Ibrahim Touré', phone: '+223 77 34 56 78', orders: 15, spent: 678000 },
]

export default function CustomersMali() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Clients Mali</h1><p className="text-gray-500 text-sm">{customers.length} clients</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">Total clients</p><p className="text-2xl font-bold">{customers.length}</p></div>
        <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">Commandes totales</p><p className="text-2xl font-bold text-blue-600">{customers.reduce((s, c) => s + c.orders, 0)}</p></div>
        <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">Chiffre d'affaires</p><p className="text-2xl font-bold text-green-600">{customers.reduce((s, c) => s + c.spent, 0).toLocaleString()} F</p></div>
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead><tr className="text-left text-xs text-gray-500 uppercase bg-gray-50"><th className="px-6 py-4">Client</th><th className="px-6 py-4">Commandes</th><th className="px-6 py-4">Total dépensé</th></tr></thead>
          <tbody className="divide-y">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><p className="font-medium">{c.name}</p><p className="text-xs text-gray-500">{c.phone}</p></td>
                <td className="px-6 py-4">{c.orders}</td>
                <td className="px-6 py-4 font-bold text-green-600">{c.spent.toLocaleString()} F</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
