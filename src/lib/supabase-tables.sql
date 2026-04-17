-- =============================================
-- TABLES POUR R-MARKET E-COMMERCE
-- =============================================

-- Table: COMMANDES
CREATE TABLE IF NOT EXISTS commandes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_address TEXT,
    items JSONB DEFAULT '[]',
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    type TEXT NOT NULL CHECK (type IN ('mali', 'russian')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_commandes_order_number ON commandes(order_number);
CREATE INDEX IF NOT EXISTS idx_commandes_phone ON commandes(client_phone);
CREATE INDEX IF NOT EXISTS idx_commandes_status ON commandes(status);
CREATE INDEX IF NOT EXISTS idx_commandes_type ON commandes(type);
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON commandes(created_at DESC);

-- Table: CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    address TEXT,
    city TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);

-- Table: PRODUITS
CREATE TABLE IF NOT EXISTS produits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER DEFAULT 0,
    category TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: FOURNISSEURS
CREATE TABLE IF NOT EXISTS fournisseurs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT NOT NULL,
    city TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation RLS (désactivé pour cet exemple)
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON commandes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON clients FOR ALL USING (true) WITH CHECK (true);