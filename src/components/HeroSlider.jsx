import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroSlides } from '../data/products';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <div className="relative w-full h-[80vh] min-h-[480px] max-h-[750px] overflow-hidden">
      {heroSlides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/85 via-brand-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/50 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-brand-accent" />
            <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">{slide.badge}</span>
          </div>

          <h1 className="text-brand-cream text-5xl md:text-6xl font-black leading-[1.08] mb-4" style={{ whiteSpace: 'pre-line' }}>
            {slide.title}
          </h1>

          <p className="text-brand-cream/75 text-base md:text-lg leading-relaxed mb-8 max-w-md">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/products')}
              className="bg-brand-accent text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              {slide.cta}
            </button>
            <button
              onClick={() => navigate('/about')}
              className="border border-white/30 text-white font-medium px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm border border-white/15 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % heroSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm border border-white/15 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'bg-brand-accent w-6 h-2' : 'bg-white/40 w-2 h-2 hover:bg-white/70'}`} />
        ))}
      </div>
    </div>
  );
}
