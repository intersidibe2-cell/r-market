import { useState } from 'react'
import { Shield, AlertTriangle, Lock, X } from 'lucide-react'
import { useAdultAccess } from '../context/AdultAccessContext'

interface AgeVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onAccessGranted: () => void
}

export default function AgeVerificationModal({ isOpen, onClose, onAccessGranted }: AgeVerificationModalProps) {
  const [step, setStep] = useState<'confirm' | 'pin'>('confirm')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const { verifyAge } = useAdultAccess()

  const handleConfirmAge = () => {
    setStep('pin')
  }

  const handleVerifyPin = () => {
    if (verifyAge(pin)) {
      onAccessGranted()
      setStep('confirm')
      setPin('')
      setError('')
    } else {
      setError('Code incorrect. Veuillez réessayer.')
    }
  }

  const handleClose = () => {
    setStep('confirm')
    setPin('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden border border-gray-700">
        {/* Header with 18+ image */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 p-6 text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <img 
              src="https://i.ibb.co/6yJ3qXz/18.png" 
              alt="18+" 
              className="w-28 h-28 object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = '<span class="text-6xl font-bold text-red-600">18+</span>'
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-white">Accès Réservé</h2>
          <p className="text-red-200 text-sm mt-1">Contenu pour adultes</p>
        </div>

        <div className="p-6">
          {step === 'confirm' ? (
            <>
              {/* Age Confirmation */}
              <div className="text-center mb-6">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Vous avez 18 ans ou plus ?
                </h3>
                <p className="text-gray-400 text-sm">
                  L'accès à cette section est réservé aux personnes majeures.
                  En confirmant, vous certifiez avoir au moins 18 ans.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirmAge}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  OUI, j'ai 18 ans ou plus
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold transition-colors"
                >
                  NON, je suis mineur
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                L'accès expire automatiquement après 24 heures.
              </p>
            </>
          ) : (
            <>
              {/* PIN Verification */}
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Entrez le code d'accès
                </h3>
                <p className="text-gray-400 text-sm">
                  Code par défaut: 1234
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value)
                      setError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
                    placeholder="Entrez le code"
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-xl text-center text-2xl tracking-widest text-white focus:outline-none focus:border-blue-500"
                    maxLength={4}
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-400 text-sm text-center mt-2">{error}</p>
                  )}
                </div>

                <button
                  onClick={handleVerifyPin}
                  disabled={pin.length < 4}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-colors"
                >
                  Valider
                </button>

                <button
                  onClick={() => {
                    setStep('confirm')
                    setPin('')
                    setError('')
                  }}
                  className="w-full text-gray-400 hover:text-white py-2 text-sm"
                >
                  ← Retour
                </button>
              </div>
            </>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
