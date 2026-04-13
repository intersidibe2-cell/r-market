import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { 
  Camera, 
  Package, 
  Search, 
  Plus, 
  Minus,
  ArrowLeft,
  Check,
  AlertTriangle,
  Barcode,
  RefreshCw,
  History
} from 'lucide-react'
import { useNotification } from '../context/NotificationContext'

interface ScannedProduct {
  id: number
  name: string
  sku: string
  barcode: string
  quantity: number
  location: string
  lastScanned: string
}

// Mock product database
const productDatabase: Record<string, ScannedProduct> = {
  'BM001': { id: 1, name: 'Boubou Homme Bazin', sku: 'BM-001', barcode: 'BM001123456', quantity: 45, location: 'Entrepôt A - Étagère 1', lastScanned: '' },
  'SC002': { id: 2, name: 'Sac en Cuir', sku: 'SC-002', barcode: 'SC002234567', quantity: 23, location: 'Entrepôt B - Étagère 3', lastScanned: '' },
  'BA003': { id: 3, name: 'Bijoux Artisanaux', sku: 'BA-003', barcode: 'BA003345678', quantity: 8, location: 'Entrepôt A - Étagère 2', lastScanned: '' },
  'TB004': { id: 4, name: 'Tissu Bogolan', sku: 'TB-004', barcode: 'TB004456789', quantity: 67, location: 'Entrepôt C - Étagère 1', lastScanned: '' },
  'PT005': { id: 5, name: 'Poterie Traditionnelle', sku: 'PT-005', barcode: 'PT005567890', quantity: 3, location: 'Entrepôt B - Étagère 4', lastScanned: '' },
}

type ScanMode = 'quick' | 'inventory' | 'history'

export default function BarcodeScanner() {
  const { success, error, warning } = useNotification()
  
  const [mode, setMode] = useState<ScanMode>('quick')
  const [scanning, setScanning] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [lastScanned, setLastScanned] = useState<ScannedProduct | null>(null)
  const [scanHistory, setScanHistory] = useState<ScannedProduct[]>([])
  const [stockAdjustments, setStockAdjustments] = useState<Record<number, number>>({})
  const [inventoryMode, setInventoryMode] = useState(false)
  const [inventoryList, setInventoryList] = useState<ScannedProduct[]>([])
  
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem('rmarket_barcode_history')
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory))
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
    setLastScanned(null)
    
    try {
      scannerRef.current = new Html5Qrcode('barcode-reader')
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 300, height: 150 },
          aspectRatio: 2
        },
        onBarcodeSuccess,
        onBarcodeFailure
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

  const onBarcodeSuccess = (decodedText: string) => {
    processBarcode(decodedText)
  }

  const onBarcodeFailure = () => {}

  const processBarcode = (barcode: string) => {
    // Chercher dans la base de données
    let product = Object.values(productDatabase).find(p => p.barcode === barcode)
    
    // Si pas trouvé par code-barres, chercher par SKU
    if (!product) {
      product = Object.values(productDatabase).find(p => 
        p.sku.toUpperCase().includes(barcode.toUpperCase()) ||
        p.sku.replace('-', '') === barcode.toUpperCase()
      )
    }
    
    // Si pas trouvé, créer un produit inconnu
    if (!product) {
      warning('Produit non trouvé', `Code: ${barcode}`)
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
    } else {
      // Vibration de succès
      if (navigator.vibrate) navigator.vibrate(200)
      success('Produit trouvé !', product.name)
      
      // Mettre à jour lastScanned
      const updatedProduct = { ...product, lastScanned: new Date().toISOString() }
      setLastScanned(updatedProduct)
      
      // Ajouter à l'historique
      const newHistory = [updatedProduct, ...scanHistory.filter(p => p.id !== product!.id)].slice(0, 20)
      setScanHistory(newHistory)
      localStorage.setItem('rmarket_barcode_history', JSON.stringify(newHistory))
      
      // En mode inventaire, ajouter à la liste
      if (inventoryMode && !inventoryList.find(p => p.id === product!.id)) {
        setInventoryList([...inventoryList, { ...updatedProduct, quantity: 0 }])
      }
    }
    
    stopScanning()
  }

  const handleManualSearch = () => {
    if (!manualInput.trim()) return
    processBarcode(manualInput.trim())
    setManualInput('')
  }

  const adjustStock = (productId: number, delta: number) => {
    setStockAdjustments(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + delta
    }))
  }

  const confirmInventory = () => {
    // Sauvegarder les ajustements
    const adjustments = { ...stockAdjustments }
    localStorage.setItem('rmarket_inventory_adjustments', JSON.stringify(adjustments))
    success('Inventaire sauvegardé', 'Les ajustements ont été enregistrés')
    setInventoryMode(false)
    setInventoryList([])
    setStockAdjustments({})
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg">Scanner Codes-Barres</h1>
              <p className="text-green-200 text-sm">Inventaire & Stock</p>
            </div>
          </div>
          <Barcode className="w-6 h-6" />
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="bg-white border-b p-2 flex gap-2">
        <button
          onClick={() => setMode('quick')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            mode === 'quick' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Search className="w-4 h-4 inline mr-1" />
          Recherche
        </button>
        <button
          onClick={() => { setMode('inventory'); setInventoryMode(true) }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            mode === 'inventory' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Package className="w-4 h-4 inline mr-1" />
          Inventaire
        </button>
        <button
          onClick={() => setMode('history')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            mode === 'history' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <History className="w-4 h-4 inline mr-1" />
          Historique
        </button>
      </div>

      <div className="p-4">
        {/* Quick Search Mode */}
        {mode === 'quick' && (
          <div className="space-y-4">
            {/* Scanner */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scanner un code-barres
              </h2>
              
              {!scanning ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Barcode className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Activez la caméra pour scanner un code-barres ou код SKU
                  </p>
                  <button
                    onClick={startScanning}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold"
                  >
                    Activer la caméra
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div 
                    id="barcode-reader" 
                    className="mx-auto rounded-xl overflow-hidden"
                  />
                  <button
                    onClick={stopScanning}
                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Arrêter
                  </button>
                </div>
              )}
            </div>

            {/* Manual Input */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Entrée manuelle</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                  placeholder="Entrez le SKU ou code-barres..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={handleManualSearch}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Last Scanned Product */}
            {lastScanned && (
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Produit trouvé</p>
                    <p className="font-bold text-lg">{lastScanned.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">SKU</p>
                    <p className="font-bold">{lastScanned.sku}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Code-barres</p>
                    <p className="font-bold">{lastScanned.barcode}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Quantité actuelle</p>
                    <p className="font-bold text-2xl">{lastScanned.quantity}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Emplacement</p>
                    <p className="font-bold text-sm">{lastScanned.location}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inventory Mode */}
        {mode === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventaire en cours
                </h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {inventoryList.length} produits
                </span>
              </div>
              
              {!scanning ? (
                <button
                  onClick={startScanning}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold mb-4"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Scanner produits
                </button>
              ) : (
                <div className="mb-4">
                  <div id="barcode-reader" className="mx-auto rounded-xl overflow-hidden" />
                  <button
                    onClick={stopScanning}
                    className="w-full mt-2 bg-red-600 text-white py-2 rounded-xl font-medium"
                  >
                    Arrêter le scan
                  </button>
                </div>
              )}
            </div>

            {inventoryList.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold mb-4">Produits scannés</h3>
                <div className="space-y-3">
                  {inventoryList.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {product.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustStock(product.id, -1)}
                            className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-16 text-center font-bold text-xl">
                            {product.quantity + (stockAdjustments[product.id] || 0)}
                          </span>
                          <button
                            onClick={() => adjustStock(product.id, 1)}
                            className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {(stockAdjustments[product.id] || 0) !== 0 && (
                          <span className={`text-sm font-medium ${
                            (stockAdjustments[product.id] || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {(stockAdjustments[product.id] || 0) > 0 ? '+' : ''}{stockAdjustments[product.id]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={confirmInventory}
                  className="w-full mt-4 bg-green-600 text-white py-4 rounded-xl font-semibold"
                >
                  Confirmer l'inventaire
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Mode */}
        {mode === 'history' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Historique des scans
            </h2>
            
            {scanHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun scan enregistré</p>
            ) : (
              <div className="space-y-3">
                {scanHistory.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{product.quantity}</p>
                      <p className="text-xs text-gray-400">
                        {product.lastScanned ? new Date(product.lastScanned).toLocaleTimeString('fr-FR') : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {scanHistory.length > 0 && (
              <button
                onClick={() => {
                  setScanHistory([])
                  localStorage.removeItem('rmarket_barcode_history')
                }}
                className="w-full mt-4 text-red-600 py-2 font-medium"
              >
                Effacer l'historique
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
