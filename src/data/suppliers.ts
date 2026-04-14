export interface Supplier {
  id: number
  name: string
  contact: string
  phone: string
  location: string
  city: string
  category: string
  productsCount: number
  productsNeedingPhotos: number
  status: 'active' | 'inactive'
  notes?: string
}

export const suppliers: Supplier[] = [
  { id: 1, name: 'Marché Médina', contact: 'Amadou Diallo', phone: '+223 70 11 22 33', location: 'Marché Médina, Allée 5', city: 'Bamako', category: 'Mode', productsCount: 45, productsNeedingPhotos: 12, status: 'active', notes: 'Meilleur accès le matin avant 10h' },
  { id: 2, name: 'Boutique Bamako Centre', contact: 'Fatou Koné', phone: '+223 66 44 55 66', location: 'Rue 123, Bamako Centre', city: 'Bamako', category: 'Électronique', productsCount: 30, productsNeedingPhotos: 8, status: 'active', notes: 'Appeler avant de venir' },
  { id: 3, name: 'Artisan Bandiagara', contact: 'Moussa Traoré', phone: '+223 77 77 88 99', location: 'Bandiagara, Zone artisanale', city: 'Bandiagara', category: 'Souvenirs', productsCount: 25, productsNeedingPhotos: 15, status: 'active', notes: 'Route difficile, prévoir 2h' },
  { id: 4, name: 'Fournisseur Alimentation', contact: 'Ibrahim Cissé', phone: '+223 65 12 34 56', location: 'Zone industrielle, Entrepôt 7', city: 'Bamako', category: 'Alimentation', productsCount: 60, productsNeedingPhotos: 20, status: 'active', notes: 'Ouvert 7h-18h' },
  { id: 5, name: 'Marché de Ségou', contact: 'Aminata Diarra', phone: '+223 78 90 12 34', location: 'Marché central, Secteur B', city: 'Ségou', category: 'Mode', productsCount: 35, productsNeedingPhotos: 18, status: 'active', notes: 'Tous les mardis et vendredis' },
  { id: 6, name: 'Village Dogon - Sangha', contact: 'Boubacar Maïga', phone: '+223 79 56 78 90', location: 'Sangha, Village Dogon', city: 'Sangha', category: 'Souvenirs', productsCount: 20, productsNeedingPhotos: 20, status: 'active', notes: 'Route difficile, prévoir 3h' },
  { id: 7, name: 'Pharmacie Bamako', contact: 'Dr. Konaté', phone: '+223 71 23 45 67', location: 'Bamako, Quartier Hippodrome', city: 'Bamako', category: 'Santé', productsCount: 40, productsNeedingPhotos: 5, status: 'active', notes: 'Pharmacie ouverte 24h' },
  { id: 8, name: 'Quartier Plateau', contact: 'Mamadou Sangaré', phone: '+223 72 89 01 23', location: 'Bamako, Plateau', city: 'Bamako', category: 'Maison', productsCount: 28, productsNeedingPhotos: 10, status: 'active', notes: 'Meubles et décoration' },
]

export const supplierCategories = [
  { id: 'all', name: 'Tous', emoji: '🏪' },
  { id: 'Mode', name: 'Mode', emoji: '👗' },
  { id: 'Électronique', name: 'Électronique', emoji: '📱' },
  { id: 'Souvenirs', name: 'Souvenirs', emoji: '🎁' },
  { id: 'Alimentation', name: 'Alimentation', emoji: '🍫' },
  { id: 'Santé', name: 'Santé', emoji: '💊' },
  { id: 'Maison', name: 'Maison', emoji: '🏠' },
]

export const cities = ['Bamako', 'Ségou', 'Mopti', 'Sikasso', 'Kayes', 'Koulikoro', 'Bandiagara', 'Sangha']
