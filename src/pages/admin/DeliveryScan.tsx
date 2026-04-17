import { useState, useEffect, useRef } from 'react'
import { Camera, CheckCircle, XCircle, Package, User, MapPin, Phone, AlertTriangle, RefreshCw, QrCode, X, Search, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { notifyStatusChange } from '../../lib/config'

interface Order {
  id: string
  order_number: string
  client_name: string
  client_phone: string
  client_address: string
  items: string
  total: number
  status: string
  created_at: string
}

export default function DeliveryScan() {
  const [scanning, setScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState('')
  const [manualCode, setManualCode] = useState('')
  const [foundOrder, setFoundOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const scannerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => stopScanner()
  }, [])

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear()
          scannerRef.current = null
        }).catch(() => {})
      } catch (e) {}
    }
    setScanning(false)
  }

  const startScanner = async () => {
    setScanning(true)
    setMessage(null)
    setFoundOrder(null)

    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        const html5QrCode = new Html5Qrcode('qr-reader')
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            stopScanner()
            setScannedCode(decodedText)
            await searchOrder(decodedText)
          },
          () => {}
        )
      } catch (err: any) {
        setScanning(false)
        setMessage({ type: 'error', text: 'Impossible d\'accéder à la caméra. Utilisez la saisie manuelle.' })
      }
    }, 200)
  }

  const searchOrder = async (code: string) => {
    setLoading(true)
    setMessage(null)
    const cleanCode = code.trim().toUpperCase()

    // Chercher par numéro de commande ou code QR
    const { data, error } = await supabase
      .from('commandes')
      .select('*')
      .or(`order_number.ilike.%${cleanCode}%,id.eq.${cleanCode}`)
      .single()

    if (error || !data) {
      // Essai alternatif — le QR peut contenir CMD-XXXXX-PROD-...
      const orderNum = cleanCode.split('-PROD-')[0].split('-').slice(0, 2).join('-')
      const { data: data2 } = await supabase
        .from('commandes')
        .select('*')
        .ilike('order_number', `%${orderNum}%`)
        .single()

      if (data2) {
        setFoundOrder(data2)
      } else {
        setMessage({ type: 'error', text: `Commande "${cleanCode}" introuvable.` })
        setFoundOrder(null)
      }
    } else {
      setFoundOrder(data)
    }
    setLoading(false)
  }

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    await searchOrder(manualCode)
  }

  const confirmDelivery = async () => {
    if (!foundOrder) return
    setLoading(true)
    const { error } = await supabase
      .from('commandes')
      .update({ status: 'delivered' })
      .eq('id', foundOrder.id)

    if (!error) {
      notifyStatusChange(foundOrder.client_phone, foundOrder.client_name, foundOrder.order_number, 'delivered')
      setMessage({ type: 'success', text: `✅ Commande ${foundOrder.order_number} marquée comme livrée !` })
      setFoundOrder({ ...foundOrder, status: 'delivered' })
    } else {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' })
    }
    setLoading(false)
  }

  const reportProblem = async (reason: string) => {
    if (!foundOrder) return
    setLoading(true)
    const { error } = await supabase
      .from('commandes')
      .update({ status: 'cancelled', notes: reason })
      .eq('id', foundOrder.id)

    if (!error) {
      setMessage({ type: 'info', text: `Problème signalé pour ${foundOrder.order_number}.` })
      setFoundOrder({ ...foundOrder, status: 'cancelled' })
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      picked_up: 'bg-indigo-100 text-indigo-700',
      ready_for_delivery: 'bg-purple-100 text-purple-700',
      in_delivery: 'bg-orange-100 text-orange-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente', confirmed: 'Confirmée', picked_up: 'Récupérée',
      ready_for_delivery: 'Prête', in_delivery: 'En livraison',
      delivered: 'Livrée', cancelled: 'Annulée',
    }
    return labels[status] || status
  }

  const parsedItems = foundOrder ? (() => {
    try { return JSON.parse(foundOrder.items) } catch { return [] }
  })() : []

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <QrCode className="w-6 h-6 text-green-600" />
          Scan Livraison
        </h1>
        <p className="text-gray-500 text-sm">Scannez le QR code ou entrez le numéro de commande</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> :
           message.type === 'error' ? <XCircle className="w-5 h-5 flex-shrink-0" /> :
           <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{message.text}</p>
          <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Scanner QR */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-green-600" /> Scanner QR Code
          </h2>
        </div>

        {scanning ? (
          <div className="p-5 space-y-3">
            <div id="qr-reader" className="w-full rounded-xl overflow-hidden" style={{ minHeight: 280 }} ref={containerRef} />
            <button
              onClick={stopScanner}
              className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Arrêter le scanner
            </button>
          </div>
        ) : (
          <div className="p-5">
            <button
              onClick={startScanner}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              <Camera className="w-6 h-6" /> Ouvrir la caméra
            </button>
          </div>
        )}
      </div>

      {/* Saisie manuelle */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" /> Saisie manuelle
        </h2>
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={e => setManualCode(e.target.value.toUpperCase())}
            placeholder="Ex: CMD-123456"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Commande trouvée */}
      {foundOrder && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">{foundOrder.order_number}</h2>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(foundOrder.status)}`}>
                {getStatusLabel(foundOrder.status)}
              </span>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>

          <div className="p-5 space-y-4">
            {/* Client */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{foundOrder.client_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${foundOrder.client_phone}`} className="text-blue-600">{foundOrder.client_phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{foundOrder.client_address}</span>
              </div>
            </div>

            {/* Articles */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Articles ({parsedItems.length})</p>
              <div className="space-y-1">
                {parsedItems.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2">
                <span>Total</span>
                <span className="text-green-600">{foundOrder.total?.toLocaleString()} F</span>
              </div>
            </div>

            {/* Actions */}
            {foundOrder.status !== 'delivered' && foundOrder.status !== 'cancelled' && (
              <div className="space-y-2">
                <button
                  onClick={confirmDelivery}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                  Confirmer la livraison
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => reportProblem('Client absent')}
                    className="py-2 bg-yellow-100 text-yellow-700 rounded-xl font-medium text-sm"
                  >
                    Client absent
                  </button>
                  <button
                    onClick={() => reportProblem('Adresse incorrecte')}
                    className="py-2 bg-red-100 text-red-700 rounded-xl font-medium text-sm"
                  >
                    Mauvaise adresse
                  </button>
                </div>
              </div>
            )}

            {foundOrder.status === 'delivered' && (
              <div className="flex items-center justify-center gap-2 py-4 bg-green-50 rounded-xl text-green-700 font-semibold">
                <CheckCircle className="w-6 h-6" /> Livraison confirmée !
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
