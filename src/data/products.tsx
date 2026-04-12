export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  description: string
  badge?: string
  rating: number
  reviews: number
  stock: number
  sold: number
}

export const categories = [
  { id: "all", name: "Tous", color: "from-green-600 to-yellow-500", emoji: "🏪" },
  { id: "mode", name: "Mode", color: "from-blue-500 to-cyan-500", emoji: "👗" },
  { id: "electronique", name: "Électronique", color: "from-green-500 to-emerald-500", emoji: "📱" },
  { id: "adulte", name: "18+ Ans", color: "from-red-600 to-pink-600", emoji: "🔞" },
  { id: "malien", name: "Artisanat Mali", color: "from-yellow-500 to-green-600", emoji: "🇲🇱" },
]

export const regions = [
  "Bamako", "Kayes", "Koulikoro", "Sikasso", "Ségou", "Mopti", "Tombouctou", "Gao", "Kidal", "Ménaka", "Taoudénit"
]

export const paymentMethods = [
  {
    id: 'orange',
    label: 'Orange Money',
    desc: 'Paiement via Orange Money',
    color: '#FF6600',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#FF6600"/>
        <text x="20" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Orange</text>
        <text x="20" y="26" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Money</text>
      </svg>
    )
  },
  {
    id: 'moov',
    label: 'Moov Money',
    desc: 'Paiement via Moov Money',
    color: '#0066CC',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#0066CC"/>
        <text x="20" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Moov</text>
        <text x="20" y="26" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">Money</text>
      </svg>
    )
  },
  {
    id: 'wave',
    label: 'Wave',
    desc: 'Paiement via Wave Mali',
    color: '#1DC3E3',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#1DC3E3"/>
        <text x="20" y="24" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Wave</text>
      </svg>
    )
  },
  {
    id: 'cash',
    label: 'Cash à la livraison',
    desc: 'Paiement à la réception',
    color: '#22C55E',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#22C55E"/>
        <text x="20" y="24" textAnchor="middle" fill="white" fontSize="16">💵</text>
      </svg>
    )
  },
  {
    id: 'bms',
    label: 'Virement BMS',
    desc: 'Banque Malienne de Solidarité',
    color: '#1E3A5F',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#1E3A5F"/>
        <text x="20" y="17" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">BMS</text>
        <text x="20" y="27" textAnchor="middle" fill="#FBBF24" fontSize="5">SAHEL</text>
      </svg>
    )
  },
]

export const products: Product[] = [
  { id: 1, name: "Robe bazin riche brodée femme", price: 25000, originalPrice: 45000, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop", category: "mode", description: "Magnifique robe en bazin riche avec broderies traditionnelles. Parfaite pour les cérémonies et occasions spéciales à Bamako.", badge: "Best-seller", rating: 4.8, reviews: 1234, stock: 150, sold: 890 },
  { id: 2, name: "Boubou homme grand modèle brodé", price: 35000, originalPrice: 55000, image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=500&h=500&fit=crop", category: "mode", description: "Boubou traditionnel malien en bazin riche avec broderies artisanales. Coupe ample et élégante pour hommes.", badge: "Promo", rating: 4.9, reviews: 567, stock: 80, sold: 340 },
  { id: 3, name: "Ensemble pagne wax femme 3 pièces", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop", category: "mode", description: "Ensemble 3 pièces en pagne wax hollandais. Design moderne africain avec coupe ajustée.", rating: 4.7, reviews: 432, stock: 60, sold: 210 },
  { id: 4, name: "iPhone 15 Pro Max 256Go", price: 650000, originalPrice: 750000, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop", category: "electronique", description: "Le dernier iPhone avec puce A17 Pro, appareil photo 48MP et écran Super Retina XDR 6.7 pouces. Livraison à Bamako.", badge: "Nouveau", rating: 4.9, reviews: 2345, stock: 45, sold: 1200 },
  { id: 5, name: "Samsung Galaxy S24 Ultra", price: 580000, originalPrice: 680000, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone premium avec S Pen intégré, zoom optique 10x et écran Dynamic AMOLED 2X.", badge: "Promo", rating: 4.8, reviews: 876, stock: 30, sold: 540 },
  { id: 6, name: "Tecno Camon 20 Pro 5G", price: 165000, originalPrice: 195000, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone populaire au Mali avec excellent appareil photo 64MP et grande autonomie. Rapport qualité-prix imbattable.", badge: "Best-seller", rating: 4.5, reviews: 3456, stock: 200, sold: 2100 },
  { id: 7, name: "Smart TV Samsung 55\" 4K", price: 325000, originalPrice: 420000, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop", category: "electronique", description: "Smart TV avec processeur Crystal 4K, HDR10+ et Tizen OS. Qualité d'image exceptionnelle.", rating: 4.6, reviews: 654, stock: 25, sold: 320 },
  { id: 8, name: "Canapé salon moderne 7 places", price: 550000, originalPrice: 750000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", category: "maison", description: "Canapé d'angle confortable et moderne. Tissu résistant et structure en bois massif. Livraison Bamako et régions.", badge: "Promo", rating: 4.5, reviews: 234, stock: 15, sold: 89 },
  { id: 9, name: "Set cuisine complet inox 24 pièces", price: 45000, originalPrice: 65000, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", category: "maison", description: "Ensemble complet de cuisine en acier inoxydable. Tout ce qu'il faut pour la cuisine malienne.", rating: 4.4, reviews: 567, stock: 100, sold: 430 },
  { id: 10, name: "Ventilateur sur pied rechargeable", price: 28000, originalPrice: 38000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&h=500&fit=crop", category: "maison", description: "Ventilateur rechargeable avec batterie longue durée. Idéal pour la chaleur de Bamako. 3 vitesses.", rating: 4.3, reviews: 189, stock: 75, sold: 156 },
  { id: 11, name: "Parfum Oud oriental premium", price: 35000, originalPrice: 50000, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop", category: "adulte", description: "Parfum Oud aux notes orientales intenses. Collection exclusive réservée aux adultes. Longue tenue.", badge: "Exclusif", rating: 4.8, reviews: 345, stock: 50, sold: 210 },
  { id: 12, name: "Coffret lingerie fine dentelle", price: 18000, originalPrice: 28000, image: "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=500&h=500&fit=crop", category: "adulte", description: "Ensemble lingerie en dentelle de qualité. Élégance et sensualité. Réservé aux adultes.", rating: 4.6, reviews: 234, stock: 80, sold: 167 },
  { id: 13, name: "Kit premiers soins complet famille", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&h=500&fit=crop", category: "pharmacie", description: "Kit complet de premiers soins avec pansements, antiseptiques, bandages et médicaments de base.", rating: 4.7, reviews: 890, stock: 300, sold: 650 },
  { id: 14, name: "Compléments alimentaires naturels", price: 12000, originalPrice: 18000, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop", category: "malien", description: "Pack de vitamines et minéraux naturels. Renforcez votre immunité. Produits certifiés.", badge: "Bio", rating: 4.5, reviews: 456, stock: 500, sold: 340 },
  { id: 15, name: "Beurre de karité bio pur 500ml", price: 5000, originalPrice: 8000, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop", category: "malien", description: "Beurre de karité 100% pur et bio du Mali. Hydratation naturelle pour peau et cheveux. Produit local.", rating: 4.8, reviews: 678, stock: 400, sold: 520 },
  { id: 16, name: "Bazin riche getzner brodé premium", price: 65000, originalPrice: 95000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop", category: "malien", description: "Tissu bazin riche Getzner de qualité supérieure avec broderie traditionnelle malienne. Le luxe du style bamakois.", badge: "Premium", rating: 4.9, reviews: 567, stock: 40, sold: 380 },
  { id: 17, name: "Boubou homme bazin riche complet", price: 55000, originalPrice: 80000, image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=500&h=500&fit=crop", category: "malien", description: "Boubou traditionnel malien en bazin riche. Coupe ample et broderies raffinées faites main à Bamako.", rating: 4.8, reviews: 345, stock: 35, sold: 230 },
  { id: 18, name: "Collier traditionnel or massif", price: 350000, originalPrice: 500000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop", category: "malien", description: "Collier artisanal en or massif avec motifs traditionnels maliens. Pièce unique faite main à Bamako.", badge: "Exclusif", rating: 4.9, reviews: 123, stock: 10, sold: 67 },
  { id: 19, name: "Tissu wax hollandais Vlisco 6 yards", price: 45000, originalPrice: 65000, image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=500&h=500&fit=crop", category: "malien", description: "Véritable tissu wax hollandais Vlisco. Motifs authentiques et couleurs éclatantes. Qualité garantie.", rating: 4.7, reviews: 789, stock: 60, sold: 450 },
  { id: 20, name: "Ensemble femme pagne moderne 2p", price: 28000, originalPrice: 42000, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop", category: "malien", description: "Ensemble moderne en pagne wax. Coupe ajustée et design contemporain africain. Fait à Bamako.", badge: "Tendance", rating: 4.8, reviews: 456, stock: 55, sold: 310 },
  { id: 21, name: "Infinix Hot 40 Pro", price: 125000, originalPrice: 155000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone Infinix avec grand écran 6.78\", processeur Helio G99 et batterie 5000mAh. Très populaire au Mali.", rating: 4.4, reviews: 1890, stock: 120, sold: 890 },
  { id: 22, name: "Générateur solaire portable 200W", price: 185000, originalPrice: 250000, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop", category: "maison", description: "Générateur solaire portable avec panneau solaire. Idéal pour les coupures d'électricité. Autonomie 8h.", badge: "Promo", rating: 4.6, reviews: 678, stock: 30, sold: 230 },
  { id: 23, name: "Tapis de prière luxe velours", price: 12000, originalPrice: 18000, image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&h=500&fit=crop", category: "malien", description: "Tapis de prière en velours doux avec motifs islamiques. Confortable et élégant. Fabriqué au Mali.", rating: 4.7, reviews: 234, stock: 200, sold: 198 },
  { id: 24, name: "Xiaomi Redmi Note 13 Pro", price: 175000, originalPrice: 210000, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone Xiaomi avec appareil photo 200MP, écran AMOLED 120Hz et charge rapide 67W.", rating: 4.6, reviews: 1200, stock: 70, sold: 650 },
]
