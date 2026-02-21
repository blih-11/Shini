import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const allCategories = [
  { id: 'all', label: 'All' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'sale', label: 'Sale' },
  { id: 'jeans', label: 'Jeans' },
  { id: 'tops', label: 'Tops & Tees' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'bottoms', label: 'Shorts' },
  { id: 'accessories', label: 'Caps & Beanies' },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [sort, setSort] = useState('default');
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f) setActiveFilter(f);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.category.some(c => c.toLowerCase().includes(q)));
    }
    if (activeFilter === 'sale') list = list.filter(p => p.isSale);
    else if (activeFilter !== 'all') list = list.filter(p => p.category.includes(activeFilter));
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest') list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [activeFilter, sort, localSearch]);

  return (
    <div className="bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">The Collection</span>
          <h1 className="text-brand-cream text-3xl md:text-4xl font-bold mt-1">All Products</h1>
          <p className="text-brand-muted text-sm mt-1">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            {activeFilter !== 'all' ? ` in ${allCategories.find(c => c.id === activeFilter)?.label || activeFilter}` : ''}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-lg">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)} placeholder="Search products..."
            className="w-full bg-white/5 border border-white/12 text-brand-cream placeholder:text-brand-muted text-sm pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-brand-accent transition-colors" />
          {localSearch && (
            <button onClick={() => setLocalSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-cream">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {allCategories.map(cat => (
              <button key={cat.id} onClick={() => setActiveFilter(cat.id)}
                className={`text-sm px-4 py-2 rounded-full transition-all duration-200 font-medium ${activeFilter === cat.id ? 'bg-brand-accent text-white' : 'bg-white/5 border border-white/12 text-brand-muted hover:border-brand-accent hover:text-brand-cream'}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-white/5 border border-white/12 text-brand-muted text-sm px-4 py-2 rounded-full focus:outline-none focus:border-brand-accent cursor-pointer">
            <option value="default">Sort: Default</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-brand-cream font-bold text-xl mb-2">No products found</h3>
            <p className="text-brand-muted text-sm">Try adjusting your search or filters</p>
            <button onClick={() => { setLocalSearch(''); setActiveFilter('all'); }} className="mt-5 bg-brand-accent text-white font-medium px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
