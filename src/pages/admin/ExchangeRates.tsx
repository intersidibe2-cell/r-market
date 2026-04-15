import { useState, useEffect } from 'react'
import { ArrowRightLeft, Save, RefreshCw, DollarSign, History } from 'lucide-react'

interface RateHistory {
  rate: number
  date: string
}

export default function ExchangeRates() {
  const [usdRate, setUsdRate] = useState(600)
  const [newRate, setNewRate] = useState('')
  const [history, setHistory] = useState<RateHistory[]>([])
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    // Load current rate
    const savedRate = localStorage.getItem('rmarket_usd_rate')
    if (savedRate) {
      setUsdRate(parseFloat(savedRate))
      setNewRate(savedRate)
    }

    // Load history
    const savedHistory = localStorage.getItem('rmarket_rate_history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const handleSave = () => {
    const rate = parseFloat(newRate)
    if (!rate || rate <= 0) return

    // Save new rate
    localStorage.setItem('rmarket_usd_rate', rate.toString())
    setUsdRate(rate)

    // Add to history
    const newHistory: RateHistory[] = [
      { rate, date: new Date().toLocaleString('fr-FR') },
      ...history.slice(0, 9) // Keep last 10 entries
    ]
    localStorage.setItem('rmarket_rate_history', JSON.stringify(newHistory))
    setHistory(newHistory)

    // Show confirmation
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 3000)
  }

  const handleReset = () => {
    setNewRate('600')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6" />
          Taux de Change
        </h1>
        <p className="text-gray-500 text-sm">Gérer le taux USD/CFA pour la boutique russe</p>
      </div>

      {/* Current Rate Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm mb-1">Taux actuel</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">{usdRate.toLocaleString()}</span>
              <span className="text-2xl text-green-200">CFA</span>
            </div>
            <p className="text-green-200 mt-2">1 USD = {usdRate.toLocaleString()} CFA</p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Update Rate */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Modifier le taux</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau taux (1 USD = X CFA)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={newRate}
                onChange={e => setNewRate(e.target.value)}
                placeholder="600"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-lg"
              />
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                title="Réinitialiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!newRate || parseFloat(newRate) <= 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Enregistrer le nouveau taux
          </button>

          {showSaved && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-center">
              ✅ Taux enregistré avec succès !
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique des taux
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun historique</p>
        ) : (
          <div className="space-y-2">
            {history.map((entry, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {index === 0 && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  <span className="font-medium">
                    1 USD = {entry.rate.toLocaleString()} CFA
                  </span>
                </div>
                <span className="text-sm text-gray-500">{entry.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversion Calculator */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Calculateur de conversion</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">USD → CFA</p>
            <div className="space-y-2">
              {[1, 10, 50, 100].map(usd => (
                <div key={usd} className="flex justify-between">
                  <span>${usd}</span>
                  <span className="font-bold">{(usd * usdRate).toLocaleString()} F</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">CFA → USD</p>
            <div className="space-y-2">
              {[1000, 5000, 10000, 50000].map(cfa => (
                <div key={cfa} className="flex justify-between">
                  <span>{cfa.toLocaleString()} F</span>
                  <span className="font-bold">${(cfa / usdRate).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
