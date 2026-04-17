import { useState, useEffect } from 'react'
import { Users2, Star, Phone, Plus, X, MessageCircle, MapPin, Edit2, Trash2, RefreshCw, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  whatsapp?: string
  city: string
  address: string
  category: string
  rating: number
  notes?: string
  status: string
  created_at?: string
}

const emptyForm = { name: '', contact: '', phone: '', whatsapp: '', city: '', address: '', category: 'mode', notes: '' }

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { loadSuppliers() }, [])

  const loadSuppliers = async () => {
    setLoading(true)
    const { data } = await supabase.from('fournisseurs').select('*').order('name')
    setSuppliers(data || [])
    setLoading(false)
  }

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (s: Supplier) => { setEditing(s); setForm({ name: s.name, contact: s.contact, phone: s.phone, whatsapp: s.whatsapp || '', city: s.city, address: s.address, category: s.category, notes: s.notes || '' }); setShowModal(true) }

  const save = async () => {
    if (!form.name || !form.phone) return
    setSaving(true)
    if (editing) {
      await supabase.from('fournisseurs').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('fournisseurs').insert({ ...form, rating: 5, status: 'active' })
    }
    await loadSuppliers()
    setShowModal(false)
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce fournisseur ?')) return
    await supabase.from('fournisseurs').delete().eq('id', id)
    setSuppliers(suppliers.filter(s => s.id !== id))
  }

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase()) ||
    s.contact?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'active').length,
    cities: [...new Set(suppliers.map(s => s.city).filter(Boolean))].length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-orange-600" /> Fournisseurs
          </h1>
          <p className="text-gray-500 text-sm">{stats.total} fournisseurs • {stats.active} actifs • {stats.cities} villes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSuppliers} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:from-orange-600 hover:to-orange-700">
            <Plus className="w-4 h-4" /> Nouveau fournisseur
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Total</p><p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
          <p className="text-xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-gray-500">Actifs</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <MapPin className="w-5 h-5 text-blue-500 mb-1" />
          <p className="text-xl font-bold text-blue-600">{stats.cities}</p>
          <p className="text-xs text-gray-500">Villes</p>
        </div>
      </div>

      {/* Search */}
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher par nom, ville, contact..."
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
      />

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun fournisseur trouvé</p>
          <button onClick={openAdd} className="mt-3 text-orange-600 font-medium">+ Ajouter un fournisseur</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  <p className="text-sm text-gray-500">{s.contact}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="space-y-1.5 mb-4">
                {s.phone && <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" />{s.phone}</p>}
                {s.city && <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" />{s.city} {s.address && `— ${s.address}`}</p>}
                {s.category && <span className="inline-block text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{s.category}</span>}
              </div>
              {s.rating && (
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(s.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
                  <span className="text-xs text-gray-500 ml-1">{s.rating}/5</span>
                </div>
              )}
              <div className="flex gap-2">
                {s.whatsapp && (
                  <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                )}
                <button onClick={() => openEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => remove(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-bold text-lg">{editing ? 'Modifier fournisseur' : 'Nouveau fournisseur'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Nom *', key: 'name', placeholder: 'Ex: Marché Médina' },
                { label: 'Contact', key: 'contact', placeholder: 'Nom de la personne' },
                { label: 'Téléphone *', key: 'phone', placeholder: '+223 XX XX XX XX' },
                { label: 'WhatsApp', key: 'whatsapp', placeholder: '22370123456 (sans +)' },
                { label: 'Adresse', key: 'address', placeholder: 'Rue, quartier...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville</label>
                  <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm bg-white">
                    <option value="">Sélectionner</option>
                    {['Bamako', 'Ségou', 'Mopti', 'Sikasso', 'Kayes', 'Koulikoro', 'Bandiagara'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm bg-white">
                    {['mode', 'electronique', 'alimentation', 'sante', 'maison', 'artisanat', 'divers'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm resize-none"
                  placeholder="Informations utiles..." />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">Annuler</button>
              <button onClick={save} disabled={saving || !form.name || !form.phone}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : null}
                {editing ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
