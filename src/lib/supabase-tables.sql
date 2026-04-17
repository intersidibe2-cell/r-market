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
-- VERIFICATION
-- ============================================
SELECT 'commandes' as table_name, count(*) as rows FROM commandes
UNION ALL
SELECT 'clients', count(*) FROM clients
UNION ALL
SELECT 'produits', count(*) FROM produits
UNION ALL
SELECT 'fournisseurs', count(*) FROM fournisseurs
UNION ALL
SELECT 'retours', count(*) FROM retours;