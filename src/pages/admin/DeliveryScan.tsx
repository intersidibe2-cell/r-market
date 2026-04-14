import { useState, useEffect, useRef } from 'react'
import { Camera, CheckCircle, XCircle, Package, User, MapPin, Phone, AlertTriangle, RefreshCw, Printer, QrCode } from 'lucide-react'

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
  supplierName?: string
  supplierAddress?: string
}

// Mock orders for testing
const mockOrders: Order[] = [
  {
    id: 'CMD-001',
    customer: 'Moussa Dembélé',
    phone: '+223 70 12 34 56',
    address: 'Bamako, Quartier ACI, Rue 123',
    items: [
      { id: 1, name: 'Robe bazin riche brodée', sku: 'MAL-MOD-01-0001', price: 35000, quantity: 1, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop' }
    ],
    total: 35000,
    status: 'ready_for_delivery',
    date: '14/04/2026',
    qrCode: 'CMD-001-PROD-001',
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
    status: 'picked_up',
    date: '14/04/2026',
    qrCode: 'CMD-002-PROD-001',
    supplierName: 'Pharmacie Bamako',
    supplierAddress: 'Bamako, Quartier Hippodrome'
  }
]

export default function DeliveryScan() {
  const [scanning, setScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState('')
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null)
  const [message, setMessage] = useState('')
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [manualCode, setManualCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Start camera for scanning
  const startScanning = async () => {
    setScanning(true)
    setScanResult(null)
    setMessage('')
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
      setMessage('Impossible d\'accéder à la caméra. Utilisez la saisie manuelle.')
      setScanning(false)
    }
  }

  // Stop camera
  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  // Process scanned code
  const processCode = (code: string) => {
    setScannedCode(code)
    stopScanning()
    
    // Find order by QR code
    const order = orders.find(o => o.qrCode === code || o.id === code)
    
    if (order) {
      setCurrentOrder(order)
      setScanResult('success')
      setMessage('Commande trouvée !')
    } else {
      setScanResult('error')
      setMessage('Code non reconnu. Vérifiez le QR code.')
      setCurrentOrder(null)
    }
  }

  // Handle manual code input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      processCode(manualCode.trim())
      setManualCode('')
    }
  }

  // Confirm delivery
  const confirmDelivery = () => {
    if (!currentOrder) return
    
    // Update order status
    setOrders(orders.map(o => 
      o.id === currentOrder.id ? { ...o, status: 'delivered' } : o
    ))
    
    setScanResult('success')
    setMessage('✅ Livraison confirmée avec succès !')
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCurrentOrder(null)
      setScanResult(null)
      setMessage('')
      setScannedCode('')
    }, 3000)
  }

  // Report problem
  const reportProblem = () => {
    if (!currentOrder) return
    
    // Update order status
    setOrders(orders.map(o => 
      o.id === currentOrder.id ? { ...o, status: 'problem_reported' } : o
    ))
    
    setScanResult('error')
    setMessage('⚠️ Problème signalé. L\'administrateur sera notifié.')
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCurrentOrder(null)
      setScanResult(null)
      setMessage('')
      setScannedCode('')
    }, 3000)
  }

  // Reset scanner
  const resetScanner = () => {
    setCurrentOrder(null)
    setScanResult(null)
    setMessage('')
    setScannedCode('')
    setManualCode('')
  }

  // Get orders ready for delivery
  const readyOrders = orders.filter(o => o.status === 'ready_for_delivery')
  const pickedUpOrders = orders.filter(o => o.status === 'picked_up')

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            Livraison R-Market
          </h1>
          <p className="text-gray-500 text-sm mt-1">Scannez le QR code pour vérifier la commande</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-sm text-gray-500">À livrer</p>
            <p className="text-2xl font-bold text-yellow-600">{readyOrders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-sm text-gray-500">Récupérées</p>
            <p className="text-2xl font-bold text-blue-600">{pickedUpOrders.length}</p>
          </div>
        </div>

        {/* Scanner Section */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Scanner un QR code
            </h2>

            {/* Camera Scanner */}
            <div className="relative">
              {scanning ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 bg-black rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-4 border-green-500 rounded-xl animate-pulse" />
                  </div>
                  <button
                    onClick={stopScanning}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startScanning}
                  className="w-full h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Camera className="w-12 h-12 text-gray-400" />
                  <span className="text-gray-500">Appuyez pour scanner</span>
                </button>
              )}
            </div>

            {/* Manual Input */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-2">Ou saisissez le code manuellement :</p>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="CMD-001-PROD-001"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Valider
                </button>
              </form>
            </div>

            {/* Message */}
            {message && scanResult === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-500" />
                <p className="text-red-700">{message}</p>
              </div>
            )}
          </div>
        )}

        {/* Order Details */}
        {currentOrder && (
          <div className="space-y-4">
            {/* Status Banner */}
            <div className={`rounded-2xl p-4 ${
              scanResult === 'success' && message.includes('confirmée') 
                ? 'bg-green-50 border border-green-200'
                : scanResult === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                {scanResult === 'success' && message.includes('confirmée') ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : scanResult === 'error' ? (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                ) : (
                  <Package className="w-8 h-8 text-blue-500" />
                )}
                <div>
                  <p className="font-bold text-lg">{currentOrder.id}</p>
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                Client
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{currentOrder.customer}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {currentOrder.phone}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {currentOrder.address}
                </p>
              </div>
            </div>

            {/* Supplier Info */}
            {currentOrder.supplierName && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Fournisseur
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">{currentOrder.supplierName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {currentOrder.supplierAddress}
                  </p>
                </div>
              </div>
            )}

            {/* Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Produits à livrer</h3>
              <div className="space-y-3">
                {currentOrder.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-green-600">{item.price.toLocaleString()} F</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-green-600">{currentOrder.total.toLocaleString()} F</span>
              </div>
            </div>

            {/* Actions */}
            {currentOrder.status !== 'delivered' && currentOrder.status !== 'problem_reported' && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={confirmDelivery}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirmer livraison
                </button>
                <button
                  onClick={reportProblem}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Signaler problème
                </button>
              </div>
            )}

            {/* Success Message */}
            {message.includes('confirmée') && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="font-bold text-green-700 text-lg">Livraison confirmée !</p>
                <p className="text-sm text-green-600">Le client a été notifié.</p>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={resetScanner}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Scanner un autre produit
            </button>
          </div>
        )}

        {/* Quick Access - Orders Ready */}
        {!currentOrder && readyOrders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Commandes prêtes à livrer</h3>
            <div className="space-y-3">
              {readyOrders.map(order => (
                <button
                  key={order.id}
                  onClick={() => processCode(order.qrCode || order.id)}
                  className="w-full flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <span className="font-bold text-green-600">{order.total.toLocaleString()} F</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
