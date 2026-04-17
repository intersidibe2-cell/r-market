import { useState, useMemo, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { CheckCircle, ArrowLeft, MapPin, CreditCard, Phone, User, Building, Printer, Zap, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CONFIG, notifyGerant, confirmClientOrder } from '../lib/config'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', phone: '', address: '', region: '', commune: '', payment: 'orange', notes: ''
  })
  const [quickCheckout, setQuickCheckout] = useState(false)
  const [savedClient, setSavedClient] = useState<any>(null)
  const [loadingQuick, setLoadingQuick] = useState(false)

  // Generate order number once
  const orderNumber = useMemo(() => `CMD-${Math.floor(100000 + Math.random() * 900000)}`, [])
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({orderNumber, type: 'mali'}))}&bgcolor=ffffff&color=166534&margin=4`

  const shipping = totalPrice >= 5000 ? 0 : 400
  const grandTotal = totalPrice + shipping

  const regions = [
    'Bamako', 'Kayes', 'Koulikoro', 'Sikasso', 'Ségou', 'Mopti', 'Tombouctou', 'Gao', 'Kidal', 'Ménaka', 'Taoudénit'
  ]

  // Check for saved client data on mount
  useEffect(() => {
    const checkSavedClient = async () => {
      const savedPhone = localStorage.getItem('rmarket_last_phone')
      if (savedPhone) {
        const { data: client } = await supabase
          .from('clients')
          .select('*')
          .eq('phone', savedPhone)
          .single()
        
        if (client && client.total_orders > 0) {
          setSavedClient(client)
          setQuickCheckout(true)
        }
      }
    }
    checkSavedClient()
  }, [])

  // Quick checkout - fill form with saved client data
  const handleQuickCheckout = () => {
    if (savedClient) {
      setFormData(prev => ({
        ...prev,
        fullName: savedClient.name || '',
        phone: savedClient.phone || localStorage.getItem('rmarket_last_phone') || '',
        address: savedClient.address || '',
        region: (savedClient.address || '').split(',')[0] || '',
        commune: (savedClient.address || '').split(',')[1] || '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Sauvegarder commande dans Supabase
    const orderData = {
      order_number: orderNumber,
      client_name: formData.fullName,
      client_phone: formData.phone,
      client_address: `${formData.region}, ${formData.commune}, ${formData.address}`,
      items: JSON.stringify(items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))),
      total: grandTotal,
      status: 'pending',
      type: 'mali',
      created_at: new Date().toISOString()
    }

    const { data: orderResult, error } = await supabase.from('commandes').insert(orderData).select()

    if (error) {
      alert('Erreur: ' + error.message)
    } else {
      // Envoyer notification WhatsApp au gérant avec le bon numéro
      notifyGerant(
        orderNumber,
        formData.fullName,
        formData.phone,
        `${formData.region}, ${formData.commune}, ${formData.address}`,
        items,
        grandTotal
      )
      // Confirmation au client
      confirmClientOrder(formData.phone, formData.fullName, orderNumber, grandTotal)
    }

    // Sauvegarder client aussi
    if (formData.fullName && formData.phone) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('*')
        .eq('phone', formData.phone)
        .single()

      if (existingClient) {
        // Mettre à jour client existant
        await supabase.from('clients').update({
          total_orders: existingClient.total_orders + 1,
          total_spent: existingClient.total_spent + grandTotal
        }).eq('phone', formData.phone)
      } else {
        // Créer nouveau client
        await supabase.from('clients').insert({
          name: formData.fullName,
          phone: formData.phone,
          total_orders: 1,
          total_spent: grandTotal
        })
      }
    }

    setOrderPlaced(true)
    clearCart()
    // Save client info for quick checkout
    localStorage.setItem('rmarket_last_phone', formData.phone)
    localStorage.setItem('rmarket_last_name', formData.fullName)
  }

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Commande confirmée !</h1>
              <p className="text-white/80 text-sm">Merci pour votre commande</p>
            </div>

            {/* QR Code et Numéro */}
            <div className="p-6 text-center">
              <div className="bg-white rounded-2xl p-4 inline-block mb-4 border-2 border-green-100">
                <img 
                  src={qrCodeUrl}
                  alt="QR Code Commande"
                  className="w-56 h-56 mx-auto"
                />
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-green-600 text-sm mb-1">Numéro de commande</p>
                <p className="text-4xl font-bold text-green-700 font-mono tracking-wider">{orderNumber}</p>
              </div>

              <p className="text-gray-500 text-sm mb-6">
                📸 Faites une capture d'écran de ce QR code
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
                <Link 
                  to="/shop"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Continuer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Rien à commander</h1>
          <Link to="/shop" className="text-green-600 font-medium">Retour à la boutique</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-green-600 text-sm mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour au panier
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Finaliser la commande</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['Informations', 'Livraison', 'Paiement'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-green-600' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              {/* Quick Checkout - For returning customers */}
              {quickCheckout && step === 1 && savedClient && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Commande rapide</p>
                        <p className="text-sm text-gray-500">Bienvenue {savedClient.name} • {savedClient.total_orders} commandes</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleQuickCheckout}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Utiliser mes infos
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Informations personnelles
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet *</label>
                      <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="Votre nom et prénom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="+223 XX XX XX XX" />
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all">
                    Continuer
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Adresse de livraison
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Région *</label>
                      <select required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
                        <option value="">Sélectionnez votre région</option>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Commune *</label>
                      <input type="text" required value={formData.commune} onChange={e => setFormData({...formData, commune: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="Votre commune" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse complète *</label>
                      <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none" placeholder="Rue, quartier, bâtiment..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optionnel)</label>
                      <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none" placeholder="Instructions spéciales pour la livraison..." />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                      Retour
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all">
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Mode de paiement
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: 'orange', label: 'Orange Money', desc: 'Paiement via Orange Money Mali', color: '#FF6600', bg: 'bg-orange-50', border: 'border-orange-300' },
                      { id: 'moov', label: 'Moov Money', desc: 'Paiement via Moov Money Mali', color: '#0066CC', bg: 'bg-blue-50', border: 'border-blue-300' },
                      { id: 'wave', label: 'Wave', desc: 'Paiement via Wave Mali', color: '#1DC3E3', bg: 'bg-cyan-50', border: 'border-cyan-300' },
                      { id: 'cash', label: 'Cash à la livraison', desc: 'Paiement à la réception', color: '#22C55E', bg: 'bg-green-50', border: 'border-green-300' },
                      { id: 'bms', label: 'Virement BMS', desc: 'Banque Malienne de Solidarité', color: '#1E3A5F', bg: 'bg-slate-50', border: 'border-slate-300' },
                    ].map(p => (
                      <label key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.payment === p.id ? `${p.border} ${p.bg}` : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input type="radio" name="payment" value={p.id} checked={formData.payment === p.id} onChange={e => setFormData({...formData, payment: e.target.value})} className="sr-only" />
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.color }}>
                          <span className="text-white text-[8px] font-bold leading-tight text-center">{p.id === 'bms' ? 'BMS' : p.id === 'orange' ? 'OM' : p.id === 'moov' ? 'Moov' : p.id === 'wave' ? 'Wave' : '💵'}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{p.label}</p>
                          <p className="text-xs text-gray-500">{p.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ml-auto flex items-center justify-center ${
                          formData.payment === p.id ? 'border-green-600' : 'border-gray-300'
                        }`}>
                          {formData.payment === p.id && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                      Retour
                    </button>
                    <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all active:scale-[0.98]">
                      Confirmer la commande
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Votre commande</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Sous-total</span><span>{totalPrice.toLocaleString()} FCFA</span></div>
                <div className="flex justify-between text-gray-600"><span>Livraison</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Gratuite' : `${shipping.toLocaleString()} FCFA`}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total</span><span className="text-green-700">{grandTotal.toLocaleString()} FCFA</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
