export interface InternationalShop {
  id: string
  name: string
  nameLocal: string
  country: string
  flag: string
  code: string
  currency: string
  currencySymbol: string
  status: 'active' | 'coming_soon' | 'planned'
  description: string
  descriptionRu: string
  categories: string[]
  exchangeRate: number
  launchDate?: string
  color: string
  gradient: string
}

export const internationalShops: InternationalShop[] = [
  {
    id: 'russia',
    name: 'Boutique Russe',
    nameLocal: 'Русский Магазин',
    country: 'Russie',
    flag: '🇷🇺',
    code: 'ru',
    currency: 'RUB',
    currencySymbol: '₽',
    status: 'active',
    description: 'Produits russes pour militaires et expatriés au Mali',
    descriptionRu: 'Русские товары для военных и экспатов в Мали',
    categories: ['Сувениры', 'Алкоголь', 'Еда', 'Косметика'],
    exchangeRate: 0.0092,
    color: '#0039A6',
    gradient: 'from-blue-600 to-red-600'
  },
  {
    id: 'china',
    name: 'Boutique Chinoise',
    nameLocal: '中国商店',
    country: 'Chine',
    flag: '🇨🇳',
    code: 'cn',
    currency: 'CNY',
    currencySymbol: '¥',
    status: 'coming_soon',
    description: 'Produits chinois de qualité au meilleur prix',
    descriptionRu: 'Качественные китайские товары по лучшим ценам',
    categories: ['Électronique', 'Vêtements', 'Maison', 'Jouets'],
    exchangeRate: 0.089,
    launchDate: '2026-Q3',
    color: '#DE2910',
    gradient: 'from-red-600 to-yellow-500'
  },
  {
    id: 'turkey',
    name: 'Boutique Turque',
    nameLocal: 'Türk Mağazası',
    country: 'Turquie',
    flag: '🇹🇷',
    code: 'tr',
    currency: 'TRY',
    currencySymbol: '₺',
    status: 'coming_soon',
    description: 'Mode turque, textiles et artisanat d\'excellence',
    descriptionRu: 'Турецкая мода, текстиль и мастерство',
    categories: ['Mode', 'Textile', 'Céramique', 'Alimentation'],
    exchangeRate: 0.032,
    launchDate: '2026-Q3',
    color: '#E30A17',
    gradient: 'from-red-600 to-red-700'
  },
  {
    id: 'dubai',
    name: 'Boutique Dubaï',
    nameLocal: 'دبي متجر',
    country: 'Émirats Arabes Unis',
    flag: '🇦🇪',
    code: 'ae',
    currency: 'AED',
    currencySymbol: 'د.إ',
    status: 'planned',
    description: 'Luxe, parfums et produits premium de Dubaï',
    descriptionRu: 'Роскошь, парфюмерия и премиум товары из Дубая',
    categories: ['Luxe', 'Parfums', 'Or', 'Premium'],
    exchangeRate: 0.164,
    launchDate: '2027-Q1',
    color: '#00732F',
    gradient: 'from-green-600 to-black'
  }
]

export const getStatusLabel = (status: InternationalShop['status']) => {
  switch (status) {
    case 'active': return { label: 'Actif', color: 'bg-green-100 text-green-700' }
    case 'coming_soon': return { label: 'Bientôt', color: 'bg-yellow-100 text-yellow-700' }
    case 'planned': return { label: 'Planifié', color: 'bg-blue-100 text-blue-700' }
  }
}
