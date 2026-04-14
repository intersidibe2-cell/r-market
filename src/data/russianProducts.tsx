export interface RussianProduct {
  id: number
  name: string
  nameRu: string
  price: number
  originalPrice: number
  image: string
  category: string
  description: string
  descriptionRu: string
  badge?: string
  rating: number
  reviews: number
  stock: number
  sold: number
}

export const russianCategories = [
  { id: "all", name: "Все товары", nameFr: "Tous", emoji: "🏪" },
  { id: "souvenirs", name: "Сувениры", nameFr: "Souvenirs", emoji: "🎁" },
  { id: "alcohol", name: "Алкоголь", nameFr: "Alcool", emoji: "🍷" },
  { id: "food", name: "Продукты", nameFr: "Alimentation", emoji: "🛒" },
  { id: "adult", name: "Товары для взрослых", nameFr: "Articles adultes", emoji: "🔞" },
  { id: "exchange", name: "Обмен валюты", nameFr: "Échange de devises", emoji: "💱" },
]

export const russianProducts: RussianProduct[] = [
  // Souvenirs du Mali
  { id: 1001, name: "Masque Dogon sculpté", nameRu: "Догонская маска ручной работы", price: 25000, originalPrice: 35000, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop", category: "souvenirs", description: "Masque traditionnel Dogon sculpté à la main au Mali", descriptionRu: "Догонская маска ручной работы. Традиционное малийское искусство.", badge: "Best-seller", rating: 4.9, reviews: 156, stock: 30, sold: 89 },
  { id: 1002, name: "Collier perles Bambara", nameRu: "Бусы бамбара", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop", category: "souvenirs", description: "Collier en perles traditionnelles Bambara", descriptionRu: "Ожерелье из традиционных бус бамбара. Ручная работа.", rating: 4.7, reviews: 89, stock: 50, sold: 45 },
  { id: 1003, name: "Drapo Mali (tissu)", nameRu: "Малийский тканый ковер", price: 35000, originalPrice: 50000, image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=500&h=500&fit=crop", category: "souvenirs", description: "Tissu traditionnel malien tissé à la main", descriptionRu: "Традиционная малийская ткань ручной ткачки.", rating: 4.8, reviews: 67, stock: 25, sold: 34 },
  { id: 1004, name: "Statuette Mali bronze", nameRu: "Бронзовая статуэтка Мали", price: 45000, originalPrice: 65000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop", category: "souvenirs", description: "Statuette en bronze traditionnelle malienne", descriptionRu: "Бронзовая статуэтка ручной работы из Мали.", badge: "Premium", rating: 4.9, reviews: 123, stock: 15, sold: 78 },
  { id: 1005, name: "Tambour Tam tam", nameRu: "Там-там", price: 28000, originalPrice: 40000, image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500&h=500&fit=crop", category: "souvenirs", description: "Tambour traditionnel africain Tam tam", descriptionRu: "Традиционный африканский барабан там-там.", rating: 4.6, reviews: 78, stock: 20, sold: 56 },
  { id: 1006, name: "Chapeau Bogolan", nameRu: "Шляпа боголан", price: 12000, originalPrice: 18000, image: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=500&h=500&fit=crop", category: "souvenirs", description: "Chapeau traditionnel en tissu Bogolan", descriptionRu: "Традиционная шляпа из ткани боголан.", rating: 4.5, reviews: 45, stock: 40, sold: 34 },

  // Alcool
  { id: 2001, name: "Vin importé rouge sec", nameRu: "Импортное красное сухое вино", price: 12000, originalPrice: 15000, image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=500&h=500&fit=crop", category: "alcohol", description: "Vin rouge sec importé de qualité", descriptionRu: "Качественное импортное красное сухое вино.", rating: 4.5, reviews: 234, stock: 100, sold: 567 },
  { id: 2002, name: "Vodka Absolut 700ml", nameRu: "Водка Absolut 700мл", price: 18000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&h=500&fit=crop", category: "alcohol", description: "Vodka Absolut 700ml - Importé", descriptionRu: "Водка Absolut 700мл. Импортная.", badge: "Best-seller", rating: 4.8, reviews: 456, stock: 80, sold: 890 },
  { id: 2003, name: "Bière locale Skol 24 pack", nameRu: "Пиво местное Skol 24 шт", price: 8000, originalPrice: 10000, image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=500&h=500&fit=crop", category: "alcohol", description: "Pack de 24 bières locales Skol", descriptionRu: "Пакет из 24 бутылок местного пива Skol.", rating: 4.3, reviews: 178, stock: 200, sold: 1234 },
  { id: 2004, name: "Whisky Jack Daniel's 750ml", nameRu: "Виски Jack Daniel's 750мл", price: 35000, originalPrice: 45000, image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=500&h=500&fit=crop", category: "alcohol", description: "Whisky Jack Daniel's Tennessee", descriptionRu: "Виски Jack Daniel's Tennessee. Импортный.", rating: 4.7, reviews: 234, stock: 40, sold: 189 },
  { id: 2005, name: "Bières locales 12 pack varié", nameRu: "Ассорти местного пива 12 шт", price: 4500, originalPrice: 6000, image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&h=500&fit=crop", category: "alcohol", description: "Assortiment de 12 bières locales (Skol, Flag, etc.)", descriptionRu: "Ассорти из 12 бутылок местного пива (Skol, Flag и др.).", rating: 4.2, reviews: 145, stock: 150, sold: 678 },
  { id: 2006, name: "Cognac Hennessy VS 700ml", nameRu: "Коньяк Hennessy VS 700мл", price: 45000, originalPrice: 55000, image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&h=500&fit=crop", category: "alcohol", description: "Cognac Hennessy VS 700ml", descriptionRu: "Коньяк Hennessy VS 700мл. Премиум качество.", badge: "Premium", rating: 4.9, reviews: 89, stock: 25, sold: 67 },

  // Alimentation
  { id: 3001, name: "Pack biscuits et snacks", nameRu: "Набор печенья и снеков", price: 5000, originalPrice: 7000, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop", category: "food", description: "Assortiment de biscuits et snacks", descriptionRu: "Ассорти печенья и снеков. Импортные.", rating: 4.3, reviews: 123, stock: 200, sold: 456 },
  { id: 3002, name: "Saucisson et charcuterie", nameRu: "Салями и колбасные изделия", price: 8000, originalPrice: 12000, image: "https://images.unsplash.com/photo-1576504867335-e4a78e49e65d?w=500&h=500&fit=crop", category: "food", description: "Saucisson et charcuterie importée", descriptionRu: "Импортная салями и колбасные изделия.", badge: "Fresh", rating: 4.5, reviews: 89, stock: 50, sold: 123 },
  { id: 3003, name: "Fromage importé", nameRu: "Импортный сыр", price: 12000, originalPrice: 15000, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=500&fit=crop", category: "food", description: "Fromage importé de France", descriptionRu: "Импортный французский сыр.", rating: 4.6, reviews: 67, stock: 40, sold: 89 },
  { id: 3004, name: "Conserve russe (shproti)", nameRu: "Шпроты в масле", price: 3000, originalPrice: 4500, image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500&h=500&fit=crop", category: "food", description: "Sproti russe en conserve", descriptionRu: "Шпроты в масле. Русская классика.", rating: 4.8, reviews: 156, stock: 300, sold: 678 },
  { id: 3005, name: "Conserves variées", nameRu: "Консервы ассорти", price: 4000, originalPrice: 5500, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=500&fit=crop", category: "food", description: "Assortiment de conserves", descriptionRu: "Ассорти консервов.", rating: 4.4, reviews: 234, stock: 250, sold: 890 },
  { id: 3006, name: "Pack sodas importés", nameRu: "Импортные напитки", price: 3500, originalPrice: 4500, image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=500&h=500&fit=crop", category: "food", description: "Pack sodas importés (Coca, Fanta, Sprite)", descriptionRu: "Набор импортных напитков (Coca, Fanta, Sprite).", rating: 4.2, reviews: 145, stock: 150, sold: 567 },

  // Articles adultes (pour Russes)
  { id: 4001, name: "Parfum oriental luxe", nameRu: "Восточный парфюм люкс", price: 45000, originalPrice: 65000, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop", category: "adult", description: "Parfum oriental de luxe pour homme", descriptionRu: "Роскошный восточный парфюм для мужчин.", badge: "Premium", rating: 4.8, reviews: 67, stock: 20, sold: 45 },
  { id: 4002, name: "Lingerie fine", nameRu: "Изящное белье", price: 25000, originalPrice: 35000, image: "https://images.unsplash.com/photo-1617391943748-ccf6c6a7a3d7?w=500&h=500&fit=crop", category: "adult", description: "Lingerie fine et élégante", descriptionRu: "Изящное и элегантное белье.", rating: 4.6, reviews: 89, stock: 30, sold: 56 },
  { id: 4003, name: "Set cadeau romantique", nameRu: "Романтический подарочный набор", price: 35000, originalPrice: 50000, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", category: "adult", description: "Set cadeau romantique avec parfum et accessoires", descriptionRu: "Романтический подарочный набор с парфюмом и аксессуарами.", rating: 4.7, reviews: 45, stock: 15, sold: 23 },
  { id: 4004, name: "Huile de massage", nameRu: "Массажное масло", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=500&h=500&fit=crop", category: "adult", description: "Huile de massage parfumée", descriptionRu: "Ароматизированное массажное масло.", rating: 4.5, reviews: 78, stock: 40, sold: 67 },
]

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  minAmount: number
  maxAmount: number
  available: boolean
}

export const exchangeRates: ExchangeRate[] = [
  { from: "EUR", to: "CFA", rate: 655.96, minAmount: 10, maxAmount: 5000, available: true },
  { from: "USD", to: "CFA", rate: 600.00, minAmount: 10, maxAmount: 5000, available: true },
  { from: "EUR", to: "USD", rate: 1.09, minAmount: 10, maxAmount: 5000, available: true },
  { from: "CFA", to: "EUR", rate: 0.001524, minAmount: 5000, maxAmount: 3000000, available: true },
  { from: "CFA", to: "USD", rate: 0.001667, minAmount: 5000, maxAmount: 3000000, available: true },
]

export interface RussianOrder {
  id: string
  customer: string
  phone: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  totalEUR: number
  totalUSD: number
  status: string
  date: string
  deliveryAddress: string
  paymentMethod: string
}

export const initialRussianOrders: RussianOrder[] = [
  { id: 'RU-001', customer: 'Иванов', phone: '+223 70 XX XX XX', items: [{ name: 'Vodka Absolut 700ml', quantity: 2, price: 36000 }], total: 36000, totalEUR: 54.88, totalUSD: 60, status: 'pending', date: '02/04/2026', deliveryAddress: 'Camp Alpha', paymentMethod: 'CFA' },
  { id: 'RU-002', customer: 'Петров', phone: '+223 66 XX XX XX', items: [{ name: 'Masque Dogon', quantity: 1, price: 25000 }], total: 25000, totalEUR: 38.11, totalUSD: 41.67, status: 'shipped', date: '01/04/2026', deliveryAddress: 'Hôtel Nord-Sud', paymentMethod: 'EUR' },
  { id: 'RU-003', customer: 'Сидоров', phone: '+223 77 XX XX XX', items: [{ name: 'Échange 500 EUR', quantity: 1, price: 327980 }], total: 327980, totalEUR: 500, totalUSD: 545, status: 'completed', date: '31/03/2026', deliveryAddress: 'Camp Echo', paymentMethod: 'EUR' },
  { id: 'RU-004', customer: 'Козлов', phone: '+223 65 XX XX XX', items: [{ name: 'Whisky Jack Daniel\'s', quantity: 1, price: 35000 }], total: 35000, totalEUR: 53.39, totalUSD: 58.33, status: 'delivered', date: '30/03/2026', deliveryAddress: 'Résidence Moderne', paymentMethod: 'USD' },
]
