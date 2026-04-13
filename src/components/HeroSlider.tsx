import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=500&fit=crop&crop=face",
    title: "Bienvenue sur R-Market",
    subtitle: "Le marketplace N°1 au Mali 🇲🇱",
    cta: "Acheter maintenant",
    link: "/shop",
    gradient: "from-green-900/80 to-transparent"
  },
  {
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&h=500&fit=crop&crop=face",
    title: "Mode Africaine",
    subtitle: "Bazin, Wax, Broderies traditionnelles",
    cta: "Découvrir",
    link: "/shop?category=mode",
    gradient: "from-purple-900/80 to-transparent"
  },
  {
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&h=500&fit=crop&crop=face",
    title: "Beauté Africaine",
    subtitle: "Cosmétiques, soins, parfums pour femme",
    cta: "Voir la collection",
    link: "/shop?category=sante",
    gradient: "from-pink-900/80 to-transparent"
  },
  {
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&h=500&fit=crop&crop=face",
    title: "Électronique",
    subtitle: "iPhone, Samsung, Tecno, Infinix au meilleur prix",
    cta: "Profiter des offres",
    link: "/shop?category=electronique",
    gradient: "from-blue-900/80 to-transparent"
  },
  {
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1400&h=500&fit=crop&crop=face",
    title: "Maison & Décoration",
    subtitle: "Tout pour équiper votre maison",
    cta: "Explorer",
    link: "/shop?category=maison",
    gradient: "from-orange-900/80 to-transparent"
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative h-64 sm:h-80 md:h-96 lg:h-[440px] overflow-hidden rounded-2xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-16 max-w-xl">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm md:text-lg text-white/90 mb-6 drop-shadow">
                {slide.subtitle}
              </p>
              <a
                href={slide.link}
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-green-50 transition-colors shadow-lg"
              >
                {slide.cta} →
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
