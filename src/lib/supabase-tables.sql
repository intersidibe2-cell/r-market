-- =============================================
-- ETAPE 0: Migrer les donnees existantes AVANT de modifier la contrainte
-- ============================================

-- Mettre a jour les statuts existants vers les nouveaux statuts
UPDATE commandes SET 
  status = CASE 
    WHEN status = 'confirmed' THEN 'sent_to_supplier'
    WHEN status = 'shipped' THEN 'in_delivery'
    WHEN status = 'delivered' THEN 'delivered'
    WHEN status = 'cancelled' THEN 'cancelled'
    ELSE 'pending'
  END
WHERE status NOT IN ('pending', 'sent_to_supplier', 'picked_up', 'qr_labeled', 'in_delivery', 'delivered', 'cancelled', 'unavailable');

-- ============================================
-- ETAPE 1: MODIFIER TABLE COMMANDES
-- ============================================

-- Supprimer l'ancien CHECK constraint sur status
ALTER TABLE commandes DROP CONSTRAINT IF EXISTS commandes_status_check;

-- Ajouter le nouveau CHECK avec les 8 statuts du workflow reel
ALTER TABLE commandes ADD CONSTRAINT commandes_status_check 
  CHECK (status IN (
    'pending',              -- En attente (nouvelle commande)
    'sent_to_supplier',     -- Envoyee au fournisseur via WhatsApp
    'picked_up',            -- Recuperee par l'equipe
    'qr_labeled',           -- QR code colle + stockage temporaire
    'in_delivery',          -- En cours de livraison
    'delivered',            -- Livree au client
    'cancelled',            -- Annulee
    'unavailable'           -- Produit indisponible chez fournisseur
  ));

-- Ajouter les colonnes manquantes
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS supplier_id UUID;
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS supplier_name TEXT;
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS qr_code TEXT;

-- ============================================
-- ETAPE 2: METTRE A JOUR TABLE PRODUITS
-- ============================================

ALTER TABLE produits ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.5;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS sold INTEGER DEFAULT 0;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS is_adult BOOLEAN DEFAULT FALSE;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS supplier_id UUID;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE produits ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS qr_code TEXT;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_produits_category ON produits(category);
CREATE INDEX IF NOT EXISTS idx_produits_supplier ON produits(supplier_id);
CREATE INDEX IF NOT EXISTS idx_produits_active ON produits(is_active);

-- ============================================
-- ETAPE 3: METTRE A JOUR TABLE FOURNISSEURS
-- ============================================

ALTER TABLE fournisseurs ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE fournisseurs ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE fournisseurs ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
ALTER TABLE fournisseurs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE fournisseurs ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE fournisseurs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- ETAPE 4: TABLE RETOURS
-- ============================================

CREATE TABLE IF NOT EXISTS retours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID,
  order_number TEXT,
  client_name TEXT,
  client_phone TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ETAPE 5: RLS POLICIES
-- ============================================

ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE retours ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'produits' AND policyname = 'Allow all produits') THEN
    CREATE POLICY "Allow all produits" ON produits FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fournisseurs' AND policyname = 'Allow all fournisseurs') THEN
    CREATE POLICY "Allow all fournisseurs" ON fournisseurs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retours' AND policyname = 'Allow all retours') THEN
    CREATE POLICY "Allow all retours" ON retours FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;

-- ============================================
-- ETAPE 6: TABLES POUR LA BOUTIQUE RUSSE
-- ============================================

-- Table: produits_russe (produits pour la boutique russe)
CREATE TABLE IF NOT EXISTS produits_russe (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,           -- Nom en français
    name_ru TEXT NOT NULL,        -- Nom en russe
    description TEXT,             -- Description en français
    description_ru TEXT,          -- Description en russe
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    image TEXT,
    category TEXT DEFAULT 'souvenirs',  -- souvenirs, alcohol, food, exchange
    badge TEXT,
    rating NUMERIC DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 100,
    sold INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sku TEXT UNIQUE,
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_produits_russe_category ON produits_russe(category);
CREATE INDEX IF NOT EXISTS idx_produits_russe_active ON produits_russe(is_active);

-- Table: commandes_russe (commandes de la boutique russe)
CREATE TABLE IF NOT EXISTS commandes_russe (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    client_code TEXT NOT NULL,        -- Code anonyme du client
    client_whatsapp TEXT,             -- WhatsApp du client
    client_telegram TEXT,             -- Telegram du client
    delivery_address TEXT,
    items JSONB DEFAULT '[]',
    total INTEGER NOT NULL,
    currency TEXT DEFAULT 'CFA' CHECK (currency IN ('CFA', 'USD', 'EUR')),
    total_cfa INTEGER,                -- Total converti en CFA pour stats
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    type TEXT NOT NULL CHECK (type IN ('russian')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour commandes russes
CREATE INDEX IF NOT EXISTS idx_commandes_russe_order_number ON commandes_russe(order_number);
CREATE INDEX IF NOT EXISTS idx_commandes_russe_status ON commandes_russe(status);
CREATE INDEX IF NOT EXISTS idx_commandes_russe_created_at ON commandes_russe(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_russe_currency ON commandes_russe(currency);

-- Table: taux_change (historique des taux de change)
CREATE TABLE IF NOT EXISTS taux_change (
    id SERIAL PRIMARY KEY,
    usd_to_cfa NUMERIC NOT NULL,
    eur_to_cfa NUMERIC NOT NULL,
    eur_to_usd NUMERIC NOT NULL,
    date_recorded DATE DEFAULT CURRENT_DATE,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Index pour taux de change
CREATE INDEX IF NOT EXISTS idx_taux_change_date ON taux_change(date_recorded DESC);

-- ============================================
-- ETAPE 7: RLS POUR TABLES RUSSES
-- ============================================

ALTER TABLE produits_russe ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes_russe ENABLE ROW LEVEL SECURITY;
ALTER TABLE taux_change ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'produits_russe' AND policyname = 'Allow all produits_russe') THEN
    CREATE POLICY "Allow all produits_russe" ON produits_russe FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'commandes_russe' AND policyname = 'Allow all commandes_russe') THEN
    CREATE POLICY "Allow all commandes_russe" ON commandes_russe FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'taux_change' AND policyname = 'Allow all taux_change') THEN
    CREATE POLICY "Allow all taux_change" ON taux_change FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;

-- ============================================
-- INSERTIONS INITIALES POUR LA BOUTIQUE RUSSE
-- ============================================

-- Insérer les produits russes initiaux si la table est vide
INSERT INTO produits_russe (name, name_ru, description, description_ru, price, original_price, image, category, description, badge, rating, reviews, stock, sold)
SELECT name, name_ru, description, description_ru, price, original_price, image, category, description, badge, rating, reviews, stock, sold
FROM (VALUES
    -- Souvenirs & Artisanat
    (1001, 'Boubou traditionnel', 'Boubou traditionnel malien', 'Традиционный малийский бубу', 35000, 55000, 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=500&h=500&fit=crop', 'souvenirs', 'Boubou traditionnel malien en bazin riche avec broderies artisanales.', 'Традиционный малийский бубу в богатом базине с artisanной вышивкой.', 'Artisan', 4.9, 567, 80, 340),
    (1002, 'Pagne wax hollandais Vlisco', 'Pagne wax hollandais Vlisco authentic', 'Подлинный голландский восковой пagne Vlisco', 18000, 25000, 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=500&h=500&fit=crop', 'souvenirs', 'Vêtement pagne wax Vlisco authentique. Motifs variés.', 'Подлинная одежда из восковой ткани Vlisco. Различные узоры.', 'Best-seller', 4.7, 890, 150, 600),
    (1003, 'Statuette Dogon', 'Statuette Dogon en bois sculpté', 'Догонская статуэтка из резанного дерева', 45000, 60000, 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&h=500&fit=crop', 'souvenirs', 'Artisanat malien authentique, bois sculpté', 'Аутентичный малийский ремесленный товар, вырезанное дерево', 'Artisan', 4.9, 5, 8, 3),
    (1004, 'Bijoux Argent Massalia', 'Bracelet artisanal en argent, Mali', 'Артистический серебряный браслет, Мали', 65000, 85000, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop', 'souvenirs', 'Bracelet artisanal en argent, Mali', 'Артистический серебряный браслет, Мали', 'Artisan', 5.0, 7, 5, 2),
    (1005, 'Tenture Murale Bogolan', 'Tenture murale bogolan, 150x100cm', 'Боголанский гобелен, 150x100см', 42000, 55000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', 'souvenirs', 'Tenture artisanale, 150x100cm', 'Артистический гобелен, 150x100см', 'Artisan', 4.8, 11, 12, 8),
    (1006, 'Mèches cheveux qualité premium', 'Mèches cheveux 100% humaines. Couleurs variées.', 'Волосы на наращивание 100% человеческие. Различные цвета.', 15000, 22000, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=500&fit=crop', 'souvenirs', 'Mèches cheveux qualité premium', 'Премиум волосы для наращивания', 'Best-seller', 4.7, 1890, 100, 1450),
    
    -- Alcools & Boissons
    (2001, 'Whisky Importé', 'Whisky importé de qualité', 'Импортный виски высокого качества', 25000, 35000, 'https://images.unsplash.com/photo-1514731704710-2bac96bee12c?w=500&h=500&fit=crop', 'alcohol', 'Whisky premium importé', 'Премиум импортный виски', 'Nouveau', 4.6, 234, 45, 180),
    (2002, 'Vin Rouge Français', 'Vin rouge français AOC', 'Французское красное вино AOC', 18000, 25000, 'https://images.unsplash.com/photo-1511015416381-5d68e1a92d7f?w=500&h=500&fit=crop', 'alcohol', 'Vin rouge français de qualité', 'Высококачественное французское красное вино', 'Promo', 4.4, 567, 60, 320),
    (2003, 'Champagne Importé', 'Champagne brut importé', 'Импортное шампанское брют', 45000, 65000, 'https://images.unsplash.com/photo-1594736607984-0dd98c6c6b1d?w=500&h=500&fit=crop', 'alcohol', 'Champagne brut pour célébration', 'Шампанское брют для торжеств', 'Exclusif', 4.8, 89, 15, 45),
    (2004, 'Rhum Agricole', 'Rhum agricole des Antilles', 'Агрокольский ром с Антильских островов', 22000, 30000, 'https://images.unsplash.com/photo-1600891996335-780g7rcbc6b1?w=500&h=500&fit=crop', 'alcohol', 'Rhum agricole traditionnel', 'Традиционный агрокольский ром', 'Populaire', 4.5, 432, 80, 290),
    (2005, 'Vodka Premium', 'Vodka triple distillée', 'Тройная дистилляция водки', 15000, 22000, 'https://images.unsplash.com/photo-1600891994492-4e9d74840deb?w=500&h=500&fit=crop', 'alcohol', 'Vodka premium qualité supérieure', 'Премиум водка высшего качества', 'Nouveau', 4.6, 678, 100, 420),
    (2006, 'Bière Importée', 'Bière pression importée', 'Импортное разливное пиво', 8000, 12000, 'https://images.unsplash.com/photo-1600891994931-30a4d637d5c3?w=500&h=500&fit=crop', 'alcohol', 'Bière de qualité importée', 'Качественное импортное пиво', 'Local', 4.3, 2345, 200, 980),
    
    -- Produits Alimentaires
    (3001, 'Thé du Mali vert', 'Thé vert malien de qualité', 'Зеленый чай из Мали высокого качества', 3500, 5000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop', 'food', 'Thé vert malien de qualité. Saveur authentique.', 'Аутентичный малийский зеленый чай высокого качества', 'Local', 4.8, 2345, 500, 1800),
    (3002, 'Poivre noir de Tombouctou', 'Poivre noir authentique de Tombouctou', 'Подлинный черный перец из Тимбукту', 6000, 9000, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop', 'food', 'Poivre noir de Tombouctou. Arôme intense.', 'Интенсивный аромат черного перца из Тимбукту', 'Premium', 4.9, 890, 300, 650),
    (3003, 'Beurre de karité bio pur 500ml', 'Beurre de karité 100% pur et bio du Mali.', '100% чистое и биологическое караите из Мали 500мл', 5000, 8000, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop', 'food', 'Beurre de karité bio pur du Mali.', 'Био чистое караите из Мали.', 'Bio', 4.8, 1678, 400, 1320),
    (3004, 'Gingembre frais bio', 'Gingembre frais local. Pour cuisine et santé.', 'Свежий местный имбирь. Для кухни и здоровья.', 2500, 4000, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=500&fit=crop', 'food', 'Gingembre frais local pour cuisine et santé', 'Местный органический имбирь для кухни и здоровья', 'Snack', 4.6, 1234, 600, 890),
    (3005, 'Miel naturel du Burkina', 'Miel pur 100% naturel. Propriétés médicinales.', '100% натуральный мед. Лечебные свойства.', 7500, 10000, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=500&fit=crop', 'food', 'Miel naturel du Burkina Faso', 'Натуральный мед из Буркина-Фасо', 'Bio', 4.8, 890, 200, 560),
    (3006, 'Farine de mil本地', 'Farine de mil pour bouillie et tg.', 'Мука из проса для каши и тг.', 2000, 3000, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', 'food', 'Farine de mil本地 pour nourriture', 'Мука из проса для еды', 'Staple', 4.5, 2345, 800, 1500),
    
    -- Taux de change (produit spécial)
    (9001, 'Taux de change USD/CFA', 'Taux de change actuel USD vers CFA', 'Текущий обменный курс USD к CFA', 1, NULL, 'https://images.unsplash.com/photo-1611974419941-2ef24bafccbd?w=500&h=500&fit=crop', 'exchange', 'Taux de change pour conversion monnaie', 'Обменный курс для конвертации валюты', NULL, 4.5, 0, 0, 0)
) AS v(id, name, name_ru, description, description_ru, price, original_price, image, category, description, badge, rating, reviews, stock, sold)
WHERE NOT EXISTS (SELECT 1 FROM produits_russe LIMIT 1);

-- Insérer les taux de change initiaux
INSERT INTO taux_change (usd_to_cfa, eur_to_cfa, eur_to_usd)
SELECT 600, 655, 1.09
WHERE NOT EXISTS (SELECT 1 FROM taux_change LIMIT 1);

-- ============================================
-- VERIFICATION FINALE
-- ============================================
SELECT 'commandes' as table_name, count(*) as rows FROM commandes
UNION ALL
SELECT 'clients', count(*) FROM clients
UNION ALL
SELECT 'produits', count(*) FROM produits
UNION ALL
SELECT 'fournisseurs', count(*) FROM fournisseurs
UNION ALL
SELECT 'retours', count(*) FROM retours
UNION ALL
SELECT 'produits_russe', count(*) FROM produits_russe
UNION ALL
SELECT 'commandes_russe', count(*) FROM commandes_russe
UNION ALL
SELECT 'taux_change', count(*) FROM taux_change;