import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { products, storeLocations } from '../data/products';

function SectionHeader({ eyebrow, title, subtitle, cta, ctaAction }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-brand-accent" />
            <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">{eyebrow}</span>
          </div>
        )}
        <h2 className="text-brand-cream text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-brand-muted text-sm mt-1.5 max-w-lg">{subtitle}</p>}
      </div>
      {cta && (
        <button onClick={ctaAction} className="flex items-center gap-1.5 text-brand-accent text-sm font-semibold hover:gap-2.5 transition-all flex-shrink-0">
          {cta} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
    </div>
  );
}

const categoryItems = [
  { label: 'Jeans', sub: 'Baggy, Painted, Patchwork & More', image: '/images/products/jeans-lightning-wave.jpeg', filter: 'jeans' },
  { label: 'Tees & Shirts', sub: 'Graphic Tees, Plaid Shirts', image: '/images/products/tee-saturn-orbit.jpeg', filter: 'tops' },
  { label: 'Hoodies & Jackets', sub: 'Zip Hoodies, Bombers, Vests', image: '/images/products/hoodie-diesel-grey.jpeg', filter: 'outerwear' },
  { label: 'Caps & Beanies', sub: 'Beanies, Military Caps, Bucket Hats', image: '/images/products/beanie-black.jpeg', filter: 'accessories' },
];

export default function Home() {
  const navigate = useNavigate();
  // Sale items: 1 jeans, 1 tee, 1 hoodie, then the puffer vest (id 30)
  const saleItems = (() => {
    const onSale = products.filter(p => p.isSale && !p.category.includes('accessories'));
    const vest = products.find(p => p.id === 30);
    const picked = [];
    const want = ['jeans', 'tops', 'outerwear'];
    for (const cat of want) {
      if (picked.length >= 3) break;
      const match = onSale.find(p => p.category.includes(cat) && p.id !== 30 && !picked.includes(p));
      if (match) picked.push(match);
    }
    if (vest) picked.push(vest);
    return picked.slice(0, 4);
  })();
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const featured = products.filter(p => !p.isSale && !p.isNew).slice(0, 4);
  const accessories = products.filter(p => p.category.includes('accessories')).slice(0, 3);

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* <HeroSlider /> */}

      {/* Marquee Strip */}
      <div className="bg-brand-accent/10 border-y border-brand-accent/20 overflow-hidden py-3">
        <div className="flex gap-10 animate-[marquee_22s_linear_infinite] whitespace-nowrap">
          {Array(8).fill(['Free Shipping Over $150', 'New Season Streetwear Drop', 'Members Get 10% Off', 'Premium Street Fabrics']).flat().map((text, i) => (
            <span key={i} className="text-brand-accent text-xs font-semibold uppercase tracking-widest flex items-center gap-4">
              {text} <span className="opacity-40">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Sales Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader eyebrow="Limited Time" title="Sales & Offers" subtitle="Save up to 40% on selected pieces. Grab them before they're gone." cta="View All Sales" ctaAction={() => navigate('/products?filter=sale')} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {saleItems.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Browse" title="Shop by Category" subtitle="Curated selections for every style and occasion." />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryItems.map(cat => (
              <div key={cat.filter} onClick={() => navigate(`/products?filter=${cat.filter}`)}
                className="relative group aspect-[3/4] rounded-xl overflow-hidden cursor-pointer">
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{cat.label}</h3>
                  <p className="text-white/65 text-xs mt-0.5">{cat.sub}</p>
                  <div className="mt-2 text-brand-accent text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Shop Now →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader eyebrow="Just Dropped" title="New Arrivals" subtitle="Fresh styles added to the collection — first to wear, first to shine." cta="See More" ctaAction={() => navigate('/products?filter=new-arrivals')} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Feature Banner */}
      <section className="relative overflow-hidden py-24">
        <img src="/images/products/jacket-bomber-distressed.jpeg" alt="Feature" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-bg/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">The SHiNi Way</span>
          <h2 className="text-brand-cream text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight">
            Real Drops,<br />Real Drip
          </h2>
          <p className="text-brand-cream/70 max-w-lg mx-auto mb-7 text-black leading-relaxed">
            Every SHiNi piece is a statement. Real product, hand-picked from the streets — heavyweight denim, fleece hoodies, graphic tees, and outerwear built for those who dress with intention.
          </p>
          <button onClick={() => navigate('/about')} className="bg-brand-cream text-brand-bg font-bold px-8 py-3.5 rounded-lg hover:bg-brand-accent hover:text-white transition-all duration-200">
            Our Story
          </button>
        </div>
      </section>

      {/* Accessories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader eyebrow="Complete the Look" title="Accessories" subtitle="The finishing touches that elevate every outfit." cta="Shop Accessories" ctaAction={() => navigate('/products?filter=accessories')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {accessories.map(p => (
            <div key={p.id} className="group rounded-xl overflow-hidden bg-brand-surface/30 border border-white/5 hover:border-brand-accent/30 transition-all duration-200 cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
              </div>
              <div className="p-4">
                <h3 className="text-brand-cream font-semibold text-sm">{p.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-brand-accent font-bold">${p.price.toFixed(2)}</span>
                  <span className={`text-xs font-medium ${p.inStock ? 'text-green-400' : 'text-red-400'}`}>{p.inStock ? '● In Stock' : '● Sold Out'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More Featured Items */}
      <section className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Editor's Pick" title="Featured Pieces" subtitle="Handpicked by our stylists for this season's must-haves." cta="Browse All" ctaAction={() => navigate('/products')} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Brand Design Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden bg-brand-accent p-8 md:p-14">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full border-4 border-white/10 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full border-4 border-white/10 -translate-x-1/4 translate-y-1/4" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">The Brand</span>
                <h2 className="text-white text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight">Bold by Design</h2>
                <p className="text-white/75 leading-relaxed mb-7 text-sm md:text-base">
                  SHiNi was born on the block and built for the streets. Our drops are for those who move with confidence — bold fits, premium fabrics, and zero compromise on style.
                </p>
                <div className="grid grid-cols-3 gap-5 mb-7">
                  {[['2019', 'Founded'], ['50+', 'Collections'], ['10K+', 'Happy Clients']].map(([num, label]) => (
                    <div key={label}>
                      <div className="text-white font-black text-2xl">{num}</div>
                      <div className="text-white/60 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/products')} className="bg-white text-brand-accent font-bold px-7 py-3.5 rounded-lg hover:bg-brand-cream transition-colors">
                  Shop the Brand
                </button>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-3">
                {[
                  '/images/products/jeans-black-patchwork.jpeg',
                  '/images/products/hoodie-supreme-pink.jpeg',
                  '/images/products/tee-airbrushed-face.jpeg',
                  '/images/products/shirt-casablanca-blue.jpeg',
                ].map((src, i) => (
                  <div key={i} className={`rounded-xl overflow-hidden ${i % 2 === 1 ? 'mt-5' : ''}`}>
                    <img src={src} alt="" className="w-full aspect-square object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-0.5 bg-brand-accent" />
              <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">Find Us</span>
            </div>
            <h2 className="text-brand-cream text-2xl md:text-3xl font-bold mb-4">Visit a SHiNi Store</h2>
            <p className="text-brand-muted text-sm leading-relaxed mb-7">
              Experience SHiNi in person. Our stores are designed to be more than a shopping destination — a space to discover and be inspired.
            </p>
            <div className="space-y-3">
              {storeLocations.slice(0, 2).map(store => (
                <div key={store.id} className="bg-white/4 border border-white/8 rounded-xl p-4">
                  <h4 className="text-brand-cream font-semibold text-sm">{store.name}</h4>
                  <p className="text-brand-muted text-xs mt-1">{store.address}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{store.hours}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/find-store')} className="mt-5 flex items-center gap-1.5 text-brand-accent text-sm font-semibold hover:gap-2.5 transition-all">
              All Locations <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <img src="/images/products/tee-airbrushed-face.jpeg" alt="SHiNi Store" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-white/70 text-xs uppercase tracking-widest">Lagos Flagship</p>
              <p className="text-white font-bold text-lg mt-1">Victoria Island</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
