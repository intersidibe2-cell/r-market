import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, UtensilsCrossed } from 'lucide-react'

export default function RussianLanding() {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/russian'
    }
  }, [countdown])

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
          Магазин Мали
        </h1>
        <p className="text-xl text-gray-400 mb-1">Boutique Mali</p>
        <p className="text-gray-500 mb-8">Bamako</p>

        {/* Services */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link to="/russian/shop" className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors">
            <span className="text-2xl">🎁</span>
            <p className="text-sm text-gray-300 mt-2">Сувениры</p>
            <p className="text-xs text-gray-500">Souvenirs</p>
          </Link>
          <Link to="/russian/shop?category=alcohol" className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors">
            <span className="text-2xl">🍷</span>
            <p className="text-sm text-gray-300 mt-2">Алкоголь</p>
            <p className="text-xs text-gray-500">Alcool</p>
          </Link>
          <Link to="/russian/shop?category=food" className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors">
            <span className="text-2xl">🛒</span>
            <p className="text-sm text-gray-300 mt-2">Продукты</p>
            <p className="text-xs text-gray-500">Alimentation</p>
          </Link>
          <Link to="/russian/shop?category=exchange" className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors">
            <span className="text-2xl">💱</span>
            <p className="text-sm text-gray-300 mt-2">Обмен валюты</p>
            <p className="text-xs text-gray-500">Change</p>
          </Link>
          
          {/* Restaurant - NOUVEAU */}
          <Link to="/russian/restaurant" className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-orange-500 transition-colors">
            <UtensilsCrossed className="w-8 h-8 mx-auto text-orange-400" />
            <p className="text-sm text-gray-300 mt-2">Ресторан</p>
            <p className="text-xs text-gray-500">Restaurant</p>
          </Link>
          
          {/* Taxi Heetch - NOUVEAU */}
          <a 
            href="https://heetch.com/ml" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-yellow-500 transition-colors"
          >
            <Car className="w-8 h-8 mx-auto text-yellow-400" />
            <p className="text-sm text-gray-300 mt-2">Такси</p>
            <p className="text-xs text-gray-500">Taxi Heetch</p>
          </a>
        </div>

        {/* Redirect message */}
        {countdown > 0 && (
          <p className="text-gray-500 text-sm mb-4">
            Переход в магазин... {countdown}
          </p>
        )}

        {/* Button */}
        <Link 
          to="/russian/shop"
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