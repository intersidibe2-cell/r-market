import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Votre panier est vide</h1>
          <p className="text-gray-500 mb-8">Découvrez nos produits et trouvez ce qu'il vous faut</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all">
            Commencer vos achats
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  const shipping = totalPrice >= 5000 ? 0 : 400
  const grandTotal = totalPrice + shipping

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Panier <span className="text-gray-400 font-normal text-lg">({items.length} article{items.length > 1 ? 's' : ''})</span></h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">Vider le panier</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4">
                <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-green-600 font-bold mt-1">{item.price.toLocaleString()} FCFA</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé</h2>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Code promo" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" />
                  </div>
                  <button className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">OK</button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Sous-total</span>
                  <span>{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Gratuite' : `${shipping.toLocaleString()} FCFA`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                    Plus que {(5000 - totalPrice).toLocaleString()} FCFA pour la livraison gratuite !
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-700">{grandTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
              <Link to="/checkout" className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold text-center hover:from-green-700 hover:to-green-800 transition-all active:scale-[0.98]">
                Passer la commande
              </Link>
              <Link to="/shop" className="block w-full text-center text-green-600 text-sm font-medium mt-3 hover:text-green-700">
                ← Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
