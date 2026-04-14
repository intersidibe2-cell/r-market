import { useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useAdultAccess } from '../context/AdultAccessContext'

interface AgeGateProps {
  onVerified: () => void
  onCancel: () => void
}

export default function AgeGate({ onVerified, onCancel }: AgeGateProps) {
  const { verifyAge } = useAdultAccess()
  const [isChecked, setIsChecked] = useState(false)

  const handleConfirm = () => {
    if (isChecked) {
      // Verify with empty PIN (no PIN required for clients)
      verifyAge('')
      onVerified()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header with 18+ image */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="https://i.ibb.co/6yJ3qXz/18.png" 
              alt="18+" 
              className="w-28 h-28 object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = '<span class="text-5xl font-bold text-red-600">18+</span>'
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Contenu réservé aux adultes</h2>
          <p className="text-red-100 text-sm">Cette section est réservée aux personnes majeures</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Warning message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Avertissement important</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Au Mali, pays musulman, ces produits sont destinés à un usage marital légitime dans le cadre du mariage.
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center text-gray-600 text-sm">
            <p>L'accès à cette section nécessite la confirmation de votre majorité.</p>
            <p className="mt-1">Votre choix sera mémorisé pendant 24 heures.</p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border-2 border-transparent has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-6 h-6 rounded-md border-2 border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-900">
                Je certifie être majeur (18 ans ou plus)
              </span>
              <p className="text-xs text-gray-500 mt-1">
                En cochant cette case, vous confirmez avoir au moins 18 ans et acceptez d'accéder à du contenu pour adultes.
              </p>
            </div>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isChecked}
              className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isChecked
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isChecked ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Accéder à la section
                </>
              ) : (
                'Cocher la case'
              )}
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-400 text-center">
            Si vous êtes mineur, veuillez cliquer sur "Annuler".
          </p>
        </div>
      </div>
    </div>
  )
}
