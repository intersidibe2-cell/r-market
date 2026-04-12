import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function RussianLanding() {
  // Auto-redirect to Russian shop after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/russian'
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Russian Flag */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-b from-white via-blue-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <span className="text-5xl">🇷🇺</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Русский магазин
        </h1>
        <p className="text-xl text-gray-400 mb-1">Boutique Russe</p>
        <p className="text-gray-500 mb-8">Mali • Bamako</p>

        {/* Services */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <span className="text-2xl">🎁</span>
            <p className="text-sm text-gray-300 mt-2">Сувениры</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <span className="text-2xl">🍷</span>
            <p className="text-sm text-gray-300 mt-2">Алкоголь</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <span className="text-2xl">🛒</span>
            <p className="text-sm text-gray-300 mt-2">Продукты</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <span className="text-2xl">💱</span>
            <p className="text-sm text-gray-300 mt-2">Обмен валюты</p>
          </div>
        </div>

        {/* Redirect message */}
        <p className="text-gray-500 text-sm mb-4">
          Переход в магазин...
        </p>

        {/* Button */}
        <Link 
          to="/russian"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-red-700 transition-all shadow-lg shadow-blue-500/30"
        >
          🛒 Войти в магазин
        </Link>

        {/* Alternative links */}
        <div className="mt-8 space-y-2">
          <p className="text-xs text-gray-600">Другие сервисы:</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/bambara-course" className="text-green-400 hover:text-green-300">
              📚 Курсы бамбара
            </Link>
            <Link to="/qr-code" className="text-blue-400 hover:text-blue-300">
              📱 QR код
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 text-xs text-gray-600">
          <p>📞 +223 XX XX XX XX</p>
          <p>📍 Bamako, Mali 🇲🇱</p>
        </div>
      </div>
    </div>
  )
}
