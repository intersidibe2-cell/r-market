import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Search, Eye, Check, X, Truck, Phone, MapPin, Package, QrCode, Printer, AlertCircle, Clock, CheckCircle, MessageCircle, RefreshCw, TrendingUp, DollarSign, Users, PackageCheck, PackageX, Send, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { CONFIG, notifyStatusChange, notifySupplier } from '../../lib/config'

interface Order {
  id: string
  order_number: string
  client_name: string
  client_phone: string
  client_address: string
  items: any[]
  total: number
  status: string
  type: string
  payment_method: string
  notes: string
  supplier_id: string
  supplier_name: string
  qr_code: string
  created_at: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any; step: number }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock, step: 1 },
  sent_to_supplier: { label: 'Chez fournisseur', color: 'text-orange-700', bg: 'bg-orange-100', icon: Send, step: 2 },
  picked_up: { label: 'Recupere', color: 'text-blue-700', bg: 'bg-blue-100', icon: Package, step: 3 },
  qr_labeled: { label: 'QR colle', color: 'text-purple-700', bg: 'bg-purple-100', icon: QrCode, step: 4 },
  in_delivery: { label: 'En livraison', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Truck, step: 5 },
  delivered: { label: 'Livre', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle, step: 6 },
  cancelled: { label: 'Annule', color: 'text-red-700', bg: 'bg-red-100', icon: X, step: 0 },
  unavailable: { label: 'Indisponible', color: 'text-gray-700', bg: 'bg-gray-200', icon: AlertCircle, step: 0 },
}

export default function OrdersMali() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showCallModal, setShowCallModal] = useState(false)
  const [callNotes, setCallNotes] = useState('')
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [showSupplierPicker, setShowSupplierPicker] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
    loadSuppliers()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .eq('type', 'mali')
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data.map((o: any) => ({
        ...o,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
      })))
    }
    setLoading(false)
  }

  const loadSuppliers = async () => {
    const { data } = await supabase
      .from('fournisseurs')
      .select('*')
      .order('name')
    if (data) setSuppliers(data)
  }

  // Mettre a jour le statut dans Supabase + notifier client
  const updateStatus = async (orderNumber: string, newStatus: string, extraData?: Record<string, any>) => {
    const updateData: any = { status: newStatus, updated_at: new Date().toISOString(), ...extraData }
    
    await supabase
      .from('commandes')
      .update(updateData)
      .eq('order_number', orderNumber)
    
    const order = orders.find(o => o.order_number === orderNumber)
    
    // Mise a jour locale
    setOrders(prev => prev.map(o => 
      o.order_number === orderNumber ? { ...o, ...updateData } : o
    ))

    // Notifier le client
    if (order?.client_phone && !['pending'].includes(newStatus)) {
      notifyStatusChange(order.client_phone, order.client_name, orderNumber, newStatus)
    }
  }

  // Envoyer au fournisseur via WhatsApp
  const sendToSupplier = async (order: Order, supplier: any) => {
    // Mettre a jour la commande avec le fournisseur
    await updateStatus(order.order_number, 'sent_to_supplier', {
      supplier_id: supplier.id,
      supplier_name: supplier.name
    })

    // Ouvrir WhatsApp avec le message
    const phone = supplier.whatsapp || supplier.phone
    if (phone) {
      notifySupplier(phone, supplier.name, order.order_number, order.items, order.client_address)
    }
    setShowSupplierPicker(null)
  }

  // Marquer comme recupere + generer QR code
  const markPickedUp = async (order: Order) => {
    const qrCode = `CMD-${order.order_number}-${Date.now().toString(36).toUpperCase()}`
    await updateStatus(order.order_number, 'picked_up', { qr_code: qrCode })
  }

  // Marquer QR colle
  const markQrLabeled = async (order: Order) => {
    await updateStatus(order.order_number, 'qr_labeled')
  }

  // Marquer en livraison
  const markInDelivery = async (order: Order) => {
    await updateStatus(order.order_number, 'in_delivery')
  }

  // Marquer livre
  const markDelivered = async (order: Order) => {
    await updateStatus(order.order_number, 'delivered')
  }

  // Marquer indisponible (apres appel client)
  const markUnavailable = async () => {
    if (selectedOrder) {
      await updateStatus(selectedOrder.order_number, 'unavailable', { notes: callNotes })
      setShowCallModal(false)
      setCallNotes('')
      setSelectedOrder(null)
    }
  }

  // Imprimer QR code
  const printQRCode = (order: Order) => {
    const qr = order.qr_code
    if (!qr) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>QR - ${order.order_number}</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 20px; }
            .qr-container { border: 2px solid #000; padding: 15px; display: inline-block; }
            .order-id { font-size: 16px; font-weight: bold; margin: 8px 0; }
            .customer { font-size: 12px; color: #666; }
            .items { font-size: 11px; color: #888; margin: 8px 0; }
            img { width: 150px; height: 150px; }
          </style></head>
          <body>
            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr)}" />
              <div class="order-id">${order.order_number}</div>
              <div class="customer">${order.client_name}</div>
              <div class="items">${order.items.map((i: any) => i.name).join(', ')}</div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Filtrer
  const filteredOrders = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => {
      if (!search) return true
      const s = search.toLowerCase()
      return o.order_number.toLowerCase().includes(s) || 
             o.client_name.toLowerCase().includes(s) ||
             o.client_phone.includes(s)
    })

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    sentToSupplier: orders.filter(o => o.status === 'sent_to_supplier').length,
    pickedUp: orders.filter(o => o.status === 'picked_up').length,
    qrLabeled: orders.filter(o => o.status === 'qr_labeled').length,
    inDelivery: orders.filter(o => o.status === 'in_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    unavailable: orders.filter(o => o.status === 'unavailable').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            Commandes Mali
          </h1>
          <p className="text-gray-500 text-sm">{stats.total} commandes | Workflow: Fournisseur → Recuperation → QR → Livraison</p>
        </div>
        <button onClick={loadOrders} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Pipeline visuel */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { key: 'pending', count: stats.pending, icon: Clock, color: 'yellow' },
            { key: 'sent_to_supplier', count: stats.sentToSupplier, icon: Send, color: 'orange' },
            { key: 'picked_up', count: stats.pickedUp, icon: Package, color: 'blue' },
            { key: 'qr_labeled', count: stats.qrLabeled, icon: QrCode, color: 'purple' },
            { key: 'in_delivery', count: stats.inDelivery, icon: Truck, color: 'indigo' },
            { key: 'delivered', count: stats.delivered, icon: CheckCircle, color: 'green' },
          ].map((s, i) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`text-center p-3 rounded-xl transition-all ${
                filter === s.key ? `bg-${s.color}-100 ring-2 ring-${s.color}-400` : `bg-${s.color}-50 hover:bg-${s.color}-100`
              }`}
            >
              <s.icon className={`w-5 h-5 text-${s.color}-600 mx-auto mb-1`} />
              <p className={`text-xl font-bold text-${s.color}-700`}>{s.count}</p>
              <p className={`text-xs text-${s.color}-600`}>{statusConfig[s.key]?.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recherche + Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par numero, nom ou telephone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Toutes ({stats.total})
          </button>
          <button
            onClick={() => setFilter('unavailable')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'unavailable' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Indisponibles ({stats.unavailable})
          </button>
        </div>
      </div>

      {/* Stats revenus */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
          <DollarSign className="w-6 h-6 opacity-80 mb-2" />
          <p className="text-xl font-bold">{stats.revenue.toLocaleString()} F</p>
          <p className="text-xs text-white/80">Revenus total</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white">
          <Clock className="w-6 h-6 opacity-80 mb-2" />
          <p className="text-xl font-bold">{stats.pending + stats.sentToSupplier}</p>
          <p className="text-xs text-white/80">A traiter</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
          <Truck className="w-6 h-6 opacity-80 mb-2" />
          <p className="text-xl font-bold">{stats.qrLabeled + stats.inDelivery}</p>
          <p className="text-xs text-white/80">En route</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 text-white">
          <CheckCircle className="w-6 h-6 opacity-80 mb-2" />
          <p className="text-xl font-bold">{stats.delivered}</p>
          <p className="text-xs text-white/80">Livrees</p>
        </div>
      </div>

      {/* Liste des commandes */}
      {loading ? (
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune commande trouvee</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const config = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = config.icon
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Info commande */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{order.order_number}</h3>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                        {order.payment_method && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {order.payment_method}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {order.client_name}
                        </span>
                        <span>{order.client_phone}</span>
                        <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {order.client_address && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.client_address}
                        </p>
                      )}
                      {order.supplier_name && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                          <Package className="w-3 h-3" /> Fournisseur: {order.supplier_name}
                        </p>
                      )}
                      {order.notes && (
                        <p className="text-sm text-orange-600 mt-2 bg-orange-50 p-2 rounded-lg">
                          {order.notes}
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-green-600">{order.total?.toLocaleString()} F</p>
                      <p className="text-sm text-gray-500">{order.items.length} article(s)</p>
                    </div>
                  </div>

                  {/* Produits miniatures */}
                  {order.items.some((i: any) => i.image) && (
                    <div className="flex items-center gap-2 mt-3">
                      {order.items.slice(0, 4).map((item: any, idx: number) => (
                        item.image ? (
                          <img key={idx} src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border" />
                        ) : null
                      ))}
                    </div>
                  )}

                  {/* Actions contextuelles */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    {/* Voir details */}
                    <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Details">
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    {/* WhatsApp client */}
                    <a href={`https://wa.me/${order.client_phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="WhatsApp client">
                      <MessageCircle className="w-5 h-5" />
                    </a>
                    
                    {/* Appeler */}
                    <a href={`tel:${order.client_phone}`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Appeler">
                      <Phone className="w-5 h-5" />
                    </a>

                    {/* === ACTIONS PAR STATUT === */}
                    
                    {/* PENDING -> Envoyer au fournisseur */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => setShowSupplierPicker(order.order_number)}
                        className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700"
                      >
                        <Send className="w-4 h-4" /> Envoyer au fournisseur
                      </button>
                    )}

                    {/* SENT_TO_SUPPLIER -> Marquer recupere */}
                    {order.status === 'sent_to_supplier' && (
                      <>
                        <button
                          onClick={() => markPickedUp(order)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          <Package className="w-4 h-4" /> Recupere
                        </button>
                        <button
                          onClick={() => { setSelectedOrder(order); setShowCallModal(true) }}
                          className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                        >
                          <AlertCircle className="w-4 h-4" /> Indisponible
                        </button>
                      </>
                    )}

                    {/* PICKED_UP -> QR code colle */}
                    {order.status === 'picked_up' && (
                      <>
                        <button
                          onClick={() => markQrLabeled(order)}
                          className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                          <Tag className="w-4 h-4" /> QR colle
                        </button>
                        {order.qr_code && (
                          <button onClick={() => printQRCode(order)} className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                            <Printer className="w-4 h-4" /> Imprimer QR
                          </button>
                        )}
                      </>
                    )}

                    {/* QR_LABELED -> En livraison */}
                    {order.status === 'qr_labeled' && (
                      <button
                        onClick={() => markInDelivery(order)}
                        className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                      >
                        <Truck className="w-4 h-4" /> En livraison
                      </button>
                    )}

                    {/* IN_DELIVERY -> Livre */}
                    {order.status === 'in_delivery' && (
                      <button
                        onClick={() => markDelivered(order)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" /> Livre
                      </button>
                    )}

                    {/* Imprimer QR si disponible */}
                    {order.qr_code && order.status !== 'picked_up' && (
                      <button onClick={() => printQRCode(order)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Imprimer QR">
                        <Printer className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Supplier Picker Dropdown */}
                {showSupplierPicker === order.order_number && (
                  <div className="border-t border-gray-100 p-4 bg-orange-50">
                    <p className="font-medium text-sm mb-3">Choisir le fournisseur :</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suppliers.filter(s => s.status === 'active' || s.is_active).map(s => (
                        <button
                          key={s.id}
                          onClick={() => sendToSupplier(order, s)}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
                        >
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                            {s.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.city || ''} {s.whatsapp || s.phone}</p>
                          </div>
                          <MessageCircle className="w-4 h-4 text-green-600" />
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowSupplierPicker(null)} className="mt-2 text-sm text-gray-500 hover:text-gray-700">
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal detail commande */}
      {selectedOrder && !showCallModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{selectedOrder.order_number}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Statut */}
              <div className={`p-4 rounded-xl ${statusConfig[selectedOrder.status]?.bg}`}>
                <div className="flex items-center gap-2">
                  {(() => { const Icon = statusConfig[selectedOrder.status]?.icon || Clock; return <Icon className="w-5 h-5" /> })()}
                  <span className={`font-bold ${statusConfig[selectedOrder.status]?.color}`}>
                    {statusConfig[selectedOrder.status]?.label}
                  </span>
                </div>
              </div>

              {/* Client */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-2">Client</h4>
                <p className="font-medium">{selectedOrder.client_name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.client_phone}</p>
                <p className="text-sm text-gray-500">{selectedOrder.client_address}</p>
                {selectedOrder.payment_method && (
                  <p className="text-sm text-green-600 mt-1">Paiement: {selectedOrder.payment_method}</p>
                )}
              </div>

              {/* Fournisseur */}
              {selectedOrder.supplier_name && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">Fournisseur</h4>
                  <p className="font-medium">{selectedOrder.supplier_name}</p>
                </div>
              )}

              {/* Produits */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-2">Produits</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity || 1}</p>
                      </div>
                      <p className="text-sm font-medium">{(item.price * (item.quantity || 1)).toLocaleString()} F</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">{selectedOrder.total?.toLocaleString()} F</span>
                </div>
              </div>

              {/* QR Code */}
              {selectedOrder.qr_code && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">QR Code</h4>
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(selectedOrder.qr_code)}`} 
                      alt="QR" className="w-20 h-20"
                    />
                    <div>
                      <p className="text-sm font-mono text-gray-600">{selectedOrder.qr_code}</p>
                      <button onClick={() => printQRCode(selectedOrder)} className="mt-2 flex items-center gap-1 text-sm text-purple-600">
                        <Printer className="w-4 h-4" /> Imprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h4 className="font-medium mb-1 text-orange-700">Notes</h4>
                  <p className="text-sm text-orange-600">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <button onClick={() => setSelectedOrder(null)} className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal indisponible */}
      {showCallModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Produit indisponible
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium">{selectedOrder.client_name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.client_phone}</p>
                <a href={`tel:${selectedOrder.client_phone}`}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  <Phone className="w-4 h-4" /> Appeler le client
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes apres l'appel</label>
                <textarea value={callNotes} onChange={e => setCallNotes(e.target.value)} rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                  placeholder="Ex: Client informe, remboursement effectue..." />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setShowCallModal(false); setCallNotes('') }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={markUnavailable}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">
                Marquer indisponible
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
