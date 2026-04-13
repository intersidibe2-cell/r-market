import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Download, Printer, Copy, Check, ArrowLeft, Phone, MessageCircle } from 'lucide-react'

export default function MilitaryQRCode() {
  const [copied, setCopied] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)
  
  const siteUrl = 'https://r-market.shop'
  const russianShopUrl = `${siteUrl}/russian`
  const loginUrl = `${siteUrl}/login`
  const adminUrl = `${siteUrl}/admin-panel`
  
  // QR Code with colors
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(russianShopUrl)}&bgcolor=ffffff&color=1a1a2e&margin=4`

  const copyLink = () => {
    navigator.clipboard.writeText(russianShopUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const downloadPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-white/80">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-yellow-600 transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-red-700 transition-all"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Printable Area */}
      <div id="print-area" ref={printRef} className="max-w-2xl mx-auto px-4 py-8">
        {/* Flags and Branding */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">ML</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white via-blue-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">RU</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-green-500">R</span>
            <span className="text-white">-</span>
            <span className="text-yellow-500">M</span>
            <span className="text-white">arket</span>
          </h1>
          
          <p className="text-white/80 text-lg italic">
            Магазин для Русских в Мали
          </p>
          <p className="text-white/60 text-sm mt-1">
            Boutique de souvenirs au Mali
          </p>
        </div>

        {/* Delivery Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-2xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="text-white font-bold text-lg">Доставка по всему Мали</span>
          </div>
          <p className="text-white/80 text-sm mt-1">Livraison dans tout le Mali</p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-2xl">
          <div className="text-center">
            {/* QR Code with colorful border */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 rounded-2xl blur-sm"></div>
              <div className="relative bg-white p-4 rounded-2xl">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code R-Market" 
                  className="w-56 h-56 mx-auto"
                />
              </div>
            </div>
            
            <p className="text-gray-900 font-bold text-xl mb-2">
              r-market.shop/russian
            </p>
          </div>
        </div>

        {/* Scan Instructions */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">📱</span>
            <h2 className="text-white font-bold text-2xl">Отсканируйте для заказа</h2>
          </div>
          <p className="text-white/70">
            Сканируйте телефоном для доступа к магазину
          </p>
          <p className="text-white/50 text-sm mt-1">
            Scannez avec votre téléphone pour accéder au magasin
          </p>
        </div>

        {/* Categories */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-white">
            <span className="flex items-center gap-1">
              <span>🎁</span> Сувениры
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1">
              <span>🍷</span> Алкоголь
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1">
              <span>🍫</span> Еда & Специи
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1">
              <span>🇲🇱</span> Товары Мали
            </span>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-green-600/20 to-yellow-500/20 rounded-2xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-4">📞 Contact</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+223XXXXXXXX" className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
              <Phone className="w-4 h-4" />
              +223 XX XX XX XX
            </a>
            <a href="https://wa.me/223XXXXXXXX" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/40 text-sm">
          <p>© 2026 R-Market Mali - Tous droits réservés</p>
          <p className="mt-1">www.r-market.shop</p>
        </div>
      </div>

      {/* Copy Link Button (not printed) */}
      <div className="max-w-2xl mx-auto px-4 pb-8 no-print">
        <button
          onClick={copyLink}
          className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
        >
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Lien copié !' : 'Copier le lien de la boutique'}
        </button>
      </div>
    </div>
  )
}
