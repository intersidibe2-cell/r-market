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
  isAdult?: boolean
}

export const categories = [
  { id: "all", name: "Tous", color: "from-green-600 to-yellow-500", emoji: "🏪", image: "https://images.unsplash.com/photo-1590845947667-381579052389?w=400&h=400&fit=crop" },
  { id: "mode", name: "Mode & Vêtements", color: "from-pink-500 to-rose-500", emoji: "👗", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face" },
  { id: "electronique", name: "Électronique", color: "from-blue-500 to-cyan-500", emoji: "📱", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop" },
  { id: "sante", name: "Santé & Beauté", color: "from-green-500 to-emerald-500", emoji: "💄", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop" },
  { id: "maison", name: "Maison & Décoration", color: "from-amber-500 to-orange-500", emoji: "🏠", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop" },
  { id: "alimentation", name: "Alimentation", color: "from-yellow-500 to-green-500", emoji: "🍫", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop" },
  { id: "adulte", name: "Articles adultes", color: "from-purple-600 to-pink-600", emoji: "🔞", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop" },
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
  // ========================
  // MODE & VÊTEMENTS
  // ========================
  { id: 1, name: "Robe bazin riche brodée femme", price: 25000, originalPrice: 45000, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop", category: "mode", description: "Magnifique robe en bazin riche avec broderies traditionnelles. Parfaite pour les cérémonies.", badge: "Best-seller", rating: 4.8, reviews: 1234, stock: 150, sold: 890 },
  { id: 2, name: "Boubou homme grand modèle brodé", price: 35000, originalPrice: 55000, image: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=500&h=500&fit=crop", category: "mode", description: "Boubou traditionnel malien en bazin riche avec broderies artisanales.", badge: "Promo", rating: 4.9, reviews: 567, stock: 80, sold: 340 },
  { id: 3, name: "Ensemble pagne wax femme 3 pièces", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop", category: "mode", description: "Ensemble 3 pièces en pagne wax hollandais. Design moderne africain.", rating: 4.7, reviews: 432, stock: 60, sold: 210 },
  { id: 4, name: "Chemise homme coton premium", price: 12000, originalPrice: 18000, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop", category: "mode", description: "Chemise en coton de haute qualité. Confortable pour le quotidien.", badge: "Nouveau", rating: 4.5, reviews: 234, stock: 200, sold: 150 },
  { id: 5, name: "Robe enfant kolon", price: 8500, originalPrice: 12000, image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=500&fit=crop", category: "mode", description: "jolie robe pour enfant en tissu kolon. Colorée et confortable.", rating: 4.6, reviews: 189, stock: 120, sold: 95 },
  { id: 6, name: "Grand boubou femme bazin", price: 28000, originalPrice: 40000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop", category: "mode", description: "Grand boubou pour femme en bazin riche. Élégant pour les grandes occasions.", rating: 4.8, reviews: 345, stock: 75, sold: 200 },
  { id: 7, name: "T-shirt homme coton bio", price: 5500, originalPrice: 8000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", category: "mode", description: "T-shirt en coton bio douceur. Multiple couleurs disponibles.", badge: "Bio", rating: 4.4, reviews: 567, stock: 300, sold: 450 },
  { id: 8, name: "Pagne wax hollandais Vlisco", price: 18000, originalPrice: 25000, image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=500&h=500&fit=crop", category: "mode", description: "Vêtement pagne wax Vlisco authentique. Motifs variés.", rating: 4.7, reviews: 890, stock: 150, sold: 600 },
  { id: 9, name: "Robe de soirée longue", price: 45000, originalPrice: 65000, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=500&fit=crop", category: "mode", description: "Robe de soirée élégante longue. Pour occasions spéciales.", badge: "Premium", rating: 4.9, reviews: 123, stock: 25, sold: 78 },
  { id: 10, name: "Costume homme 3 pièces", price: 75000, originalPrice: 95000, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop", category: "mode", description: "Costume élégant 3 pièces pour homme. Pour cérémonies et événements.", rating: 4.8, reviews: 234, stock: 40, sold: 156 },
  { id: 11, name: "Robe bubu traditionnelle", price: 9500, originalPrice: 15000, image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=500&h=500&fit=crop", category: "mode", description: "Robe bubu confortable pour tous les jours. Tissu léger.", rating: 4.5, reviews: 456, stock: 180, sold: 320 },
  { id: 12, name: "Ensemble sportif homme", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop", category: "mode", description: "Ensemble sportif complet. Pour fitness et sport.", badge: "Sport", rating: 4.3, reviews: 234, stock: 90, sold: 145 },

  // ========================
  // ÉLECTRONIQUE
  // ========================
  { id: 13, name: "iPhone 15 Pro Max 256Go", price: 650000, originalPrice: 750000, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop", category: "electronique", description: "Le dernier iPhone avec puce A17 Pro, appareil photo 48MP.", badge: "Nouveau", rating: 4.9, reviews: 2345, stock: 45, sold: 1200 },
  { id: 14, name: "Samsung Galaxy S24 Ultra", price: 580000, originalPrice: 680000, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone premium avec S Pen intégré, zoom optique 10x.", badge: "Promo", rating: 4.8, reviews: 876, stock: 30, sold: 540 },
  { id: 15, name: "Tecno Camon 20 Pro 5G", price: 165000, originalPrice: 195000, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone populaire au Mali avec excellent appareil photo 64MP.", badge: "Best-seller", rating: 4.5, reviews: 3456, stock: 200, sold: 2100 },
  { id: 16, name: "Smart TV Samsung 55\" 4K", price: 325000, originalPrice: 420000, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop", category: "electronique", description: "Smart TV avec processeur Crystal 4K, HDR10+ et Tizen OS.", rating: 4.6, reviews: 654, stock: 25, sold: 320 },
  { id: 17, name: "Infinix Hot 40 Pro", price: 125000, originalPrice: 155000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone Infinix avec grand écran 6.78\", processeur Helio G99.", rating: 4.4, reviews: 1890, stock: 120, sold: 890 },
  { id: 18, name: "Xiaomi Redmi Note 13 Pro", price: 175000, originalPrice: 210000, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop", category: "electronique", description: "Smartphone Xiaomi avec appareil photo 200MP, écran AMOLED 120Hz.", rating: 4.6, reviews: 1200, stock: 70, sold: 650 },
  { id: 19, name: "AirPods Pro 2", price: 185000, originalPrice: 220000, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&h=500&fit=crop", category: "electronique", description: "Écouteurs Apple avec réduction de bruit active.", badge: "Populaire", rating: 4.9, reviews: 1567, stock: 80, sold: 980 },
  { id: 20, name: "Chargeur rapide USB-C 65W", price: 15000, originalPrice: 25000, image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=500&h=500&fit=crop", category: "electronique", description: "Chargeur rapide universel. Compatible tous appareils.", rating: 4.5, reviews: 890, stock: 250, sold: 600 },
  { id: 21, name: "Powerbank 20000mAh", price: 22000, originalPrice: 35000, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop", category: "electronique", description: "Batterie externe grande capacité. Charge 3 appareils simultanément.", badge: "Utile", rating: 4.4, reviews: 678, stock: 180, sold: 450 },
  { id: 22, name: "Mini projecteur HD", price: 85000, originalPrice: 120000, image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&h=500&fit=crop", category: "electronique", description: "Mini projecteur portable. Pour cinéma maison.", rating: 4.3, reviews: 345, stock: 35, sold: 189 },
  { id: 23, name: "Montre connectée smartwatch", price: 35000, originalPrice: 55000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", category: "electronique", description: "Montre intelligente avec podomètre, cardio, notifications.", badge: "Tendance", rating: 4.5, reviews: 1234, stock: 100, sold: 780 },
  { id: 24, name: "Enceinte Bluetooth portable", price: 28000, originalPrice: 40000, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop", category: "electronique", description: "Enceinte防水 avec son puissant. Autonomie 12h.", rating: 4.6, reviews: 567, stock: 120, sold: 380 },

  // ========================
  // SANTÉ & BEAUTÉ
  // ========================
  { id: 25, name: "Crème éclaircissante claire", price: 8500, originalPrice: 12000, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop", category: "sante", description: "Crème éclaircissante de qualité. Égalise le teint.", badge: "Populaire", rating: 4.4, reviews: 2345, stock: 300, sold: 1800 },
  { id: 26, name: "Parfum Oud oriental premium", price: 35000, originalPrice: 50000, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop", category: "sante", description: "Parfum Oud aux notes orientales intenses. Longue tenue.", badge: "Exclusif", rating: 4.8, reviews: 345, stock: 50, sold: 210 },
  { id: 27, name: "Huile de coco vierge bio", price: 6000, originalPrice: 9000, image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&h=500&fit=crop", category: "sante", description: "Huile de coco 100% naturelle. Pour cheveux et peau.", badge: "Bio", rating: 4.7, reviews: 890, stock: 400, sold: 650 },
  { id: 28, name: "Savon noir africain traditionnel", price: 3500, originalPrice: 5000, image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&h=500&fit=crop", category: "sante", description: "Savon noir naturel du Mali. Nettoie et hydrate.", rating: 4.8, reviews: 1567, stock: 500, sold: 1200 },
  { id: 29, name: "Shampoing kératine renforçante", price: 7500, originalPrice: 11000, image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop", category: "sante", description: "Shampoing renforçant avec kératine. Répare les cheveux abimés.", rating: 4.5, reviews: 678, stock: 250, sold: 480 },
  { id: 30, name: "Huile d'argan pure", price: 12000, originalPrice: 18000, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop", category: "sante", description: "Huile d'argan pure du Maroc. Hydrate et nourrit.", badge: "Premium", rating: 4.9, reviews: 456, stock: 180, sold: 340 },
  { id: 31, name: "Crème solaires SPF 50", price: 9500, originalPrice: 14000, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop", category: "sante", description: "Protection solaire haute. Indispensable au Mali.", rating: 4.6, reviews: 890, stock: 200, sold: 560 },
  { id: 32, name: "Baume à lèvres naturel", price: 2500, originalPrice: 4000, image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=500&h=500&fit=crop", category: "sante", description: "Baume hydratant lèvres. Formule naturelle.", rating: 4.4, reviews: 1234, stock: 400, sold: 890 },
  { id: 33, name: "Kit manicure complet", price: 8000, originalPrice: 12000, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=500&fit=crop", category: "sante", description: "Kit complet pour ongles. Tout pour la beauté.", rating: 4.3, reviews: 345, stock: 150, sold: 234 },
  { id: 34, name: "Mèches cheveux qualité premium", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=500&fit=crop", category: "sante", description: "Mèches cheveux 100% humaines. Couleurs variées.", badge: "Best-seller", rating: 4.7, reviews: 1890, stock: 100, sold: 1450 },

  // ========================
  // MAISON & DÉCORATION
  // ========================
  { id: 35, name: "Canapé salon moderne 7 places", price: 550000, originalPrice: 750000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", category: "maison", description: "Canapé d'angle confortable et moderne. Tissu résistant.", badge: "Promo", rating: 4.5, reviews: 234, stock: 15, sold: 89 },
  { id: 36, name: "Set cuisine complet inox 24 pièces", price: 45000, originalPrice: 65000, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", category: "maison", description: "Ensemble complet de cuisine en acier inoxydable.", rating: 4.4, reviews: 567, stock: 100, sold: 430 },
  { id: 37, name: "Ventilateur sur pied rechargeable", price: 28000, originalPrice: 38000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&h=500&fit=crop", category: "maison", description: "Ventilateur rechargeable avec batterie longue durée. 3 vitesses.", rating: 4.3, reviews: 189, stock: 75, sold: 156 },
  { id: 38, name: "Générateur solaire portable 200W", price: 185000, originalPrice: 250000, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop", category: "maison", description: "Générateur solaire portable. Autonomie 8h. Idéal pour Bamako.", badge: "Utile", rating: 4.6, reviews: 678, stock: 30, sold: 230 },
  { id: 39, name: "Lustre plafonnier LED moderne", price: 35000, originalPrice: 50000, image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&h=500&fit=crop", category: "maison", description: "Plafonnier LED design moderne. Lumière adjustable.", rating: 4.5, reviews: 345, stock: 60, sold: 178 },
  { id: 40, name: "Rideaux occultants 2 pièces", price: 18000, originalPrice: 28000, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=500&fit=crop", category: "maison", description: "Rideaux occultants noirs. Bloquent la lumière.", rating: 4.4, reviews: 234, stock: 90, sold: 145 },
  { id: 41, name: "Coussin salon luxe velours", price: 8500, originalPrice: 12000, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop", category: "maison", description: "Coussin décoratif en velours. Lot de 2.", rating: 4.6, reviews: 456, stock: 150, sold: 290 },
  { id: 42, name: "Vaisselle 24 pièces service", price: 55000, originalPrice: 75000, image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop", category: "maison", description: "Service de vaisselle complet. 24 pièces. Moderne.", rating: 4.5, reviews: 189, stock: 40, sold: 123 },
  { id: 43, name: "Lampe de chevet LED tactile", price: 12000, originalPrice: 18000, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop", category: "maison", description: "Lampe LED avec contrôle tactile. 3 intensités.", badge: "Nouveau", rating: 4.7, reviews: 678, stock: 100, sold: 380 },
  { id: 44, name: "Tapis salon moderne 2x3m", price: 45000, originalPrice: 65000, image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&h=500&fit=crop", category: "maison", description: "Tapis moderne grande taille. Design contemporain.", rating: 4.4, reviews: 234, stock: 35, sold: 156 },

  // ========================
  // ALIMENTATION
  // ========================
  { id: 45, name: "Thé du Mali vert", price: 3500, originalPrice: 5000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop", category: "alimentation", description: "Thé vert malien de qualité. Saveur authentique.", badge: "Local", rating: 4.8, reviews: 2345, stock: 500, sold: 1800 },
  { id: 46, name: "Poivre noir de Tombouctou", price: 6000, originalPrice: 9000, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop", category: "alimentation", description: "Poivre noir authentique de Tombouctou. Arôme intense.", badge: "Premium", rating: 4.9, reviews: 890, stock: 300, sold: 650 },
  { id: 47, name: "Beurre de karité bio pur 500ml", price: 5000, originalPrice: 8000, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop", category: "alimentation", description: "Beurre de karité 100% pur et bio du Mali.", badge: "Bio", rating: 4.8, reviews: 1678, stock: 400, sold: 1320 },
  { id: 48, name: "Gingembre frais bio", price: 2500, originalPrice: 4000, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=500&fit=crop", category: "alimentation", description: "Gingembre frais local. Pour cuisine et santé.", rating: 4.6, reviews: 1234, stock: 600, sold: 890 },
  { id: 49, name: "Café de Côte d'Ivoire torréfié", price: 8000, originalPrice: 12000, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=500&fit=crop", category: "alimentation", description: "Café arabica torréfié. Mouture fine.", rating: 4.7, reviews: 567, stock: 250, sold: 380 },
  { id: 50, name: "Miel naturel du Burkina", price: 7500, originalPrice: 10000, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=500&fit=crop", category: "alimentation", description: "Miel pur 100% naturel. Propriétés médicinales.", badge: "Bio", rating: 4.8, reviews: 890, stock: 200, sold: 560 },
  { id: 51, name: "Farine de mil本地", price: 2000, originalPrice: 3000, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop", category: "alimentation", description: "Farine de mil pour bouillie et tg.", rating: 4.5, reviews: 2345, stock: 800, sold: 1500 },
  { id: 52, name: "Huile d'arachide artisanale", price: 4500, originalPrice: 6500, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop", category: "alimentation", description: "Huile d'arachide pressée à froid. Saveur authentique.", rating: 4.6, reviews: 678, stock: 350, sold: 480 },
  { id: 53, name: "Noix de cajou grillées salées", price: 8500, originalPrice: 12000, image: "https://images.unsplash.com/photo-1606318562231-1a0f71c7eb30?w=500&h=500&fit=crop", category: "alimentation", description: "Noix de cajou grillées. Snack healthy.", badge: "Snack", rating: 4.7, reviews: 1234, stock: 300, sold: 890 },
  { id: 54, name: "Épices collection Mali 5 pièces", price: 12000, originalPrice: 18000, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop", category: "alimentation", description: "Set de 5 épices essentielles pour cuisine malienne.", badge: "Pack", rating: 4.8, reviews: 456, stock: 150, sold: 320 },

  // ========================
  // ARTICLES INTIMES (18+) - Discrets
  // ========================
  { id: 55, name: "Huile de massage romantique 100ml", price: 8500, originalPrice: 12000, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop", category: "adulte", description: "Huile de massage parfumée. Pour moments intimes.", badge: "Intime", rating: 4.6, reviews: 234, stock: 60, sold: 145, isAdult: true },
  { id: 56, name: "Gels intimes lubifiants 3 saveurs", price: 6500, originalPrice: 9500, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop", category: "adulte", description: "Pack de 3 gels lubifiants. Aux saveurs naturelles.", rating: 4.5, reviews: 189, stock: 80, sold: 123, isAdult: true },
  { id: 57, name: "Vibrateur rechargeable discret", price: 25000, originalPrice: 35000, image: "https://images.unsplash.com/photo-1625215087410-63e2f6d5a35b?w=500&h=500&fit=crop", category: "adulte", description: "Massageur intime rechargeable. Silencieux et discret.", badge: "Discret", rating: 4.7, reviews: 156, stock: 40, sold: 98, isAdult: true },
  { id: 58, name: "Préservatifs elite x12", price: 5500, originalPrice: 8000, image: "https://images.unsplash.com/photo-1609798554731-c9a2f4f3e07c?w=500&h=500&fit=crop", category: "adulte", description: "Boîte de 12 préservatifs premium. Protection et confort.", badge: "Santé", rating: 4.8, reviews: 567, stock: 200, sold: 380, isAdult: true },
  { id: 59, name: "Baume intime hydratant", price: 7500, originalPrice: 10000, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop", category: "adulte", description: "Soin intime féminin hydratant. Formule douce.", rating: 4.6, reviews: 234, stock: 100, sold: 178, isAdult: true },
  { id: 60, name: "Ensemble lingerie sensuelle", price: 15000, originalPrice: 22000, image: "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=500&h=500&fit=crop", category: "adulte", description: "Ensemble lingerie en dentelle. Élégance et sensualité.", badge: "Luxe", rating: 4.7, reviews: 189, stock: 45, sold: 112, isAdult: true },
]
