import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, CreditCard, Truck, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Truck className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium text-sm">Livraison rapide</h4>
                <p className="text-xs text-gray-400">Partout au Mali</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CreditCard className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium text-sm">Paiement sécurisé</h4>
                <p className="text-xs text-gray-400">Orange Money, Moov Money, Wave, Cash</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <ShieldCheck className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium text-sm">Garantie satisfa</h4>
                <p className="text-xs text-gray-400">Retour sous 14 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-lg font-bold text-white">R-Market</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Votre marketplace en ligne N°1 au Mali. Des milliers de produits à prix imbattables.
            </p>
            <div className="flex gap-2">
              {['f', 'in', 'X', 'yt'].map(s => (
                <a key={s} href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors text-xs font-bold text-gray-400 hover:text-white">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Catégories</h3>
            <ul className="space-y-2">
              {[
                { name: 'Mode', id: 'mode' },
                { name: 'Électronique', id: 'electronique' },
                { name: '18+ Ans', id: 'adulte' },
                { name: 'Artisanat Mali', id: 'malien' },
              ].map(c => (
                <li key={c.id}>
                  <Link to={`/shop?category=${c.id}`} className="text-sm text-gray-400 hover:text-green-400 transition-colors">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Informations</h3>
            <ul className="space-y-2">
              {['À propos', 'Livraison', 'Retours', 'CGV', 'Politique de confidentialité', 'FAQ'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">{item}</a>
                </li>
              ))}
              <li>
                <a href="https://r-chicken.com" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
                  🍗 R-Chicken Restaurant
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                Bamako, Mali
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                +223 XX XX XX XX
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                contact@r-market.ml
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; 2026 R-Market. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>CCP</span>
            <span>EDAHABIA</span>
            <span>Cash à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
