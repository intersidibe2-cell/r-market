import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QrCode, Download, Share2, Copy, Check, ArrowLeft } from 'lucide-react'

export default function MilitaryQRCode() {
  const [copied, setCopied] = useState(false)
  
  const siteUrl = 'https://r-market.shop'
  const russianShopUrl = `${siteUrl}/russian`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(russianShopUrl)}&bgcolor=ffffff&color=1a1a2e&margin=8`

  const copyLink = () => {
    navigator.clipboard.writeText(russianShopUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = 'r-market-russian-shop-qr.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-white/80">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇷🇺</span>
            <span className="text-2xl">🇲🇱</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🇷🇺</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Boutique Russe</h1>
            <span className="text-5xl">🇲🇱</span>
          </div>
          <p className="text-white/80 text-lg">
            Scannez le QR code pour accéder à la boutique russe
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md mx-auto">
          <div className="text-center">
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <img 
                src={qrCodeUrl} 
                alt="QR Code Boutique Russe" 
                className="w-64 h-64 mx-auto"
              />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              r-market.shop/russian
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Accès direct à la boutique pour militaires
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-red-700 transition-all"
              >
                <Download className="w-5 h-5" />
                Télécharger le QR Code
              </button>
              
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Lien copié !' : 'Copier le lien'}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">📱 Comment utiliser</h3>
          <div className="space-y-3 text-white/90">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</span>
              <p>Ouvrez l'appareil photo de votre téléphone</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</span>
              <p>Pointez vers le QR code ci-dessus</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</span>
              <p>Cliquez sur le lien qui apparaît pour accéder à la boutique</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎁', label: 'Souvenirs' },
            { icon: '🍷', label: 'Alcool' },
            { icon: '🍫', label: 'Chocolat' },
            { icon: '💊', label: 'Pharmacie' },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <span className="text-3xl">{item.icon}</span>
              <p className="text-white text-sm mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
