import { Users2, Star, Phone } from 'lucide-react'

const suppliers = [
  { id: 1, name: 'TechImport Mali', contact: 'Amadou Diallo', phone: '+223 70 11 22 33', rating: 4.8, orders: 24 },
  { id: 2, name: 'Mode Africaine SARL', contact: 'Fatou Coulibaly', phone: '+223 66 44 55 66', rating: 4.5, orders: 18 },
  { id: 3, name: 'BioSanté Mali', contact: 'Ibrahim Sidibé', phone: '+223 77 77 88 99', rating: 4.9, orders: 32 },
]

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Fournisseurs</h1><p className="text-gray-500 text-sm">{suppliers.length} fournisseurs</p></div>
        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl">+ Nouveau</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white rounded-xl p-4 border">
            <h3 className="font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-500">{s.contact}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/> {s.phone}</p>
            <div className="flex items-center gap-2 mt-2"><Star className="w-4 h-4 text-yellow-500"/><span>{s.rating}</span><span className="text-gray-400">•</span><span>{s.orders} commandes</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}
