import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, ArrowLeft, Loader, MessageCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'

const statusSteps = [
  { key: 'pending', label: 'Commande reçue', desc: 'Votre commande a été reçue', icon: Package },
  { key: 'confirmed', label: 'Confirmée', desc: 'Commande confirmée par notre équipe', icon: CheckCircle },
  { key: 'picked_up', label: 'Récupérée', desc: 'Produit récupéré chez le fournisseur', icon: Package },
  { key: 'ready_for_delivery', label: 'Prête', desc: 'Commande prête pour la livraison', icon: Truck },
  { key: 'in_delivery', label: 'En livraison', desc: 'En cours de livraison vers vous', icon: Truck },
  { key: 'delivered', label: 'Livrée', desc: 'Commande livrée avec succès !', icon: CheckCircle },
]

const statusOrder = ['pending', 'confirmed', 'picked_up', 'ready_for_delivery', 'in_delivery', 'delivered']

export default function OrderTracking() {
  const { orderId: paramOrderId } = useParams()
  const [searchTerm, setSearchTerm] = useState(paramOrderId || '')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (paramOrderId) searchOrder(paramOrderId)
  }, [paramOrderId])

  const searchOrder = async (term: string) => {
    const cleaned = term.trim().toUpperCase()
    if (!cleaned) return
    setLoading(true)
    setError('')
    setOrder(null)

    const { data, error: err } = await supabase
      .from('commandes')
      .select('*')
      .ilike('order_number', `%${cleaned}%`)
      .single()

    if (err || !data) {
      setError(`Commande "${cleaned}" introuvable. Vérifiez le numéro et réessayez.`)
    } else {
      setOrder(data)
    }
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchOrder(searchTerm)
  }

  const currentStepIndex = order ? statusOrder.indexOf(order.status) : -1
  const parsedItems = order ? (() => { try { return JSON.parse(order.items) } catch { return [] } })() : []

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Suivi de commande</h1>
          <p className="text-gray-500 mt-1">Entrez votre numéro de commande pour suivre votre livraison</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro de commande</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value.toUpperCase())}
              placeholder="Ex: CMD-123456"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-mono text-gray-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Rechercher
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Le numéro de commande vous a été envoyé par WhatsApp lors de la commande</p>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="space-y-5">
            {/* Status Banner */}
            <div className={`rounded-2xl p-5 text-white ${
              order.status === 'delivered' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
              order.status === 'cancelled' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Commande</p>
                  <p className="text-2xl font-bold">{order.order_number}</p>
                </div>
                <button onClick={() => searchOrder(order.order_number)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-5">Suivi en temps réel</h2>
                <div className="space-y-0">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                            isCompleted
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'bg-white border-gray-200 text-gray-300'
                          } ${isCurrent ? 'ring-4 ring-green-500/20' : ''}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`w-0.5 h-10 mt-1 ${isCompleted && index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={`font-semibold text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                            {isCurrent && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">En cours</span>}
                          </p>
                          <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Client & Adresse */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Informations de livraison</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.client_name}</p>
                    <p className="text-gray-500">{order.client_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-600">{order.client_address}</p>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Articles commandés</h2>
              <div className="space-y-3">
                {parsedItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-green-600 text-sm">{(item.price * item.quantity).toLocaleString()} F</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span className="text-green-600 text-lg">{order.total?.toLocaleString()} F</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">
              <p className="font-semibold text-gray-900 mb-1">Besoin d'aide ?</p>
              <p className="text-sm text-gray-600 mb-3">Notre équipe est disponible pour vous aider.</p>
              <a
                href={`https://wa.me/83806129?text=Bonjour, j'ai une question sur ma commande ${order.order_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Contacter le support WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
