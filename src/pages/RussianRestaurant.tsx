import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Phone, MapPin, Clock, Star, ArrowLeft, ShoppingCart } from 'lucide-react'
import SEO from '../components/SEO'

interface MenuItem {
  id: number
  name: string
  nameRu: string
  description: string
  descriptionRu: string
  price: number
  image: string
  category: string
}

const menuItems: MenuItem[] = [
  { id: 1, name: 'Bœuf braisé', nameRu: 'Тушеная говядина', description: 'Bœuf mijoté avec légumes', descriptionRu: 'Тушеная говядина с овощами', price: 8000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', category: 'plats' },
  { id: 2, name: 'Poulet rôti', nameRu: 'Жареная курица', description: 'Poulet grillé aux épices', descriptionRu: 'Жареная курица со специями', price: 7000, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop', category: 'plats' },
  { id: 3, name: 'Thieboudienne', nameRu: 'Рис с рыбой', description: 'Riz au poisson sénégalais', descriptionRu: 'Сенегальский рис с рыбой', price: 6000, image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop', category: 'plats' },
  { id: 4, name: 'Kedjenou', nameRu: 'Кеджену', description: 'Poulet mijoté à la vapeur', descriptionRu: 'Курица на пару', price: 6500, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop', category: 'plats' },
  { id: 5, name: 'Salade composée', nameRu: 'Салат', description: 'Salade verte avec légumes', descriptionRu: 'Салат с овощами', price: 3500, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', category: 'entrees' },
  { id: 6, name: 'Soupe malienne', nameRu: 'Малийский суп', description: 'Soupe traditionnelle', descriptionRu: 'Традиционный суп', price: 4000, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', category: 'entrees' },
  { id: 7, name: 'Jus de bissap', nameRu: 'Сок бисап', description: 'Boisson au thym hibiscus', descriptionRu: 'Напиток из гибискуса', price: 1500, image: 'https://images.unsplash.com/photo-1553531889-e6cf4d692b1e?w=400&h=300&fit=crop', category: 'boissons' },
  { id: 8, name: 'Bouillon本地', nameRu: 'Бульон', description: 'Bouillon de viande', descriptionRu: 'Мясной бульон', price: 3000, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', category: 'boissons' },
]

const categories = [
  { id: 'all', name: 'Tout', nameRu: 'Все' },
  { id: 'entrees', name: 'Entrées', nameRu: 'Закуски' },
  { id: 'plats', name: 'Plats', nameRu: 'Основные блюда' },
  { id: 'boissons', name: 'Boissons', nameRu: 'Напитки' },
]

export default function RussianRestaurant() {
  const [lang, setLang] = useState<'fr' | 'ru'>('ru')
  const [cart, setCart] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item])
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const orderOnWhatsApp = () => {
    const message = `🍽️ Commande Restaurant R-Market\n\n${cart.map(item => `- ${lang === 'ru' ? item.nameRu : item.name}: ${item.price} CFA`).join('\n')}\n\nTotal: ${total} CFA`
    window.open(`https://wa.me/22383806129?text=${encodeURIComponent(message)}`, '_blank')
  }

  const t = (fr: string, ru: string) => lang === 'ru' ? ru : fr

  return (
    <>
      <SEO title={t('Restaurant Mali - Commandez', 'Ресторан Мали - Заказать')} description={t('Commandez des plats traditionnels maliens - Livraison à Bamako', 'Заказывайте традиционные малийские блюда - Доставка по Бамако')} />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link to="/russian" className="flex items-center gap-2 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold">{t('🍽️ Restaurant', '🍽️ Ресторан')}</h1>
              <p className="text-sm text-white/80">Bamako</p>
            </div>
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="max-w-4xl mx-auto p-4 flex justify-center">
          <div className="bg-white rounded-full p-1 flex shadow">
            <button onClick={() => setLang('ru')} className={`px-4 py-1 rounded-full ${lang === 'ru' ? 'bg-blue-600 text-white' : ''}`}>RU</button>
            <button onClick={() => setLang('fr')} className={`px-4 py-1 rounded-full ${lang === 'fr' ? 'bg-blue-600 text-white' : ''}`}>FR</button>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto px-4 pb-4 overflow-x-auto flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'}`}
            >
              {cat.id === 'all' ? (lang === 'ru' ? 'Все' : 'Tout') : (lang === 'ru' ? cat.nameRu : cat.name)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="max-w-4xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md">
                <img src={item.image} alt={item.nameRu} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{lang === 'ru' ? item.nameRu : item.name}</h3>
                  <p className="text-sm text-gray-500">{lang === 'ru' ? item.descriptionRu : item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-orange-600">{item.price.toLocaleString()} CFA</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm"
                    >
                      {t('Ajouter', 'Добавить')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Floating Button */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">{cart.length} {t('articles', 'товаров')}</p>
                <p className="text-orange-600 font-bold">{total.toLocaleString()} CFA</p>
              </div>
              <button
                onClick={orderOnWhatsApp}
                className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold"
              >
                {t('Commander sur WhatsApp', 'Заказать в WhatsApp')}
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">{t('Informations', 'Информация')}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {t('Ouvert: 8h - 22h', 'Открыто: 8ч - 22ч')}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t('Livraison à Bamako', 'Доставка по Бамако')}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +223 83 80 61 29</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}