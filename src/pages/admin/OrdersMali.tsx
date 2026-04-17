import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Search, Eye, Check, X, Truck, Phone, MapPin, Package, QrCode, Printer, AlertCircle, Clock, CheckCircle, MessageCircle, RefreshCw, TrendingUp, DollarSign, Users, PackageCheck, PackageX } from 'lucide-react'
import { getSupplierWhatsapp, generateSupplierWhatsappMessage, generateWhatsappUrl } from '../../utils/supplierWhatsapp'
import { supabase } from '../../lib/supabase'
import { CONFIG, notifyStatusChange } from '../../lib/config'

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

const initialOrders: Order[] = []

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
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('all')
  const [showCallModal, setShowCallModal] = useState(false)
  const [callNotes, setCallNotes] = useState('')

  // Load orders from Supabase
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .eq('type', 'mali')
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data.map((order: any) => ({
        id: order.order_number,
        customer: order.client_name,
        phone: order.client_phone,
        address: order.client_address || '',
        items: (JSON.parse(order.items || '[]') as any[]).map((item, idx) => ({
          id: idx + 1,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sku: '',
          image: ''
        })),
        total: order.total,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString('fr-FR')
      })))
    }
    setLoading(false)
  }

  // Filter orders
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  // Mettre à jour le statut et sync avec Supabase + notifier le client
  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase
      .from('commandes')
      .update({ status: newStatus })
      .eq('order_number', orderId)
    
    const order = orders.find(o => o.id === orderId)
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ))
    // Notifier le client du changement de statut
    if (order?.phone) {
      notifyStatusChange(order.phone, order.customer, orderId, newStatus)
    }
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
    revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    todayOrders: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length,
    todayRevenue: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).reduce((sum, o) => sum + (o.total || 0), 0),
  }

  const quickActions = [
    { label: 'Produits', icon: Package, link: '/admin-panel/products', color: 'bg-purple-600' },
    { label: 'Fournisseurs', icon: Users, link: '/admin-panel/suppliers', color: 'bg-orange-600' },
    { label: 'Livraisons', icon: Truck, link: '/admin-panel/delivery', color: 'bg-cyan-600' },
    { label: 'Analytics', icon: TrendingUp, link: '/admin-panel/analytics', color: 'bg-indigo-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            Commandes Mali
          </h1>
          <p className="text-gray-500 text-sm">{stats.total} commandes • Workflow: Fournisseur → Stock → Client</p>
        </div>
        <button 
          onClick={loadOrders}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center gap-2"
          title="Actualiser"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.link}
            className={`${action.color} text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <action.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus du jour</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <ShoppingCart className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayOrders}</p>
          <p className="text-sm text-white/80">Commandes aujourd'hui</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Action requise</span>
          </div>
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-sm text-white/80">En attente</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.revenue.toLocaleString()} F</p>
          <p className="text-sm text-white/80">Revenus global</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageCheck className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Package className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.pickupRequired}</p>
          <p className="text-xs text-gray-500">À récupérer</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageCheck className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
          <p className="text-xs text-gray-500">Livrées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Users className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.readyForDelivery}</p>
          <p className="text-xs text-gray-500">Prêtes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <PackageX className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-xl font-bold text-gray-900">{stats.unavailable}</p>
          <p className="text-xs text-gray-500">Indisponibles</p>
        </div>
        <Link to="/admin-panel/russian-orders" className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-center">
          <span className="text-2xl">🇷����</span>
        </Link>
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
                    
                    {/* Call client */}
                    <button 
                      onClick={() => window.open(`tel:${order.phone}`, '_blank')}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                      title="Appeler"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    
{/* WhatsApp client */}
                    <button 
                      onClick={() => window.open(`https://wa.me/${order.phone.replace(/\D/g, '')}`, '_blank')}
                      className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                      title="WhatsApp client"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    
                    {/* Partager commande (pour transmits au fournisseur) */}
                    <button 
                      onClick={() => {
                        const itemsList = order.items.map(item => `• ${item.name} x${item.quantity} = ${item.price.toLocaleString()} Fcfa`).join('%0A')
                        const message = `🛒 COMMANDE R-MARKET - ${order.id}\n\nClient: ${order.customer}\nTéléphone: ${order.phone}\nAdresse: ${order.address}\n\nArticles:\n${order.items.map(i => `• ${i.name} x${i.quantity} = ${i.price.toLocaleString()} FCFA`).join('\n')}\n\nTotal: ${order.total.toLocaleString()} FCFA\n\nVeuillez préparer cette commande.`
                        window.open(`https://wa.me/${CONFIG.WHATSAPP_GERANT}?text=${encodeURIComponent(message)}`, '_blank')
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
                      title="Transmettre au fournisseur"
                    >
                      <Truck className="w-4 h-4" /> Fournisseur
                    </button>

                    {/* Confirmer */}
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'confirmed')}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                      >
                        <Check className="w-4 h-4" /> Confirmer
                      </button>
                    )}
                    
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

                    {/* Livré */}
                    {(order.status === 'ready_for_delivery' || order.status === 'picked_up') && (
                      <button 
                        onClick={() => updateStatus(order.id, 'delivered')}
                        className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                      >
                        <CheckCircle className="w-4 h-4" /> Livré
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
