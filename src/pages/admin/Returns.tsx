import { useState, useEffect } from 'react'
import { RefreshCw, Loader, Package, Phone, MessageCircle, CheckCircle, XCircle, Clock, AlertTriangle, X, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { notifyStatusChange } from '../../lib/config'

interface Return {
  id: string
  order_number: string
  client_name: string
  client_phone: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  amount: number
  notes: string
  created_at: string
}

const reasons = ['Produit défectueux', 'Mauvaise taille', 'Pas conforme à la description', 'Produit endommagé', 'Commande incorrecte', 'Autre']

export default function Returns() {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ order_number: '', client_name: '', client_phone: '', reason: '', amount: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadReturns() }, [])

  const loadReturns = async () => {
    setLoading(true)
    const { data } = await supabase.from('retours').select('*').order('created_at', { ascending: false })
    setReturns(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: Return['status'], ret: Return) => {
    await supabase.from('retours').update({ status }).eq('id', id)
    setReturns(returns.map(r => r.id === id ? { ...r, status } : r))
    if (ret.client_phone && status === 'approved') {
      notifyStatusChange(ret.client_phone, ret.client_name, ret.order_number, 'cancelled')
    }
  }

  const save = async () => {
    if (!form.order_number || !form.client_name) return
    setSaving(true)
    await supabase.from('retours').insert({
      ...form,
      amount: parseFloat(form.amount) || 0,
      status: 'pending'
    })
    await loadReturns()
    setShowModal(false)
    setForm({ order_number: '', client_name: '', client_phone: '', reason: '', amount: '', notes: '' })
    setSaving(false)
  }

  const filtered = filter === 'all' ? returns : returns.filter(r => r.status === filter)
  const stats = {
    pending: returns.filter(r => r.status === 'pending').length,
    approved: returns.filter(r => r.status === 'approved').length,
    rejected: returns.filter(r => r.status === 'rejected').length,
    total: returns.length,
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    approved: { label: 'Approuvé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700', icon: XCircle },
    completed: { label: 'Complété', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-orange-600" /> Retours produits
          </h1>
          <p className="text-gray-500 text-sm">{stats.total} retours enregistrés</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadReturns} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowModal(true)} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-orange-600">
            <Plus className="w-4 h-4" /> Nouveau retour
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"><p className="text-sm text-yellow-700">En attente</p><p className="text-2xl font-bold text-yellow-700">{stats.pending}</p></div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-sm text-green-700">Approuvés</p><p className="text-2xl font-bold text-green-700">{stats.approved}</p></div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4"><p className="text-sm text-red-700">Refusés</p><p className="text-2xl font-bold text-red-700">{stats.rejected}</p></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[{ id: 'all', label: 'Tous' }, { id: 'pending', label: 'En attente' }, { id: 'approved', label: 'Approuvés' }, { id: 'rejected', label: 'Refusés' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader className="w-8 h-8 animate-spin text-orange-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun retour {filter !== 'all' ? filter : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ret => {
            const cfg = statusConfig[ret.status]
            const Icon = cfg.icon
            return (
              <div key={ret.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900">{ret.order_number}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{ret.client_name}</p>
                    <p className="text-sm text-gray-500">{ret.reason}</p>
                    {ret.notes && <p className="text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded-lg inline-block">{ret.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    {ret.amount > 0 && <span className="font-bold text-red-600">{ret.amount.toLocaleString()} F</span>}
                    <div className="flex gap-2">
                      <a href={`tel:${ret.client_phone}`} className="p-2 bg-gray-100 rounded-lg"><Phone className="w-4 h-4 text-gray-600" /></a>
                      <a href={`https://wa.me/${ret.client_phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-100 rounded-lg"><MessageCircle className="w-4 h-4 text-green-700" /></a>
                      {ret.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(ret.id, 'approved', ret)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">Approuver</button>
                          <button onClick={() => updateStatus(ret.id, 'rejected', ret)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">Refuser</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">Nouveau retour</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[{l:'N° Commande *',k:'order_number',p:'CMD-XXXXXX'},{l:'Nom client *',k:'client_name',p:'Nom complet'},{l:'Téléphone',k:'client_phone',p:'+223...'},{l:'Montant à rembourser (F)',k:'amount',p:'0'}].map(f=>(
                <div key={f.k}><label className="block text-sm font-medium text-gray-700 mb-1">{f.l}</label>
                  <input type="text" value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.p} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500" /></div>
              ))}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <select value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-orange-500">
                  <option value="">Sélectionner</option>
                  {reasons.map(r=><option key={r} value={r}>{r}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-orange-500" /></div>
            </div>
            <div className="p-5 border-t flex gap-3">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700">Annuler</button>
              <button onClick={save} disabled={saving||!form.order_number||!form.client_name} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {saving&&<Loader className="w-4 h-4 animate-spin"/>} Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
