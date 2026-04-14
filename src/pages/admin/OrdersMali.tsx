import { useState } from 'react'
import { ShoppingCart, Search, Eye, Check, X, Truck, Phone, MapPin, Package, QrCode, Printer, AlertCircle, Clock, CheckCircle, MessageCircle } from 'lucide-react'
import { getSupplierWhatsapp, generateSupplierWhatsappMessage, generateWhatsappUrl } from '../../utils/supplierWhatsapp'

interface OrderItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  customer: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  status: string
  date: string
  qrCode?: string
  supplierId?: number
  supplierName?: string
  supplierAddress?: string
  notes?: string
}

const initialOrders: Order[] = [
  { 
    id: 'CMD-001', 
    customer: 'Moussa Dembélé', 
    phone: '+223 70 12 34 56', 
    address: 'Bamako, Quartier ACI, Rue 123',
    items: [
      { id: 1, name: 'Robe bazin riche brodée', sku: 'MAL-MOD-01-0001', price: 35000, quantity: 1, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop' }
    ],
    total: 35000, 
    status: 'pending', 
    date: '14/04/2026',
    supplierId: 1,
    supplierName: 'Marché Médina',
    supplierAddress: 'Marché Médina, Allée 5, Bamako'
  },
  { 
    id: 'CMD-002', 
    customer: 'Aminata Koné', 
    phone: '+223 66 78 90 12', 
    address: 'Bamako, Djélibougou, Avenue 200',
    items: [
      { id: 2, name: 'Parfum Oud', sku: 'MAL-SAN-07-0015', price: 25000, quantity: 1, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&h=100&fit=crop' },
      { id: 3, name: 'Crème hydratante', sku: 'MAL-SAN-07-0016', price: 15000, quantity: 2, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop' }
    ],
    total: 55000, 
    status: 'pickup_required', 
    date: '14/04/2026',
    supplierId: 7,
    supplierName: 'Pharmacie Bamako',
    supplierAddress: 'Bamako, Quartier Hippodrome'
  },
  { 
    id: 'CMD-003', 
    customer: 'Ibrahim Touré', 
    phone: '+223 77 34 56 78', 
    address: 'Bamako, Hamdallaye ACI',
    items: [
      { id: 4, name: 'Tissu Bogolan', sku: 'MAL-MOD-01-0002', price: 45000, quantity: 1, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop' }
    ],
    total: 45000, 
    status: 'picked_up', 
    date: '13/04/2026',
    qrCode: 'CMD-003-PROD-001',
    supplierId: 1,
    supplierName: 'Marché Médina',
    supplierAddress: 'Marché Médina, Allée 5, Bamako'
  },
  { 
    id: 'CMD-004', 
    customer: 'Fatou Sangaré', 
    phone: '+223 65 90 12 34', 
    address: 'Bamako, Badalabougou',
    items: [
      { id: 5, name: 'Sac en Cuir', sku: 'MAL-MOD-04-0008', price: 28000, quantity: 1, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' }
    ],
    total: 28000, 
    status: 'ready_for_delivery', 
    date: '14/04/2026',
    qrCode: 'CMD-004-PROD-001',
    supplierId: 4,
    supplierName: 'Cuir & Maroquinerie',
    supplierAddress: 'Kayes, Rue principale'
  },
  { 
    id: 'CMD-005', 
    customer: 'Amadou Diallo', 
    phone: '+223 78 45 67 89', 
    address: 'Ségou, Centre ville',
    items: [
      { id: 6, name: 'Collier perles Bambara', sku: 'MAL-MOD-05-0012', price: 18000, quantity: 1, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop' }
    ],
    total: 18000, 
    status: 'delivered', 
    date: '12/04/2026',
    qrCode: 'CMD-005-PROD-001',
    supplierId: 5,
    supplierName: 'Marché de Ségou',
    supplierAddress: 'Ségou, Marché central'
  },
  { 
    id: 'CMD-006', 
    customer: 'Khadija Maïga', 
    phone: '+223 79 23 45 67', 
    address: 'Bamako, Point G',
    items: [
      { id: 7, name: 'Masque Dogon sculpté', sku: 'MAL-SOU-03-0020', price: 85000, quantity: 1, image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=100&h=100&fit=crop' }
    ],
    total: 85000, 
    status: 'unavailable', 
    date: '14/04/2026',
    supplierId: 3,
    supplierName: 'Artisan Bandiagara',
    supplierAddress: 'Bandiagara, Zone artisanale',
    notes: 'Produit non disponible - Client appelé le 14/04'
  },
]

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  pickup_required: { label: 'À récupérer', color: 'text-orange-700', bg: 'bg-orange-100', icon: MapPin },
  picked_up: { label: 'Récupéré', color: 'text-blue-700', bg: 'bg-blue-100', icon: Package },
  ready_for_delivery: { label: 'Prêt à livrer', color: 'text-purple-700', bg: 'bg-purple-100', icon: Truck },
  in_delivery: { label: 'En livraison', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Truck },
  delivered: { label: 'Livré', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: 'text-red-700', bg: 'bg-red-100', icon: X },
  unavailable: { label: 'Indisponible', color: 'text-gray-700', bg: 'bg-gray-100', icon: AlertCircle },
}

export default function OrdersMali() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('all')
  const [showCallModal, setShowCallModal] = useState(false)
  const [callNotes, setCallNotes] = useState('')

  // Filter orders
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  // Update order status
  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ))
  }

  // Generate QR code when picking up product
  const pickupProduct = (order: Order) => {
    const qrCode = `${order.id}-PROD-${Date.now().toString(36).toUpperCase()}`
    setOrders(orders.map(o => 
      o.id === order.id ? { ...o, status: 'picked_up', qrCode } : o
    ))
    setSelectedOrder({ ...order, status: 'picked_up', qrCode })
  }

  // Print QR code
  const printQRCode = (order: Order) => {
    if (!order.qrCode) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { border: 2px solid #000; padding: 20px; display: inline-block; }
              .order-id { font-size: 18px; font-weight: bold; margin: 10px 0; }
              .customer { font-size: 14px; color: #666; }
              .items { font-size: 12px; color: #888; margin: 10px 0; }
              img { width: 150px; height: 150px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${order.qrCode}" alt="QR Code" />
              <div class="order-id">${order.id}</div>
              <div class="customer">${order.customer}</div>
              <div class="items">${order.items.map(i => i.name).join(', ')}</div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Call client for unavailable product
  const handleCallClient = (order: Order) => {
    setSelectedOrder(order)
    setShowCallModal(true)
  }

  // Save call notes and mark as unavailable
  const saveCallNotes = () => {
    if (selectedOrder) {
      setOrders(orders.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, status: 'unavailable', notes: callNotes } 
          : o
      ))
      setShowCallModal(false)
      setCallNotes('')
      setSelectedOrder(null)
    }
  }

  // Send WhatsApp to supplier
  const sendToSupplier = (order: Order) => {
    if (!order.supplierId) return
    
    const whatsapp = getSupplierWhatsapp(order.supplierId)
    if (!whatsapp) {
      alert('WhatsApp non renseigné pour ce fournisseur. Ajoutez-le lors de la création du produit.')
      return
    }
    
    const message = generateSupplierWhatsappMessage(
      order.supplierName || 'Fournisseur',
      order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image
      })),
      order.id
    )
    
    const url = generateWhatsappUrl(whatsapp, message)
    window.open(url, '_blank')
  }

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    pickupRequired: orders.filter(o => o.status === 'pickup_required').length,
    readyForDelivery: orders.filter(o => o.status === 'ready_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    unavailable: orders.filter(o => o.status === 'unavailable').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Commandes Mali
          </h1>
          <p className="text-gray-500 text-sm">{orders.length} commandes • Workflow: Fournisseur → Stock temporaire → Client</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">À récupérer</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pickupRequired}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Prêts</p>
          <p className="text-2xl font-bold text-purple-600">{stats.readyForDelivery}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Livrés</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Indisponibles</p>
          <p className="text-2xl font-bold text-gray-600">{stats.unavailable}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Toutes', count: stats.total },
          { id: 'pending', label: 'En attente', count: stats.pending },
          { id: 'pickup_required', label: 'À récupérer', count: stats.pickupRequired },
          { id: 'picked_up', label: 'Récupérées', count: orders.filter(o => o.status === 'picked_up').length },
          { id: 'ready_for_delivery', label: 'Prêtes', count: stats.readyForDelivery },
          { id: 'delivered', label: 'Livrées', count: stats.delivered },
          { id: 'unavailable', label: 'Indisponibles', count: stats.unavailable },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              filter === f.id
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${filter === f.id ? 'bg-white/20' : 'bg-gray-100'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const StatusIcon = statusConfig[order.status]?.icon || Clock
          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{order.id}</h3>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" /> {order.customer}
                      </span>
                      <span>{order.date}</span>
                    </div>
                    {order.supplierName && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {order.supplierName}
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-sm text-orange-600 mt-2 bg-orange-50 p-2 rounded-lg flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Products */}
                  <div className="flex items-center gap-2">
                    {order.items.slice(0, 3).map(item => (
                      <img 
                        key={item.id} 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <span className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500">
                        +{order.items.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{order.total.toLocaleString()} F</p>
                    <p className="text-sm text-gray-500">{order.items.length} article(s)</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Voir détails"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    {/* Pickup action */}
                    {order.status === 'pickup_required' && (
                      <button 
                        onClick={() => pickupProduct(order)}
                        className="flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
                      >
                        <Package className="w-4 h-4" /> Récupérer
                      </button>
                    )}

                    {/* Print QR */}
                    {order.qrCode && (
                      <button 
                        onClick={() => printQRCode(order)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Imprimer QR"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                    )}

                    {/* Ready for delivery */}
                    {order.status === 'picked_up' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'ready_for_delivery')}
                        className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200"
                      >
                        <Truck className="w-4 h-4" /> Prêt
                      </button>
                    )}

                    {/* Call client for unavailable */}
                    {order.status === 'pickup_required' && (
                      <button 
                        onClick={() => handleCallClient(order)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                      >
                        <Phone className="w-4 h-4" /> Indisponible
                      </button>
                    )}

                    {/* Send to supplier via WhatsApp */}
                    {order.status === 'pending' && order.supplierId && (
                      <button 
                        onClick={() => sendToSupplier(order)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                        title="Envoyer au fournisseur via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" /> Fournisseur
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Commande {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Status */}
              <div className={`p-4 rounded-xl ${statusConfig[selectedOrder.status]?.bg}`}>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = statusConfig[selectedOrder.status]?.icon || Clock
                    return <Icon className="w-5 h-5" />
                  })()}
                  <span className={`font-bold ${statusConfig[selectedOrder.status]?.color}`}>
                    {statusConfig[selectedOrder.status]?.label}
                  </span>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-2">Client</h4>
                <p className="font-medium">{selectedOrder.customer}</p>
                <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                <p className="text-sm text-gray-500">{selectedOrder.address}</p>
              </div>

              {/* Supplier */}
              {selectedOrder.supplierName && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">Fournisseur</h4>
                  <p className="font-medium">{selectedOrder.supplierName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.supplierAddress}</p>
                  
                  {/* WhatsApp button */}
                  {selectedOrder.supplierId && (
                    <div className="mt-3">
                      {(() => {
                        const whatsapp = getSupplierWhatsapp(selectedOrder.supplierId!)
                        if (whatsapp) {
                          return (
                            <button
                              onClick={() => sendToSupplier(selectedOrder)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" /> Envoyer au fournisseur
                            </button>
                          )
                        } else {
                          return (
                            <p className="text-sm text-orange-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> WhatsApp non renseigné
                            </p>
                          )
                        }
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-2">Produits</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <p className="text-sm font-medium">{item.price.toLocaleString()} F</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">{selectedOrder.total.toLocaleString()} F</span>
                </div>
              </div>

              {/* QR Code */}
              {selectedOrder.qrCode && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">QR Code</h4>
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${selectedOrder.qrCode}`} 
                      alt="QR Code" 
                      className="w-20 h-20"
                    />
                    <div>
                      <p className="text-sm font-mono">{selectedOrder.qrCode}</p>
                      <button 
                        onClick={() => printQRCode(selectedOrder)}
                        className="mt-2 flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                      >
                        <Printer className="w-4 h-4" /> Imprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h4 className="font-medium mb-2 text-orange-700">Notes</h4>
                  <p className="text-sm text-orange-600">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Client Modal */}
      {showCallModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                Produit indisponible
              </h2>
              <p className="text-sm text-gray-500 mt-1">Le produit n'est pas chez le fournisseur</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium">{selectedOrder.customer}</p>
                <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                <a 
                  href={`tel:${selectedOrder.phone}`}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  <Phone className="w-4 h-4" /> Appeler le client
                </a>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes après l'appel</label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                  placeholder="Ex: Client informé, commande annulée..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => {
                  setShowCallModal(false)
                  setCallNotes('')
                }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                onClick={saveCallNotes}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
              >
                Marquer indisponible
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
