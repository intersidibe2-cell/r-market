import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Package, 
  Truck, 
  Check, 
  AlertTriangle, 
  RefreshCw,
  Download,
  Search,
  Filter,
  Eye,
  QrCode,
  Clock,
  MapPin,
  Phone,
  History,
  User
} from 'lucide-react'
import { createOrderQRData, getStatusLabel, getStatusColor, addScanLog, type QRScanStatus } from '../../utils/qrGenerator'
import { useNotification } from '../../context/NotificationContext'

interface DeliveryOrder {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  address: string
  total: number
  items: number
  status: QRScanStatus
  assignedTo?: string
  createdAt: string
  qrData: any
}

// Mock delivery orders
const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: 'DEL-001',
    orderId: 'CMD-001',
    customerName: 'Moussa Dembélé',
    customerPhone: '+223 70 12 34 56',
    address: 'Bamako, Quartier ACI 2000',
    total: 65000,
    items: 2,
    status: 'pending_scan',
    createdAt: '2026-04-13T08:00:00Z',
    qrData: null
  },
  {
    id: 'DEL-002',
    orderId: 'CMD-002',
    customerName: 'Fatima Zohra',
    customerPhone: '+223 66 78 90 12',
    address: 'Kayes, Rue 12',
    total: 25800,
    items: 3,
    status: 'picked_up',
    assignedTo: 'Mamadou Traoré',
    createdAt: '2026-04-13T09:00:00Z',
    qrData: null
  },
  {
    id: 'DEL-003',
    orderId: 'CMD-003',
    customerName: 'Alpha Oumar',
    customerPhone: '+223 77 34 56 78',
    address: 'Kati, Hamdallaye',
    total: 58000,
    items: 1,
    status: 'in_transit',
    assignedTo: 'Mamadou Traoré',
    createdAt: '2026-04-13T10:00:00Z',
    qrData: null
  },
  {
    id: 'DEL-004',
    orderId: 'CMD-004',
    customerName: 'Amina Diallo',
    customerPhone: '+223 65 90 12 34',
    address: 'Ségou, Centre ville',
    total: 48000,
    items: 1,
    status: 'delivered',
    assignedTo: 'Mamadou Traoré',
    createdAt: '2026-04-12T14:00:00Z',
    qrData: null
  }
]

// Generate QR data for each order
mockDeliveryOrders.forEach(order => {
  order.qrData = createOrderQRData(
    order.orderId,
    order.customerName,
    order.total,
    order.items,
    order.address
  )
})

export default function DeliveryManagement() {
  const { success } = useNotification()
  
  const [orders, setOrders] = useState<DeliveryOrder[]>(mockDeliveryOrders)
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [statusFilter, setStatusFilter] = useState<QRScanStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    if (searchTerm && !order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const statusCounts = {
    all: orders.length,
    pending_scan: orders.filter(o => o.status === 'pending_scan').length,
    picked_up: orders.filter(o => o.status === 'picked_up').length,
    in_transit: orders.filter(o => o.status === 'in_transit').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    problem_reported: orders.filter(o => o.status === 'problem_reported').length
  }

  const handleUpdateStatus = (orderId: string, newStatus: QRScanStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ))
    
    const order = orders.find(o => o.id === orderId)
    if (order) {
      addScanLog({
        qrData: order.qrData,
        scannedBy: 'Admin',
        status: newStatus,
        device: 'tscd',
        notes: `Statut mis à jour par admin: ${getStatusLabel(newStatus)}`
      })
    }
    
    success('Statut mis à jour', getStatusLabel(newStatus))
  }

  const handlePrintQR = (order: DeliveryOrder) => {
    // Open print dialog
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${order.orderId}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr { margin: 20px auto; }
              .info { margin-top: 20px; }
              .info h2 { margin: 5px 0; }
              .info p { margin: 5px 0; color: #666; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="qr">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(order.qrData))}" />
            </div>
            <div class="info">
              <h2>${order.orderId}</h2>
              <p>${order.customerName}</p>
              <p>${order.address}</p>
              <p>${order.total.toLocaleString()} FCFA</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `)
    }
  }

  const getDeliveryStats = () => {
    const total = orders.length
    const delivered = orders.filter(o => o.status === 'delivered').length
    const inTransit = orders.filter(o => ['picked_up', 'in_transit'].includes(o.status)).length
    const problems = orders.filter(o => o.status === 'problem_reported').length
    
    return { total, delivered, inTransit, problems, rate: total > 0 ? Math.round((delivered / total) * 100) : 0 }
  }

  const stats = getDeliveryStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-7 h-7" />
            Gestion des Livraisons
          </h2>
          <p className="text-gray-500">QR Codes, ТСД et suivi des livraisons</p>
        </div>
        <div className="flex gap-2">
          <a 
            href="/delivery-scan"
            target="_blank"
            className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-green-700"
          >
            <QrCode className="w-4 h-4" />
            App Livreur
          </a>
          <a 
            href="/barcode-scanner"
            target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700"
          >
            <Package className="w-4 h-4" />
            Scanner Code-barres
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending_scan}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">En transit</p>
          <p className="text-3xl font-bold text-purple-600">{stats.inTransit}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Livrées</p>
          <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Taux livraison</p>
          <p className="text-3xl font-bold text-blue-600">{stats.rate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par commande ou client..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending_scan', 'picked_up', 'in_transit', 'delivered'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tous' : getStatusLabel(status)}
                <span className="ml-1 opacity-70">({statusCounts[status]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <th className="px-6 py-4 font-medium">Commande</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Adresse</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">QR Code</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{order.orderId}</p>
                      <p className="text-sm text-gray-500">{order.items} article(s)</p>
                      <p className="text-sm font-medium text-green-600">{order.total.toLocaleString()} F</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{order.address}</p>
                    {order.assignedTo && (
                      <p className="text-xs text-gray-400">Livreur: {order.assignedTo}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status === 'pending_scan' && <Clock className="w-3 h-3" />}
                      {order.status === 'picked_up' && <Package className="w-3 h-3" />}
                      {order.status === 'in_transit' && <Truck className="w-3 h-3" />}
                      {order.status === 'delivered' && <Check className="w-3 h-3" />}
                      {order.status === 'problem_reported' && <AlertTriangle className="w-3 h-3" />}
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelectedOrder(order); setShowQR(true) }}
                      className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors"
                    >
                      <QrCode className="w-6 h-6" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePrintQR(order)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Imprimer QR"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedOrder(order); setShowQR(true) }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">QR Code - {selectedOrder.orderId}</h3>
              <button onClick={() => setShowQR(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <QRCodeCanvas 
                value={JSON.stringify(selectedOrder.qrData)}
                size={250}
                level="H"
                includeMargin
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                Scannez ce QR code avec l'application livreur<br />
                ou le ТСД pour confirmer la livraison
              </p>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handlePrintQR(selectedOrder)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200"
              >
                <Download className="w-4 h-4" />
                Imprimer
              </button>
              <button
                onClick={() => { setShowQR(false); setSelectedOrder(null) }}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
