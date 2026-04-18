import { Link } from 'react-router-dom'
import React from 'react'

// Simple admin hub showing Mali and Russie sections side by side
export default function DualAdmin() {
  const maliLinks = [
    { path: '/admin/orders-mali', label: 'Commandes Mali' },
    { path: '/admin/products-mali', label: 'Produits Mali' },
    { path: '/admin/inventory', label: 'Inventaire' },
    { path: '/admin/suppliers', label: 'Fournisseurs' },
    { path: '/admin/customers', label: 'Clients Mali' },
    { path: '/admin/finances', label: 'Finances' },
    { path: '/admin/reports', label: 'Rapports' },
    { path: '/admin/returns', label: 'Retours' },
    { path: '/admin/delivery', label: 'Livraison' },
    { path: '/admin/exchange-rates', label: 'Taux de Change' },
    { path: '/admin/photo-management', label: 'Gestion Photos' },
    { path: '/admin/qr-code-generator', label: 'QR Codes' },
    { path: '/admin/photo-planning', label: 'Planning Photos' },
    { path: '/admin/content-manager', label: 'Content Manager' },
    { path: '/admin/settings', label: 'Paramètres' },
    { path: '/admin/international-shops', label: 'Boutiques Intl' },
    { path: '/admin/delivery-management', label: 'Gestion Livraisons' },
    { path: '/admin/predictive-analytics', label: 'Analyses Prédictives' },
    { path: '/admin/heatmap', label: 'Carte Thermique' },
    { path: '/admin/behavior-analytics', label: 'Comportement' },
    { path: '/admin/analytics', label: 'Statistiques' },
    { path: '/admin/user-management', label: 'Gestion Utilisateurs' },
  ]

  const russeLinks = [
    { path: '/admin/russian-login', label: 'Connexion Russie' },
    { path: '/admin/russian-admin', label: 'Admin Russie' },
    { path: '/admin/russian-products', label: 'Produits Russie' },
    { path: '/admin/russian-orders', label: 'Commandes Russie' },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Panneau Admin — Mali et Russie</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <section style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eee' }}>
          <h2 style={{ marginBottom: 8 }}>Admin Mali</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
            {maliLinks.map(l => (
              <li key={l.path}>
                <Link to={l.path} style={{ display: 'block', padding: 12, borderRadius: 8, background: '#f6f7f9' }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eee' }}>
          <h2 style={{ marginBottom: 8 }}>Admin Russie</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
            {russeLinks.map(l => (
              <li key={l.path}>
                <Link to={l.path} style={{ display: 'block', padding: 12, borderRadius: 8, background: '#f6f7f9' }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
