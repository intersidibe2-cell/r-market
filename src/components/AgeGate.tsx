import { useState } from 'react'
import { Lock, AlertTriangle, X } from 'lucide-react'
import { useAdultAccess } from '../context/AdultAccessContext'

interface AgeGateProps {
  onVerified: () => void
  onCancel: () => void
}

export default function AgeGate({ onVerified, onCancel }: AgeGateProps) {
  const { verifyAge, defaultPin } = useAdultAccess()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [step, setStep] = useState<'warning' | 'pin'>('warning')

  const handleAgeConfirm = () => {
    setStep('pin')
  }

  const handlePinSubmit = () => {
    if (verifyAge(pin)) {
      onVerified()
    } else {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {step === 'warning' ? (
          <>
            {/* Warning Step */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔞</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Contenu réservé aux adultes</h2>
              <p className="text-white/90 text-sm">
                Cette section contient des produits pour adultes de 18 ans et plus.
              </p>
            </div>
            
            <div className="p-6 space-y-4">
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

              <p className="text-gray-600 text-sm text-center">
                En continuant, vous confirmez avoir 18 ans ou plus et utiliser ces produits de manière responsable.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAgeConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600"
                >
                  J'ai 18 ans ou plus
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* PIN Step */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Accès sécurisé</h2>
              <p className="text-white/90 text-sm">
                Entrez le code PIN pour accéder à cette section
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">
                  Code PIN par défaut: <span className="font-mono font-bold text-gray-900">1234</span>
                </p>
                
                <div className="flex justify-center gap-3 mb-4">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-colors ${
                        error 
                          ? 'border-red-500 bg-red-50' 
                          : pin.length > i 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {pin.length > i ? '•' : ''}
                    </div>
                  ))}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((key, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (key === 'del') {
                          setPin(prev => prev.slice(0, -1))
                        } else if (key !== '' && pin.length < 4) {
                          setPin(prev => prev + key)
                        }
                      }}
                      disabled={key === '' || (key !== 'del' && pin.length >= 4)}
                      className={`py-4 rounded-xl text-xl font-semibold transition-colors ${
                        key === 'del' 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : key === ''
                            ? 'bg-transparent'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {key === 'del' ? '⌫' : key}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                  <p className="text-red-600 text-sm">Code PIN incorrect. Veuillez réessayer.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('warning')}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  onClick={handlePinSubmit}
                  disabled={pin.length !== 4}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Valider
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
