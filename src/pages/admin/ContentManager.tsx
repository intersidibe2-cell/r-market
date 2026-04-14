import { useState } from 'react'
import { Image, Save, Plus, Trash2, Upload, RefreshCw } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'

interface SliderImage {
  id: number
  image: string
  title: string
  subtitle: string
  link: string
  active: boolean
}

interface CategoryImage {
  id: string
  name: string
  image: string
}

const defaultSliders: SliderImage[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=500&fit=crop&crop=face", title: "Bienvenue sur R-Market", subtitle: "Le marketplace N°1 au Mali 🇲🇱", link: "/shop", active: true },
  { id: 2, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&h=500&fit=crop&crop=face", title: "Mode Africaine", subtitle: "Bazin, Wax, Broderies traditionnelles", link: "/shop?category=mode", active: true },
  { id: 3, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&h=500&fit=crop&crop=face", title: "Beauté Africaine", subtitle: "Cosmétiques, soins, parfums", link: "/shop?category=sante", active: true },
  { id: 4, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&h=500&fit=crop&crop=face", title: "Électronique", subtitle: "iPhone, Samsung, Tecno au meilleur prix", link: "/shop?category=electronique", active: true },
]

const defaultCategories: CategoryImage[] = [
  { id: "mode", name: "Mode & Vêtements", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face" },
  { id: "electronique", name: "Électronique", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop" },
  { id: "sante", name: "Santé & Beauté", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop" },
  { id: "maison", name: "Maison & Décoration", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop" },
  { id: "alimentation", name: "Alimentation", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop" },
  { id: "adulte", name: "Articles adultes", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop" },
]

export default function ContentManager() {
  const [sliders, setSliders] = useState<SliderImage[]>(defaultSliders)
  const [categories, setCategories] = useState<CategoryImage[]>(defaultCategories)
  const [logoUrl, setLogoUrl] = useState("/logo.svg")
  const [saved, setSaved] = useState(false)

  const updateSlider = (id: number, field: keyof SliderImage, value: string | boolean) => {
    setSliders(sliders.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const addSlider = () => {
    const newId = Math.max(...sliders.map(s => s.id), 0) + 1
    setSliders([...sliders, {
      id: newId,
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=500&fit=crop&crop=face",
      title: "Nouveau slide",
      subtitle: "Description",
      link: "/shop",
      active: true
    }])
  }

  const deleteSlider = (id: number) => {
    setSliders(sliders.filter(s => s.id !== id))
  }

  const updateCategoryImage = (id: string, image: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, image } : c))
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('rmarket_sliders', JSON.stringify(sliders))
    localStorage.setItem('rmarket_categories', JSON.stringify(categories))
    localStorage.setItem('rmarket_logo', logoUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setSliders(defaultSliders)
    setCategories(defaultCategories)
    setLogoUrl("/logo.svg")
    localStorage.removeItem('rmarket_sliders')
    localStorage.removeItem('rmarket_categories')
    localStorage.removeItem('rmarket_logo')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-6 h-6" />
            Gestionnaire de contenu
          </h1>
          <p className="text-gray-500 text-sm">Modifiez les images du site</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Réinitialiser
          </button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white ${saved ? 'bg-green-500' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>
            <Save className="w-4 h-4" /> {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🖼️</span> Logo du site
        </h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Logo' }} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">URL du logo</label>
            <input
              type="text"
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              placeholder="/logo.png ou https://..."
            />
            <p className="text-xs text-gray-500 mt-1">Utilisez /logo.png pour le logo local ou une URL externe</p>
          </div>
        </div>
      </div>

      {/* Slider Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">🎠</span> Slider / Bannière
          </h2>
          <button onClick={addSlider} className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {sliders.map((slider, index) => (
            <div key={slider.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">Slide {index + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={slider.active}
                      onChange={e => updateSlider(slider.id, 'active', e.target.checked)}
                      className="rounded"
                    />
                    Actif
                  </label>
                  <button onClick={() => deleteSlider(slider.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Image du slide</label>
                  <ImageUpload
                    onUpload={(url) => updateSlider(slider.id, 'image', url)}
                    currentImage={slider.image}
                    type="both"
                    maxSizeMB={10}
                  />
                  <p className="text-xs text-gray-400 mt-1">Ou URL :</p>
                  <input
                    type="text"
                    value={slider.image}
                    onChange={e => updateSlider(slider.id, 'image', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Titre</label>
                  <input
                    type="text"
                    value={slider.title}
                    onChange={e => updateSlider(slider.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sous-titre</label>
                  <input
                    type="text"
                    value={slider.subtitle}
                    onChange={e => updateSlider(slider.id, 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Lien</label>
                  <input
                    type="text"
                    value={slider.link}
                    onChange={e => updateSlider(slider.id, 'link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                </div>
              </div>
              <div className="mt-3">
                <img src={slider.image} alt={slider.title} className="w-full h-24 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x200?text=Image' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📁</span> Images des catégories
        </h2>
        <p className="text-sm text-gray-500 mb-4">Cliquez sur une image pour la modifier. Utilisez des images avec des femmes africaines pour un style adapté au Mali.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="aspect-square relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=' + cat.name }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-white text-sm font-semibold">{cat.name}</span>
                </div>
              </div>
              <div className="p-3">
                <ImageUpload
                  onUpload={(url) => updateCategoryImage(cat.id, url)}
                  currentImage={cat.image}
                  type="image"
                  maxSizeMB={5}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Suggestions */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-lg font-bold mb-4 text-blue-800">💡 Suggestions d'images africaines</h2>
        <p className="text-sm text-blue-700 mb-4">Utilisez ces termes pour trouver des images sur Unsplash ou d'autres sites :</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">👩🏾</p>
            <p className="text-xs text-gray-600">african woman fashion</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">👗</p>
            <p className="text-xs text-gray-600">african dress wax</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">💄</p>
            <p className="text-xs text-gray-600">black woman beauty</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">🏠</p>
            <p className="text-xs text-gray-600">african home decor</p>
          </div>
        </div>
      </div>
    </div>
  )
}
