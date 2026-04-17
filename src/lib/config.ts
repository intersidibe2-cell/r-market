// Configuration globale R-Market
export const CONFIG = {
  // WhatsApp gérant principal (reçoit toutes les notifications commandes)
  WHATSAPP_GERANT: '83806129',
  
  // Nom de la boutique
  SHOP_NAME: 'R-Market Mali',
  
  // URL du site
  SHOP_URL: 'https://r-market.shop',
  
  // Monnaies
  CURRENCY_CFA: 'FCFA',
  CURRENCY_EUR: 'EUR',
  
  // Livraison gratuite dès ce montant (FCFA)
  FREE_SHIPPING_THRESHOLD: 5000,
  
  // Frais livraison standard
  SHIPPING_FEE: 400,
}

// Générer URL WhatsApp avec message
export const whatsappUrl = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

// Notifier le gérant d'une nouvelle commande
export const notifyGerant = (orderNumber: string, clientName: string, clientPhone: string, address: string, items: any[], total: number) => {
  const itemsList = items.map((item: any) => `• ${item.name} x${item.quantity || item.qty} = ${(item.price * (item.quantity || item.qty)).toLocaleString()} FCFA`).join('\n')
  const message = `🛒 NOUVELLE COMMANDE R-MARKET\n\n📦 ${orderNumber}\n👤 Client: ${clientName}\n📞 Tél: ${clientPhone}\n📍 Adresse: ${address}\n\n🛍️ Articles:\n${itemsList}\n\n💰 Total: ${total.toLocaleString()} FCFA\n\n✅ Statut: En attente`
  window.open(whatsappUrl(CONFIG.WHATSAPP_GERANT, message), '_blank')
}

// Confirmer commande au client
export const confirmClientOrder = (clientPhone: string, clientName: string, orderNumber: string, total: number) => {
  const message = `Bonjour ${clientName} ! 👋\n\nVotre commande *${orderNumber}* a été reçue avec succès ✅\n\n💰 Total: ${total.toLocaleString()} FCFA\n\nNous vous contacterons bientôt pour la livraison.\n\nMerci de votre confiance ! 🙏\n\n— R-Market Mali`
  setTimeout(() => {
    window.open(whatsappUrl(clientPhone, message), '_blank')
  }, 1500)
}

// Notifier changement de statut commande
export const notifyStatusChange = (clientPhone: string, clientName: string, orderNumber: string, newStatus: string) => {
  const statusMessages: Record<string, string> = {
    confirmed: `✅ Votre commande *${orderNumber}* a été confirmée !`,
    picked_up: `📦 Votre commande *${orderNumber}* a été récupérée chez le fournisseur.`,
    ready_for_delivery: `🚚 Votre commande *${orderNumber}* est prête pour la livraison !`,
    in_delivery: `🛵 Votre commande *${orderNumber}* est en cours de livraison vers vous !`,
    delivered: `🎉 Votre commande *${orderNumber}* a été livrée ! Merci pour votre confiance.`,
    cancelled: `❌ Votre commande *${orderNumber}* a été annulée. Contactez-nous pour plus d'infos.`,
  }
  const text = statusMessages[newStatus]
  if (!text) return
  const message = `Bonjour ${clientName},\n\n${text}\n\n— R-Market Mali\n📞 Contactez-nous: wa.me/${CONFIG.WHATSAPP_GERANT}`
  window.open(whatsappUrl(clientPhone, message), '_blank')
}
