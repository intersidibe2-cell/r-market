-- Exécuter ce script SQL dans Supabase SQL Editor pour créer la table produits

-- Table produits
CREATE TABLE IF NOT EXISTS produits (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT,
  category TEXT DEFAULT 'mode',
  description TEXT,
  badge TEXT,
  rating NUMERIC DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 100,
  sold INTEGER DEFAULT 0,
  is_adult BOOLEAN DEFAULT FALSE,
  supplier_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insérer les produits initiaux si la table est vide
INSERT INTO produits (name, price, original_price, image, category, description, badge, rating, reviews, stock, sold)
SELECT name, price, original_price, image, category, description, badge, rating, reviews, stock, sold
FROM (VALUES
  (1, 'Pagne Bogolan Artisan', 18500, 25000, 'https://images.unsplash.com/photo-1564880640063-0a8945d8d6b9?w=500&h=500&fit=crop', 'mode', 'Pagne traditionnel malien en coton bio, teinture artisanale', 'Nouveau', 4.8, 12, 45, 28),
  (2, 'Thé Vert Gunpowder', 3500, 5000, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=500&fit=crop', 'alimentation', 'Thé vert de qualité supérieure, importé du Maroc', NULL, 4.5, 8, 120, 65),
  (3, 'Statuette Dogon', 45000, 60000, 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&h=500&fit=crop', 'maison', 'Artisanat malien authentique, bois sculpté', 'Artisan', 4.9, 5, 8, 3),
  (4, 'Telephone Samsung A15', 145000, 165000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop', 'electronique', 'Smartphone 6.5", 128GB, Caméra 50MP', 'Promo', 4.6, 45, 25, 89),
  (5, 'Creme Beurre de Karite', 4500, 6000, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&h=500&fit=crop', 'sante', 'Crème hydratante naturelle 100ml', 'Bio', 4.7, 28, 65, 112)
) AS v(id, name, price, original_price, image, category, description, badge, rating, reviews, stock, sold)
WHERE NOT EXISTS (SELECT 1 FROM produits LIMIT 1);

-- Activer Row Level Security
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

-- Politique pour lecture publique
CREATE POLICY "Produits lisibles par tous" ON produits FOR SELECT USING (true);

-- Politique pour insertion admin (à améliorer avec authentification)
CREATE POLICY "Produits insérables" ON produits FOR INSERT WITH CHECK (true);

-- Politique pour mise à jour admin
CREATE POLICY "Produits modifiables" ON produits FOR UPDATE USING (true);

-- Politique pour suppression admin
CREATE POLICY "Produits supprimables" ON produits FOR DELETE USING (true);

-- Ajouter quelques produits de test si la table est vide
INSERT INTO produits (name, price, original_price, image, category, description, badge, rating, reviews, stock, sold)
VALUES
('Pagne Bazin Mali', 28000, 35000, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop', 'mode', 'Pagne bazin de haute qualité, Bamako', 'Populaire', 4.9, 15, 30, 22),
('Casque Audio Bluetooth', 18500, 25000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 'electronique', 'Casque sans fil, autonomie 20h', 'Nouveau', 4.4, 32, 45, 67),
('Tisane Gingembre Bio', 2500, 3500, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&h=500&fit=crop', 'alimentation', 'Gingembre séché bio, 100g', NULL, 4.6, 18, 200, 145),
('Bijoux Argent Massalia', 65000, 85000, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop', 'mode', 'Bracelet artisanal en argent, Mali', 'Artisan', 5.0, 7, 5, 2),
('Tenture Murale Bogolan', 42000, 55000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', 'maison', 'Tenture artisanale, 150x100cm', 'Artisan', 4.8, 11, 12, 8)
ON CONFLICT DO NOTHING;

SELECT * FROM produits LIMIT 10;