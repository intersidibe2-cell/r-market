import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Printer, ArrowRightLeft, Send, RefreshCw } from 'lucide-react'

export default function QRCodePage() {
  const printRef = useState(null)
  const [activeTab, setActiveTab] = useState('qr')
  const [exchangeFrom, setExchangeFrom] = useState('usd')
  const [exchangeAmount, setExchangeAmount] = useState('')
  const [transferDirection, setTransferDirection] = useState('bamako-moscow')
  const [transferAmount, setTransferAmount] = useState('')

  const siteUrl = window.location.origin || 'https://r-market.ml'
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(siteUrl + '/ru')}&bgcolor=ffffff&color=1a1a2e&margin=8`

  const usdRate = 620
  const cfaRate = 0.00161

  const convertedAmount = exchangeAmount ? (
    exchangeFrom === 'usd'
      ? (parseFloat(exchangeAmount) * usdRate).toLocaleString()
      : (parseFloat(exchangeAmount) * cfaRate).toFixed(2)
  ) : '0'

  const handlePrint = () => {
    const content = document.getElementById('qr-print-area')
    if (!content) return
    const win = window.open('', '', 'width=800,height=1000')
    if (!win) return
    win.document.write(`
      <html><head><title>R-Market QR</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#111}
        .poster{width:600px;background:linear-gradient(135deg,#1a1a2e,#2d2d3f,#1a1a2e);overflow:hidden;position:relative;color:#fff}
        .top-bar{height:8px;background:linear-gradient(90deg,#14B53A 33%,#FCD116 33%,#FCD116 66%,#CE1126 66%)}
        .content{padding:40px 35px 30px;text-align:center}
        h1{font-size:38px;font-weight:900;color:#fff;letter-spacing:1px;margin-bottom:2px}
        h2{font-size:18px;color:#999;font-weight:400;margin-bottom:6px;font-style:italic}
        .delivery{display:inline-block;background:linear-gradient(90deg,#0039A6,#D52B1E);color:#fff;padding:6px 20px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:0.5px;margin-bottom:20px;box-shadow:0 4px 15px rgba(0,57,166,0.4)}
        .qr-wrap{display:inline-block;padding:12px;background:linear-gradient(135deg,#14B53A,#FCD116,#CE1126);border-radius:16px;margin:5px 0 18px;box-shadow:0 8px 30px rgba(252,209,22,0.2)}
        .qr-inner{background:#fff;padding:10px;border-radius:12px}
        .qr-inner img{width:260px;height:260px;display:block;border-radius:6px}
        .scan-text{font-size:16px;font-weight:800;color:#fff;margin:10px 0 3px}
        .scan-sub{font-size:11px;color:#666;margin-bottom:14px}
        .items{font-size:12px;color:#999;line-height:2;margin-bottom:14px}
        .anon-box{background:rgba(255,255,255,0.05);border:1px solid rgba(20,181,58,0.3);border-radius:10px;padding:10px 14px;margin:0 0 16px}
        .anon-box p{font-size:11px;color:#4ade80;line-height:1.6}
        .anon-box strong{color:#86efac}
        .divider{height:1px;background:linear-gradient(90deg,transparent,#444,transparent);margin:12px 0}
        .contact{font-size:11px;color:#666;line-height:1.8}
        .contact strong{color:#888}
        .bottom-bar{height:6px;background:linear-gradient(90deg,#fff 33%,#0039A6 33%,#0039A6 66%,#D52B1E 66%)}
        @media print{body{background:#fff}.poster{background:#fff;color:#000}h1{color:#000}h2{color:#666}.scan-text{color:#000}.items{color:#555}.anon-box{background:#f0fdf4;border-color:#86efac}.anon-box p{color:#166534}.anon-box strong{color:#14532d}.contact{color:#888}.contact strong{color:#555}.scan-sub{color:#888}}
      </style></head>
      <body><div class="poster">${content.innerHTML}<script>window.print()</script></div></body></html>
    `)
    win.document.close()
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <div className="bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">R-Market</span>
        </Link>
        <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-900/50">
          <Printer className="w-4 h-4" />
          Imprimer
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'qr' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => setActiveTab('exchange')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'exchange' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Échange
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'transfer' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            Envoi
          </button>
        </div>

        {/* QR Code Tab */}
        {activeTab === 'qr' && (
          <div id="qr-print-area" className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d3f, #1a1a2e)' }}>
            <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" />
            <div className="px-8 py-8 text-center">
              <div className="flex justify-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #14B53A, #FCD116, #CE1126)', boxShadow: '0 4px 20px rgba(20,181,58,0.3)' }}>
                  <span className="text-3xl">🇲🇱</span>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border" style={{ background: 'linear-gradient(135deg, #fff 33%, #0039A6 33%, #0039A6 66%, #D52B1E 66%)', borderColor: '#444', boxShadow: '0 4px 20px rgba(0,57,166,0.3)' }}>
                  <span className="text-3xl">🇷🇺</span>
                </div>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                R-<span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">Market</span>
              </h1>
              <h2 className="text-lg text-gray-400 mt-1 font-light italic">Магазин сувениров в Мали</h2>
              <div className="mt-4 inline-flex items-center gap-2 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg" style={{ background: 'linear-gradient(90deg, #0039A6, #D52B1E)', boxShadow: '0 4px 15px rgba(0,57,166,0.4)' }}>
                <span>🚚</span>
                Доставка по всему Мали
              </div>
              <div className="mt-6 inline-block p-1.5 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, #14B53A, #FCD116, #CE1126)', boxShadow: '0 8px 30px rgba(252,209,22,0.2)' }}>
                <div className="bg-white p-3 rounded-xl">
                  <img src={qrUrl} alt="QR Code" className="w-52 h-52 rounded-lg" />
                </div>
              </div>
              <p className="text-lg font-extrabold text-white mt-5">📱 Отсканируйте для заказа</p>
              <p className="text-xs text-gray-500 mt-0.5">Сканируйте телефоном для доступа к магазину</p>
              <div className="text-sm text-gray-400 mt-4 leading-relaxed">
                🎁 Сувениры • 🍺 Алкоголь • 🥜 Еда & Специи • 🇲🇱 Товары Мали
              </div>
              <div className="rounded-xl p-3 mt-5 border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(20,181,58,0.3)' }}>
                <p className="text-xs" style={{ color: '#4ade80' }}><strong style={{ color: '#86efac' }}>🔒 Анонимный заказ</strong> — Без имени, только номер телефона</p>
                <p className="text-xs mt-1" style={{ color: '#22c55e' }}>Оплата: <strong style={{ color: '#4ade80' }}>наличными при доставке</strong></p>
              </div>
              <div className="h-px my-4" style={{ background: 'linear-gradient(90deg, transparent, #444, transparent)' }} />
              <div className="text-xs leading-relaxed" style={{ color: '#666' }}>
                <p><strong style={{ color: '#888' }}>📞</strong> +223 XX XX XX XX • <strong style={{ color: '#888' }}>📍</strong> Bamako, Mali</p>
                <p className="mt-1" style={{ color: '#555' }}>www.r-market.ml/ru</p>
              </div>
            </div>
            <div className="h-1.5 bg-gradient-to-r from-white via-blue-600 to-red-600" />
          </div>
        )}

        {/* Exchange Tab */}
        {activeTab === 'exchange' && (
          <div className="rounded-2xl overflow-hidden shadow-2xl p-6" style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d3f, #1a1a2e)' }}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <ArrowRightLeft className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Обмен валют / Échange</h2>
              <p className="text-sm text-gray-400 mt-1">USD ↔ FCFA</p>
            </div>

            {/* Direction Toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setExchangeFrom('usd')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  exchangeFrom === 'usd' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                $ USD → FCFA
              </button>
              <button
                onClick={() => setExchangeFrom('cfa')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  exchangeFrom === 'cfa' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                FCFA → $ USD
              </button>
            </div>

            {/* Rate Info */}
            <div className="bg-gray-800/50 rounded-xl p-3 mb-6 text-center">
              <p className="text-xs text-gray-400">Taux du jour</p>
              <p className="text-lg font-bold text-green-400">1 USD = {usdRate} FCFA</p>
            </div>

            {/* Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {exchangeFrom === 'usd' ? 'Montant en USD ($)' : 'Montant en FCFA'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={exchangeAmount}
                    onChange={e => setExchangeAmount(e.target.value)}
                    placeholder={exchangeFrom === 'usd' ? '100' : '50000'}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-lg font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    {exchangeFrom === 'usd' ? '$' : 'FCFA'}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <RefreshCw className="w-6 h-6 text-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vous recevez
                </label>
                <div className="px-4 py-3 bg-green-900/30 border border-green-800 rounded-xl">
                  <p className="text-lg font-bold text-green-400">
                    {convertedAmount} {exchangeFrom === 'usd' ? 'FCFA' : '$'}
                  </p>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 transition-all active:scale-[0.98]">
                {exchangeFrom === 'usd' ? 'Échanger USD → FCFA' : 'Échanger FCFA → USD'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Contactez-nous sur WhatsApp pour finaliser l'échange
            </p>
          </div>
        )}

        {/* Transfer Tab */}
        {activeTab === 'transfer' && (
          <div className="rounded-2xl overflow-hidden shadow-2xl p-6" style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d3f, #1a1a2e)' }}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Send className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Envoi d'argent / Перевод</h2>
              <p className="text-sm text-gray-400 mt-1">Bamako ↔ Moscou</p>
            </div>

            {/* Direction */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setTransferDirection('bamako-moscow')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  transferDirection === 'bamako-moscow' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                🇲🇱 → 🇷🇺
              </button>
              <button
                onClick={() => setTransferDirection('moscow-bamako')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  transferDirection === 'moscow-bamako' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                🇷🇺 → 🇲🇱
              </button>
            </div>

            {/* Info */}
            <div className="bg-gray-800/50 rounded-xl p-3 mb-6 text-center">
              <p className="text-xs text-gray-400">
                {transferDirection === 'bamako-moscow'
                  ? 'Envoi depuis Bamako vers Moscou'
                  : 'Envoi depuis Moscou vers Bamako'}
              </p>
              <p className="text-sm font-bold text-blue-400">
                {transferDirection === 'bamako-moscow'
                  ? 'FCFA → RUB / USD'
                  : 'RUB / USD → FCFA'}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Montant à envoyer
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    placeholder={transferDirection === 'bamako-moscow' ? '100000' : '500'}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    {transferDirection === 'bamako-moscow' ? 'FCFA' : '$'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro du destinataire
                </label>
                <input
                  type="tel"
                  placeholder={transferDirection === 'bamako-moscow' ? '+7 XXX XXX-XX-XX' : '+223 XX XX XX XX'}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-3">
                <p className="text-xs text-blue-300">
                  💳 Méthodes disponibles:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Orange Money</span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Moov Money</span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Wave</span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Sberbank</span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Crypto</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3.5 rounded-xl font-bold text-base hover:from-blue-700 hover:to-blue-900 transition-all active:scale-[0.98]">
                {transferDirection === 'bamako-moscow' ? 'Envoyer vers Moscou 🇷🇺' : 'Envoyer vers Bamako 🇲🇱'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Service disponible 24/7 • Contactez-nous sur WhatsApp
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
