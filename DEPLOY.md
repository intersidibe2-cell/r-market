# Guide de déploiement R-Market

## Option 1 : Vercel (Recommandé - Gratuit)

### Étape 1 : Créer un compte
1. Aller sur https://vercel.com
2. S'inscrire avec GitHub, GitLab ou Email

### Étape 2 : Préparer le projet
Le dossier `dist/` contient le site prêt à déployer.

### Étape 3 : Déployer via CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### Étape 4 : Configurer le domaine
1. Dans Vercel Dashboard → Settings → Domains
2. Ajouter `r-market.shop`
3. Noter les DNS fournis par Vercel

### Étape 5 : Configurer DNS chez Ionos
1. Se connecter à Ionos
2. Aller dans DNS du domaine r-market.shop
3. Ajouter les enregistrements :
   - Type: A → Valeur: 76.76.21.21
   - Type: CNAME → www → cname.vercel-dns.com

---

## Option 2 : Netlify (Alternative gratuite)

### Via interface web
1. Aller sur https://app.netlify.com/drop
2. Glisser le dossier `dist/`
3. Le site est en ligne !

### Configurer le domaine
1. Domain settings → Add custom domain
2. Entrer `r-market.shop`
3. Suivre les instructions DNS

---

## Option 3 : Ionos (Si vous voulez rester chez eux)

### Prérequis
- Hébergement web Ionos (PHP/Node.js)
- Accès FTP ou SSH

### Étapes
1. Uploader le contenu de `dist/` dans `htdocs/`
2. Configurer les redirects pour SPA (index.html)

---

## Commandes utiles

```bash
# Build pour production
npm run build

# Prévisualiser localement
npm run preview

# Déployer sur Vercel
vercel --prod
```

---

## Après déploiement

### URLs finales
- Site principal : https://r-market.shop
- Boutique russe : https://r-market.shop/ru
- Admin : https://r-market.shop/admin

### Mise à jour
À chaque modification :
1. `npm run build`
2. `vercel --prod` (ou redéploiement automatique si connecté à GitHub)

---

## Support
En cas de problème :
- Vercel Docs : https://vercel.com/docs
- Netlify Docs : https://docs.netlify.com
