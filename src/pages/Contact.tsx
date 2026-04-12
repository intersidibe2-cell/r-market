import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Contactez-nous</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Une question ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                <p className="text-gray-500 text-sm">Alger, Algérie</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                <p className="text-gray-500 text-sm">+213 555 123 456</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-500 text-sm">contact@r-market.ml</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-2">Horaires d'ouverture</h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>9h - 18h</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span>9h - 14h</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche</span>
                <span>Fermé</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message envoyé !</h3>
                <p className="text-gray-500">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    placeholder="Sujet de votre message"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
                    placeholder="Écrivez votre message ici..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3.5 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
