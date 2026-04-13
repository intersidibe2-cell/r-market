import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { QRCodeCanvas } from 'qrcode.react'
import { 
  Camera, 
  Check, 
  X, 
  AlertTriangle, 
  Package, 
  MapPin, 
  User, 
  Clock,
  RefreshCw,
  History,
  ArrowLeft,
  Smartphone,
  CheckCircle,
  Truck
} from 'lucide-react'
import { 
  createOrderQRData, 
  decodeQRData, 
  addScanLog, 
  getStatusLabel, 
  getStatusColor
} from '../utils/qrGenerator'
import { OrderQRData, QRScanStatus } from '../utils/types'
import { useNotification } from '../context/NotificationContext'

// Mock orders data
const mockOrders = [
  {
    orderId: 'CMD-001',
    customerName: 'Moussa Dembélé',
    total: 65000,
    items: 2,
    address: 'Bamako, Quartier ACI 2000'
  },
  {
    orderId: 'CMD-002',
    customerName: 'Fatima Zohra',
    total: 25800,
    items: 3,
    address: 'Kayes, Rue 12'
  },
  {
    orderId: 'CMD-003',
    customerName: 'Alpha Oumar',
    total: 58000,
    items: 1,
    address: 'Kati, Hamdallaye'
  }
]

export default function DeliveryScan() {
  const navigate = useNavigate()
  const { success, error, warning } = useNotification()
  
  const [mode, setMode] = useState<'scan' | 'dashboard'>('dashboard')
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<OrderQRData | null>(null)
  const [scanLogs, setScanLogs] = useState<any[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<QRScanStatus>('pending_scan')
  const [problemModal, setProblemModal] = useState(false)
  const [problemDescription, setProblemDescription] = useState('')
  
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Charger les logs de scan
    const savedLogs = localStorage.getItem('rmarket_scan_logs')
    if (savedLogs) {
      setScanLogs(JSON.parse(savedLogs))
    }
    
    return () => {
      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.stop().catch(console.error)
        }
      }
    }
  }, [])

  const startScanning = async () => {
    setScanning(true)
    setScanResult(null)
    
    try {
      scannerRef.current = new Html5Qrcode('qr-reader')
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1
        },
        onScanSuccess,
        onScanFailure
      )
    } catch (err) {
      console.error('Erreur démarrage scan:', err)
      error('Erreur', 'Impossible d\'accéder à la caméra')
      setScanning(false)
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop()
        }
      } catch (err) {
        console.error('Erreur arrêt scan:', err)
      }
    }
    setScanning(false)
  }

  const onScanSuccess = (decodedText: string) => {
    const data = decodeQRData(decodedText)
    
    if (data && 'orderId' in data) {
      // Vibration feedback
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }
      
      stopScanning()
      setScanResult(data as OrderQRData)
      setCurrentStatus((data as OrderQRData).status)
      
      // Log the scan
      addScanLog({
        qrData: data,
        scannedBy: 'Livreur',
        status: (data as OrderQRData).status,
        device: 'phone'
      })
      
      success('QR Code scanné !', `Commande ${(data as OrderQRData).orderId}`)
    } else {
      warning('QR non reconnu', 'Ce QR code n\'est pas une commande R-Market')
    }
  }

  const onScanFailure = (error: string) => {
    // Silent fail - continuously scanning
  }

  const handleStatusUpdate = (newStatus: QRScanStatus) => {
    if (!scanResult) return
    
    // Update local state
    setCurrentStatus(newStatus)
    setScanResult({ ...scanResult, status: newStatus })
    
    // Save to localStorage (mock)
    const deliveryData = JSON.parse(localStorage.getItem('rmarket_delivery') || '{}')
    deliveryData[scanResult.orderId] = {
      ...scanResult,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem('rmarket_delivery', JSON.stringify(deliveryData))
    
    // Log the action
    addScanLog({
      qrData: scanResult,
      scannedBy: 'Livreur',
      status: newStatus,
      device: 'phone',
      notes: getStatusLabel(newStatus)
    })
    
    success('Statut mis à jour', getStatusLabel(newStatus))
    
    if (newStatus === 'delivered' || newStatus === 'confirmed') {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setScanResult(null)
        setCurrentStatus('pending_scan')
      }, 3000)
    }
  }

  const handleReportProblem = () => {
    if (!scanResult) return
    
    handleStatusUpdate('problem_reported')
    setProblemModal(false)
    setProblemDescription('')
    
    warning('Problème signalé', 'Le problème a été signalé à l\'administrateur')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg">Scan Livraison</h1>
              <p className="text-green-200 text-sm">R-Market Mali</p>
            </div>
          </div>
          <Smartphone className="w-6 h-6" />
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="bg-white border-b p-2 flex gap-2">
        <button
          onClick={() => setMode('dashboard')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            mode === 'dashboard' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Package className="w-4 h-4 inline mr-1" />
          Commandes
        </button>
        <button
          onClick={() => setMode('scan')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            mode === 'scan' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Camera className="w-4 h-4 inline mr-1" />
          Scanner
        </button>
      </div>

      <div className="p-4">
        {mode === 'dashboard' ? (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => { setMode('scan'); startScanning() }}
                className="bg-green-600 text-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg"
              >
                <Camera className="w-10 h-10" />
                <span className="font-semibold">Scanner QR</span>
              </button>
              <button
                onClick={() => navigate('/order-tracking')}
                className="bg-blue-600 text-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg"
              >
                <Truck className="w-10 h-10" />
                <span className="font-semibold">Suivi</span>
              </button>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Commandes à livrer
              </h2>
              
              <div className="space-y-3">
                {mockOrders.map(order => {
                  const qrData = createOrderQRData(
                    order.orderId,
                    order.customerName,
                    order.total,
                    order.items,
                    order.address
                  )
                  
                  return (
                    <div key={order.orderId} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{order.orderId}</p>
                          <p className="text-sm text-gray-500">{order.customerName}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                          En attente
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {order.address}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.items} article(s) - {order.total.toLocaleString()} FCFA
                        </p>
                      </div>
                      
                      <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center">
                        <QRCodeCanvas 
                          value={JSON.stringify(qrData)}
                          size={150}
                          level="H"
                          includeMargin
                        />
                        <p className="text-xs text-gray-500 mt-2">QR Code de la commande</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Scans */}
            {scanLogs.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h2 className="font-bold text-lg mb-4">Scans récents</h2>
                <div className="space-y-2">
                  {scanLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {'orderId' in log.qrData ? log.qrData.orderId : 'Produit'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.scannedAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(log.status)}`}>
                        {getStatusLabel(log.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scanner */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scanner QR Code
              </h2>
              
              {!scanning && !scanResult ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Cliquez sur le bouton ci-dessous pour activer la caméra
                  </p>
                  <button
                    onClick={startScanning}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold"
                  >
                    Activer la caméra
                  </button>
                </div>
              ) : scanning ? (
                <div className="text-center">
                  <div 
                    id="qr-reader" 
                    ref={videoContainerRef}
                    className="mx-auto rounded-xl overflow-hidden"
                  />
                  <button
                    onClick={stopScanning}
                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Arrêter
                  </button>
                </div>
              ) : null}
            </div>

            {/* Scan Result */}
            {scanResult && (
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl">{scanResult.orderId}</h3>
                  <p className="text-gray-500">{scanResult.customerName}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-bold text-lg">{scanResult.total.toLocaleString()} F</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Articles</p>
                      <p className="font-bold text-lg">{scanResult.items}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {scanResult.address}
                    </p>
                  </div>
                </div>
                
                {/* Status Update Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => handleStatusUpdate('picked_up')}
                    disabled={currentStatus !== 'pending_scan'}
                    className={`py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${
                      currentStatus === 'pending_scan'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Récupérer
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('in_transit')}
                    disabled={!['picked_up'].includes(currentStatus)}
                    className={`py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${
                      currentStatus === 'picked_up'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    En transit
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('delivered')}
                    disabled={!['picked_up', 'in_transit'].includes(currentStatus)}
                    className={`py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${
                      ['picked_up', 'in_transit'].includes(currentStatus)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Livrer
                  </button>
                  <button
                    onClick={() => setProblemModal(true)}
                    disabled={['delivered', 'confirmed', 'problem_reported'].includes(currentStatus)}
                    className={`py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${
                      !['delivered', 'confirmed', 'problem_reported'].includes(currentStatus)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Problème
                  </button>
                </div>
                
                <button
                  onClick={() => { setScanResult(null); setCurrentStatus('pending_scan') }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
                >
                  Scanner une autre commande
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Problem Modal */}
      {problemModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Signaler un problème
            </h3>
            
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Décrivez le problème..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none h-32 mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setProblemModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleReportProblem}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium"
              >
                Signaler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 bg-green-500 z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Livraison confirmée !</h2>
            <p className="text-green-100">La commande a été marquée comme livrée</p>
          </div>
        </div>
      )}
    </div>
  )
}
