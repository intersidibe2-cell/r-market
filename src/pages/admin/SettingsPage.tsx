import { Settings, Globe, DollarSign, Bell } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Paramètres</h1><p className="text-gray-500 text-sm">Configuration du site</p></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><Globe className="w-5 h-5"/> Général</h3>
          <div className="space-y-4">
            <div><label className="block text-sm text-gray-500 mb-1">Nom du site</label><input type="text" defaultValue="R-Market" className="w-full px-4 py-2 border rounded-lg"/></div>
            <div><label className="block text-sm text-gray-500 mb-1">Email contact</label><input type="email" defaultValue="contact@r-market.shop" className="w-full px-4 py-2 border rounded-lg"/></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5"/> Paiement</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded"/> Orange Money</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded"/> Moov Money</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded"/> Wave</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded"/> Cash</label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-semibold flex items-center gap-2 mb-4"><Bell className="w-5 h-5"/> Notifications</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded"/> Email pour nouvelles commandes</label>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded"/> SMS pour livraisons</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded"/> Rapport hebdomadaire</label>
        </div>
      </div>

      <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium">Sauvegarder</button>
    </div>
  )
}
