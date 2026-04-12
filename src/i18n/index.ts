export type Language = 'fr' | 'ru' | 'bm'

export interface LanguageInfo {
  code: Language
  name: string
  nativeName: string
  flag: string
}

export const languages: LanguageInfo[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan', flag: '🇲🇱' }
]

// Traductions
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.shop': 'Boutique',
    'nav.cart': 'Panier',
    'nav.favorites': 'Favoris',
    'nav.account': 'Mon compte',
    'nav.admin': 'Administration',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    
    // Common
    'common.search': 'Rechercher...',
    'common.add': 'Ajouter',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.close': 'Fermer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.confirm': 'Confirmer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.submit': 'Envoyer',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.all': 'Tous',
    'common.none': 'Aucun',
    
    // Product
    'product.add_to_cart': 'Ajouter au panier',
    'product.buy_now': 'Acheter maintenant',
    'product.in_stock': 'En stock',
    'product.out_of_stock': 'Rupture de stock',
    'product.low_stock': 'Stock limité',
    'product.price': 'Prix',
    'product.original_price': 'Prix initial',
    'product.discount': 'Réduction',
    'product.description': 'Description',
    'product.reviews': 'Avis',
    'product.rating': 'Note',
    'product.compare': 'Comparer',
    'product.add_to_compare': 'Ajouter à la comparaison',
    'product.remove_from_compare': 'Retirer de la comparaison',
    
    // Cart
    'cart.title': 'Mon panier',
    'cart.empty': 'Votre panier est vide',
    'cart.total': 'Total',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.checkout': 'Passer commande',
    'cart.continue_shopping': 'Continuer mes achats',
    'cart.remove_item': 'Supprimer',
    'cart.quantity': 'Quantité',
    
    // Checkout
    'checkout.title': 'Finaliser la commande',
    'checkout.delivery': 'Livraison',
    'checkout.payment': 'Paiement',
    'checkout.summary': 'Récapitulatif',
    'checkout.place_order': 'Confirmer la commande',
    
    // Account
    'account.title': 'Mon compte',
    'account.orders': 'Mes commandes',
    'account.settings': 'Paramètres',
    'account.address': 'Mes adresses',
    'account.loyalty': 'Programme fidélité',
    
    // Loyalty
    'loyalty.title': 'Programme fidélité',
    'loyalty.points': 'Points',
    'loyalty.tier': 'Niveau',
    'loyalty.rewards': 'Récompenses',
    'loyalty.redeem': 'Échanger',
    'loyalty.history': 'Historique',
    
    // Admin
    'admin.dashboard': 'Tableau de bord',
    'admin.orders': 'Commandes',
    'admin.products': 'Produits',
    'admin.customers': 'Clients',
    'admin.inventory': 'Inventaire',
    'admin.returns': 'Retours',
    'admin.reports': 'Rapports',
    'admin.finances': 'Finances',
    'admin.suppliers': 'Fournisseurs',
    'admin.settings': 'Paramètres',
    'admin.audit': 'Journal d\'audit',
    
    // Footer
    'footer.about': 'À propos',
    'footer.contact': 'Contact',
    'footer.help': 'Aide',
    'footer.terms': 'Conditions générales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.follow_us': 'Suivez-nous',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'S\'abonner',
    
    // Messages
    'msg.added_to_cart': 'Produit ajouté au panier',
    'msg.added_to_favorites': 'Ajouté aux favoris',
    'msg.removed_from_favorites': 'Retiré des favoris',
    'msg.order_placed': 'Commande confirmée',
    'msg.login_required': 'Veuillez vous connecter',
    'msg.welcome': 'Bienvenue',
    'msg.goodbye': 'À bientôt',
  },
  
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.shop': 'Магазин',
    'nav.cart': 'Корзина',
    'nav.favorites': 'Избранное',
    'nav.account': 'Мой аккаунт',
    'nav.admin': 'Администрирование',
    'nav.logout': 'Выход',
    'nav.login': 'Вход',
    
    // Common
    'common.search': 'Поиск...',
    'common.add': 'Добавить',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.view': 'Просмотр',
    'common.close': 'Закрыть',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.confirm': 'Подтвердить',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.previous': 'Предыдущий',
    'common.submit': 'Отправить',
    'common.filter': 'Фильтр',
    'common.sort': 'Сортировка',
    'common.all': 'Все',
    'common.none': 'Нет',
    
    // Product
    'product.add_to_cart': 'В корзину',
    'product.buy_now': 'Купить сейчас',
    'product.in_stock': 'В наличии',
    'product.out_of_stock': 'Нет в наличии',
    'product.low_stock': 'Мало на складе',
    'product.price': 'Цена',
    'product.original_price': 'Первоначальная цена',
    'product.discount': 'Скидка',
    'product.description': 'Описание',
    'product.reviews': 'Отзывы',
    'product.rating': 'Рейтинг',
    'product.compare': 'Сравнить',
    'product.add_to_compare': 'Добавить к сравнению',
    'product.remove_from_compare': 'Удалить из сравнения',
    
    // Cart
    'cart.title': 'Корзина',
    'cart.empty': 'Ваша корзина пуста',
    'cart.total': 'Итого',
    'cart.subtotal': 'Подытог',
    'cart.shipping': 'Доставка',
    'cart.checkout': 'Оформить заказ',
    'cart.continue_shopping': 'Продолжить покупки',
    'cart.remove_item': 'Удалить',
    'cart.quantity': 'Количество',
    
    // Checkout
    'checkout.title': 'Оформление заказа',
    'checkout.delivery': 'Доставка',
    'checkout.payment': 'Оплата',
    'checkout.summary': 'Сводка',
    'checkout.place_order': 'Подтвердить заказ',
    
    // Account
    'account.title': 'Мой аккаунт',
    'account.orders': 'Мои заказы',
    'account.settings': 'Настройки',
    'account.address': 'Мои адреса',
    'account.loyalty': 'Программа лояльности',
    
    // Loyalty
    'loyalty.title': 'Программа лояльности',
    'loyalty.points': 'Баллы',
    'loyalty.tier': 'Уровень',
    'loyalty.rewards': 'Награды',
    'loyalty.redeem': 'Обменять',
    'loyalty.history': 'История',
    
    // Admin
    'admin.dashboard': 'Панель управления',
    'admin.orders': 'Заказы',
    'admin.products': 'Товары',
    'admin.customers': 'Клиенты',
    'admin.inventory': 'Инвентаризация',
    'admin.returns': 'Возвраты',
    'admin.reports': 'Отчеты',
    'admin.finances': 'Финансы',
    'admin.suppliers': 'Поставщики',
    'admin.settings': 'Настройки',
    'admin.audit': 'Журнал аудита',
    
    // Footer
    'footer.about': 'О нас',
    'footer.contact': 'Контакты',
    'footer.help': 'Помощь',
    'footer.terms': 'Условия использования',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.follow_us': 'Подписывайтесь',
    'footer.newsletter': 'Рассылка',
    'footer.subscribe': 'Подписаться',
    
    // Messages
    'msg.added_to_cart': 'Товар добавлен в корзину',
    'msg.added_to_favorites': 'Добавлено в избранное',
    'msg.removed_from_favorites': 'Удалено из избранного',
    'msg.order_placed': 'Заказ подтвержден',
    'msg.login_required': 'Пожалуйста, войдите',
    'msg.welcome': 'Добро пожаловать',
    'msg.goodbye': 'До свидания',
  },
  
  bm: {
    // Navigation
    'nav.home': 'Ginen',
    'nav.shop': 'Sɔngɔtɔya',
    'nav.cart': 'Kɛlɛ',
    'nav.favorites': 'N bana',
    'nav.account': 'N tɔɔlɔ',
    'admin': 'Kɛlɛkɛlɛya',
    'nav.logout': 'Fɛn',
    'nav.login': 'Di tɔɔlɔ',
    
    // Common
    'common.search': 'Kɛnɛ...',
    'common.add': 'Fa',
    'common.save': 'Dɔn',
    'common.cancel': 'Kan',
    'common.delete': 'Fili',
    'common.edit': 'Sɔn',
    'common.view': 'Kana',
    'common.close': 'Su',
    'common.loading': 'Kɛnɛ...',
    'common.error': 'Hɛrɛ',
    'common.success': 'Kɛlɛ',
    'common.confirm': 'Tɔɔn',
    'common.yes': 'Aa',
    'common.no': 'Ayi',
    'common.back': 'Kɔnɔ',
    'common.next': 'Jigin',
    'common.previous': 'Kɔnɔ',
    'common.submit': 'Fɛn',
    'common.filter': 'Sɔn',
    'common.sort': 'Kɛlɛ',
    'common.all': 'Mun',
    'common.none': 'Kelen',
    
    // Product
    'product.add_to_cart': 'Fa kɛlɛ la',
    'product.buy_now': 'Tɔɔ ni',
    'product.in_stock': 'I ni',
    'product.out_of_stock': 'Kɔnɔ kɛnɛ',
    'product.low_stock': 'Kɛlɛ i',
    'product.price': 'Dɔnna',
    'product.original_price': 'Dɔnna kɔnɔ',
    'product.discount': 'Kɛlɛ',
    'product.description': 'Fɛnbaga',
    'product.reviews': 'Kana',
    'product.rating': 'Dɔnna',
    'product.compare': 'Kɛlɛ',
    'product.add_to_compare': 'Fa kɛlɛ la',
    'product.remove_from_compare': 'Fili kɛlɛ la',
    
    // Cart
    'cart.title': 'N kɛlɛ',
    'cart.empty': 'I kɛlɛ kelen kɔnɔ',
    'cart.total': 'Mun',
    'cart.subtotal': 'Kɛlɛ',
    'cart.shipping': 'Fɛn',
    'cart.checkout': 'Fɛn kɛlɛ',
    'cart.continue_shopping': 'Jigin tɔɔ',
    'cart.remove_item': 'Fili',
    'cart.quantity': 'Mun',
    
    // Messages
    'msg.added_to_cart': 'Fa kɛlɛ la',
    'msg.added_to_favorites': 'Fa n bana la',
    'msg.removed_from_favorites': 'Fili n bana la',
    'msg.order_placed': 'Kɛlɛ dɔn',
    'msg.login_required': 'I ka tɔɔlɔ',
    'msg.welcome': 'I ni ce',
    'msg.goodbye': 'I ni ce',
  }
}

// Fonction pour obtenir une traduction
export function t(key: string, lang: Language = 'fr'): string {
  return translations[lang]?.[key] || translations.fr[key] || key
}

// Hook simple pour les traductions
export function useTranslation() {
  const savedLang = (typeof window !== 'undefined' 
    ? localStorage.getItem('rmarket_language') 
    : null) as Language || 'fr'
  
  const [language, setLanguageState] = React.useState<Language>(savedLang)
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('rmarket_language', lang)
  }
  
  const translate = (key: string): string => {
    return t(key, language)
  }
  
  return { language, setLanguage, t: translate }
}

// Import React pour le hook
import React from 'react'
