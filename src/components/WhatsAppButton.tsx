import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber?: string
  defaultMessage?: string
}

const quickMessages = [
  { id: 1, label: 'Question sur un produit', message: 'Bonjour, j\'ai une question sur un produit.' },
  { id: 2, label: 'Suivi de commande', message: 'Bonjour, je souhaite suivre ma commande.' },
  { id: 3, label: 'Retour/Échange', message: 'Bonjour, je souhaite effectuer un retour.' },
  { id: 4, label: 'Livraison', message: 'Bonjour, j\'ai une question sur la livraison.' },
  { id: 5, label: 'Autre', message: 'Bonjour, j\'ai besoin d\'aide.' }
]

export default function WhatsAppButton({ 
  phoneNumber = '22370000000', // Numéro par défaut
  defaultMessage = 'Bonjour! Je vous contacte depuis le site R-Market.'
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState('')
  const [selectedQuick, setSelectedQuick] = useState<number | null>(null)

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
    setIsOpen(false)
    setCustomMessage('')
    setSelectedQuick(null)
  }

  const handleQuickMessage = (quick: typeof quickMessages[0]) => {
    setSelectedQuick(quick.id)
    setCustomMessage(quick.message)
  }

  const handleSend = () => {
    if (customMessage.trim()) {
      openWhatsApp(customMessage)
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-green-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">R-Market Support</h3>
                <p className="text-green-100 text-xs">Répond généralement en quelques minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages rapides */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Choisissez un sujet :</p>
            <div className="flex flex-wrap gap-2">
              {quickMessages.map(quick => (
                <button
                  key={quick.id}
                  onClick={() => handleQuickMessage(quick)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    selectedQuick === quick.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {quick.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message personnalisé */}
          <div className="p-4">
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Votre message..."
              className="w-full h-24 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSend}
              disabled={!customMessage.trim()}
              className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Envoyer sur WhatsApp
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs text-gray-500">
              Powered by WhatsApp Business
            </p>
          </div>
        </div>
      )}
    </>
  )
}
