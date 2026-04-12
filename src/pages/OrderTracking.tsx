import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, ArrowLeft } from 'lucide-react'

// Mock data pour les commandes
const mockOrders: Record<string, {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  customer: string
  phone: string
  address: string
  items: { name: string; quantity: number; image: string }[]
  total: number
  createdAt: string
  estimatedDelivery: string
  timeline: { status: string; date: string; description: string; completed: boolean }[]
}> = {
  'CMD-001': {
    id: 'CMD-001',
    status: 'shipped',
    customer: 'Moussa Dembélé',
    phone: '+223 70 12 34 56',
    address: 'Bamako, Quartier ACI',
    items: [
      { name: 'Boubou Homme Bazin', quantity: 1, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop' },
      { name: 'Sac en Cuir', quantity: 1, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' }
    ],
    total: 65000,
    createdAt: '2026-04-02T10:30:00',
    estimatedDelivery: '2026-04-15',
    timeline: [
      { status: 'Commande confirmée', date: '02/04 10:30', description: 'Votre commande a été reçue', completed: true },
      { status: 'Paiement validé', date: '02/04 10:35', description: 'Paiement Orange Money confirmé', completed: true },
      { status: 'Préparation', date: '03/04 09:00', description: 'Commande en préparation', completed: true },
      { status: 'Expédiée', date: '04/04 14:00', description: 'Commande envoyée via transporteur', completed: true },
      { status: 'En transit', date: '05/04 08:00', description: 'Colis en route vers Bamako', completed: false },
      { status: 'Livraison', date: 'Prévu: 15/04', description: 'Livraison à votre adresse', completed: false }
    ]
  },
  'CMD-002': {
    id: 'CMD-002',
    status: 'delivered',
    customer: 'Fatima Zohra',
    phone: '+223 66 78 90 12',
    address: 'Kayes, Rue 12',
    items: [
      { name: 'iPhone 15 Pro Max', quantity: 1, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop' }
    ],
    total: 580000,
    createdAt: '2026-03-28T16:00:00',
    estimatedDelivery: '2026-04-05',
    timeline: [
      { status: 'Commande confirmée', date: '28/03 16:00', description: 'Votre commande a été reçue', completed: true },
      { status: 'Paiement validé', date: '28/03 16:05', description: 'Paiement Wave confirmé', completed: true },
      { status: 'Préparation', date: '29/03 10:00', description: 'Commande en préparation', completed: true },
      { status: 'Expédiée', date: '30/03 09:00', description: 'Commande envoyée', completed: true },
      { status: 'En transit', date: '31/03 14:00', description: 'Colis en route', completed: true },
      { status: 'Livrée', date: '05/04 11:30', description: 'Commande livrée avec succès', completed: true }
    ]
  }
}

export default function OrderTracking() {
  const { orderId } = useParams()
  const [searchId, setSearchId] = useState(orderId || '')
  const [order, setOrder] = useState<typeof mockOrders[string] | null>(null)
  const [error, setError] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const found = mockOrders[searchId.toUpperCase()]
    if (found) {
      setOrder(found)
    } else {
      setOrder(null)
      setError('Commande non trouvée. Vérifiez le numéro de commande.')
    }
  }

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-5 h-5" />,
    processing: <Package className="w-5 h-5" />,
    shipped: <Truck className="w-5 h-5" />,
    delivered: <CheckCircle className="w-5 h-5" />
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Suivi de commande</h1>
          <p className="text-gray-600 mt-2">Entrez votre numéro de commande pour suivre sa livraison</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Ex: CMD-001"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Suivre
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Commandes de test: CMD-001, CMD-002
          </p>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{order.id}</h2>
                  <p className="text-sm text-gray-500">Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-medium ${statusColors[order.status]}`}>
                  {order.status === 'pending' && 'En attente'}
                  {order.status === 'processing' && 'En préparation'}
                  {order.status === 'shipped' && 'En transit'}
                  {order.status === 'delivered' && 'Livrée'}
                </span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">{order.customer[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Adresse de livraison</p>
                    <p className="text-sm text-gray-500">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-6">Suivi de livraison</h3>
              <div className="relative">
                {/* Ligne verticale */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                <div className="space-y-6">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.status}
                          </p>
                          <span className="text-sm text-gray-500">{step.date}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Articles commandés</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-2xl font-bold text-green-600">{order.total.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Besoin d'aide ?</h4>
                  <p className="text-gray-600 mt-1">
                    Contactez notre service client pour toute question sur votre commande.
                  </p>
                  <a 
                    href="https://wa.me/22370000000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-green-600 font-medium hover:text-green-700"
                  >
                    Contacter sur WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
